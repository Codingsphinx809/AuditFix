import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

function normalizeUrl(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

function getFetchErrorCode(error: unknown) {
  if (
    error instanceof Error &&
    "cause" in error &&
    typeof error.cause === "object" &&
    error.cause !== null &&
    "code" in error.cause
  ) {
    return String((error.cause as { code?: string }).code);
  }

  return "";
}

function hasPhoneNumber(html: string) {
  const phoneRegex =
    /(\+?1[\s.-]?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/;

  return phoneRegex.test(html) || html.includes("tel:");
}

function hasAppointmentCTA(html: string) {
  const keywords = [
    "appointment",
    "book now",
    "schedule",
    "request appointment",
    "new patient",
    "consultation",
    "contact us",
  ];

  return keywords.some((keyword) => html.toLowerCase().includes(keyword));
}

function hasContactLink(html: string) {
  const keywords = ["contact", "location", "directions", "office"];

  return keywords.some((keyword) => html.toLowerCase().includes(keyword));
}

function hasTrustSignals(html: string) {
  const keywords = [
    "reviews",
    "testimonials",
    "meet the doctor",
    "our team",
    "insurance",
    "financing",
    "dds",
    "dmd",
  ];

  return keywords.some((keyword) => html.toLowerCase().includes(keyword));
}

function hasLocationSignals(html: string) {
  const zipRegex = /\b\d{5}(?:-\d{4})?\b/;
  const keywords = ["located in", "serving", "directions", "near"];

  return (
    zipRegex.test(html) ||
    keywords.some((keyword) => html.toLowerCase().includes(keyword))
  );
}

function getTitle(html: string) {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return match?.[1]?.trim() || null;
}

function getMetaDescription(html: string) {
  const match = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  );

  return match?.[1]?.trim() || null;
}

function hasH1(html: string) {
  return /<h1[\s>]/i.test(html);
}

function hasSchema(html: string) {
  return (
    html.includes("application/ld+json") ||
    html.includes("schema.org") ||
    html.includes("LocalBusiness") ||
    html.includes("Dentist")
  );
}

function calculateQuickScore(checks: Record<string, boolean>) {
  let score = 0;

  if (checks.https) score += 10;
  if (checks.title) score += 10;
  if (checks.metaDescription) score += 10;
  if (checks.h1) score += 10;
  if (checks.phoneNumber) score += 15;
  if (checks.appointmentCTA) score += 20;
  if (checks.contactLink) score += 10;
  if (checks.locationSignals) score += 10;
  if (checks.trustSignals) score += 10;
  if (checks.schema) score += 5;

  return Math.min(score, 100);
}

async function fetchWebsite(url: string) {
  return fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AuditfixBot/1.0; +https://dentist.auditfix.ai)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const websiteUrl = body.websiteUrl;

    if (!websiteUrl || typeof websiteUrl !== "string") {
      return NextResponse.json(
        { error: "Website URL is required." },
        { status: 400 },
      );
    }

    const normalizedUrl = normalizeUrl(websiteUrl);

    let response: Response;
    let finalUrl = normalizedUrl;
    let httpsValid = normalizedUrl.startsWith("https://");

    try {
      response = await fetchWebsite(normalizedUrl);
    } catch (error) {
      const errorCode = getFetchErrorCode(error);

      console.error("Quick audit HTTPS fetch failed:", {
        url: normalizedUrl,
        message: error instanceof Error ? error.message : String(error),
        code: errorCode,
      });

      if (normalizedUrl.startsWith("https://")) {
        finalUrl = normalizedUrl.replace("https://", "http://");
        httpsValid = false;

        try {
          response = await fetchWebsite(finalUrl);
        } catch (fallbackError) {
          console.error("Quick audit HTTP fallback failed:", {
            url: finalUrl,
            message:
              fallbackError instanceof Error
                ? fallbackError.message
                : String(fallbackError),
            code: getFetchErrorCode(fallbackError),
          });

          return NextResponse.json(
            {
              error:
                "We could not access this website for a quick audit. The site may be blocking automated checks or may have a certificate issue.",
            },
            { status: 500 },
          );
        }
      } else {
        return NextResponse.json(
          {
            error:
              "We could not access this website for a quick audit. The site may be blocking automated checks.",
          },
          { status: 500 },
        );
      }
    }

    if (!response.ok) {
      console.error("Quick audit website returned bad status:", {
        url: finalUrl,
        status: response.status,
        statusText: response.statusText,
      });

      return NextResponse.json(
        {
          error:
            "We could not access this website for a quick audit. The site may be blocking automated checks.",
        },
        { status: 500 },
      );
    }

    const html = await response.text();
    const title = getTitle(html);
    const metaDescription = getMetaDescription(html);

    const checks = {
      https: httpsValid,
      title: Boolean(title),
      metaDescription: Boolean(metaDescription),
      h1: hasH1(html),
      phoneNumber: hasPhoneNumber(html),
      appointmentCTA: hasAppointmentCTA(html),
      contactLink: hasContactLink(html),
      locationSignals: hasLocationSignals(html),
      trustSignals: hasTrustSignals(html),
      schema: hasSchema(html),
    };

    const quickScore = calculateQuickScore(checks);

    const { data: savedAudit, error: saveError } = await supabaseAdmin
      .from("audits")
      .insert({
        website_url: normalizedUrl,
        audit_type: "quick",
        quick_score: quickScore,
        title,
        meta_description: metaDescription,
        checks,
      })
      .select("id")
      .single();

    if (saveError) {
      console.error("Supabase Save Error:", saveError);

      return NextResponse.json(
        {
          error:
            "The audit ran, but we could not save the report. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      auditId: savedAudit.id,
      websiteUrl: normalizedUrl,
      auditType: "quick",
      quickScore,
      title,
      metaDescription,
      checks,
    });
  } catch (error) {
    console.error("Quick Audit Error:", error);

    return NextResponse.json(
      {
        error:
          "We could not complete the quick audit. Please check the URL and try again.",
      },
      { status: 500 },
    );
  }
}