import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

async function getPageSpeedResult(url: string) {
  const apiKey = process.env.PAGESPEED_API_KEY;

  const apiUrl = new URL(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
  );

  apiUrl.searchParams.set("url", url);
  apiUrl.searchParams.set("strategy", "mobile");
  apiUrl.searchParams.append("category", "PERFORMANCE");
  apiUrl.searchParams.append("category", "ACCESSIBILITY");
  apiUrl.searchParams.append("category", "SEO");
  apiUrl.searchParams.append("category", "BEST_PRACTICES");

  if (apiKey) {
    apiUrl.searchParams.set("key", apiKey);
  }

  const response = await fetch(apiUrl.toString());

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `PageSpeed failed. Status: ${response.status}. Details: ${errorText}`,
    );
  }

  return response.json();
}

function scoreFromCategory(data: any, category: string) {
  const score = data?.lighthouseResult?.categories?.[category]?.score;

  if (typeof score !== "number") {
    return null;
  }

  return Math.round(score * 100);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const websiteUrl = body.websiteUrl;
    const auditId = body.auditId;

    if (!websiteUrl || typeof websiteUrl !== "string") {
      return NextResponse.json(
        { error: "Website URL is required." },
        { status: 400 },
      );
    }

    if (!auditId || typeof auditId !== "string") {
      return NextResponse.json(
        { error: "Audit ID is required." },
        { status: 400 },
      );
    }

    const mobileResult = await getPageSpeedResult(websiteUrl);

    const deepScores = {
      mobilePerformance: scoreFromCategory(mobileResult, "performance"),
      desktopPerformance: null,
      accessibility: scoreFromCategory(mobileResult, "accessibility"),
      seo: scoreFromCategory(mobileResult, "seo"),
      bestPractices: scoreFromCategory(mobileResult, "best-practices"),
    };

    const { error: updateError } = await supabaseAdmin
      .from("audits")
      .update({
        audit_type: "quick_and_deep",
        deep_scores: deepScores,
      })
      .eq("id", auditId);

    if (updateError) {
      console.error("Supabase Deep Scan Save Error:", updateError);

      return NextResponse.json(
        {
          error:
            "The deep scan completed, but we could not save it. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      auditId,
      websiteUrl,
      scores: deepScores,
    });
  } catch (error) {
    console.error("Audit API Error:", error);

    return NextResponse.json(
      {
        error:
          "Google PageSpeed could not complete the deep scan right now. Please wait 30 seconds and try again.",
      },
      { status: 500 },
    );
  }
}