import { resend } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const auditId = body.auditId;
    const email = body.email;

    console.log("=== FIX REQUEST START ===");
    console.log("Audit ID:", auditId);
    console.log("Email:", email);

    if (!auditId || typeof auditId !== "string") {
      return NextResponse.json(
        { error: "Audit ID is required." },
        { status: 400 },
      );
    }

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data: audit, error: auditError } = await supabaseAdmin
      .from("audits")
      .select("id, website_url, quick_score, deep_scores")
      .eq("id", auditId)
      .single();

    if (auditError || !audit) {
      console.error("Audit lookup error:", auditError);

      return NextResponse.json(
        { error: "Audit report not found." },
        { status: 404 },
      );
    }

    const { error: saveError } = await supabaseAdmin
      .from("fix_requests")
      .insert({
        audit_id: auditId,
        email: normalizedEmail,
      });

    if (saveError) {
      console.error("Fix Request Save Error:", saveError);

      return NextResponse.json(
        { error: "We could not save your request. Please try again." },
        { status: 500 },
      );
    }

    console.log("Lead saved successfully.");

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const adminEmail = process.env.AUDITFIX_ADMIN_EMAIL;
    const fromEmail =
      process.env.AUDITFIX_FROM_EMAIL ||
      "Auditfix <onboarding@resend.dev>";

    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
    console.log("Admin Email:", adminEmail);
    console.log("From Email:", fromEmail);

    const quickReportUrl = `${appUrl}/report/${auditId}`;
    const deepReportUrl = `${appUrl}/deep-report/${auditId}`;

    const deepScanStatus = audit.deep_scores
      ? "Completed"
      : "Not run";

    try {
      if (adminEmail) {
        const adminEmailResult = await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: "New Auditfix Fix Plan Request",
          html: `
            <h2>New Auditfix Lead</h2>
            <p><strong>Email:</strong> ${normalizedEmail}</p>
            <p><strong>Website:</strong> ${audit.website_url}</p>
            <p><strong>Quick Score:</strong> ${audit.quick_score ?? "N/A"}</p>
            <p><strong>Deep Scan:</strong> ${deepScanStatus}</p>
            <p><strong>Quick Report:</strong> <a href="${quickReportUrl}">${quickReportUrl}</a></p>
            <p><strong>Deep Report:</strong> <a href="${deepReportUrl}">${deepReportUrl}</a></p>
          `,
        });

        console.log("=== ADMIN EMAIL RESULT ===");
        console.dir(adminEmailResult, { depth: null });
      } else {
        console.warn(
          "AUDITFIX_ADMIN_EMAIL not configured. Skipping admin email.",
        );
      }

      const userEmailResult = await resend.emails.send({
        from: fromEmail,
        to: normalizedEmail,
        subject: "Your Auditfix report request was received",
        html: `
          <h2>Your Auditfix request was received</h2>

          <p>
            Thanks for requesting a personalized fix plan.
          </p>

          <p>
            You can view your audit report here:
          </p>

          <p>
            <a href="${quickReportUrl}">
              ${quickReportUrl}
            </a>
          </p>

          <p>
            Auditfix will use this report to prepare recommendations
            focused on patient calls, appointment requests, trust,
            and local visibility.
          </p>
        `,
      });

      console.log("=== USER EMAIL RESULT ===");
      console.dir(userEmailResult, { depth: null });
    } catch (emailError) {
      console.error("=== RESEND ERROR ===");
      console.error(emailError);

      // Do NOT fail the request if email fails.
      // Lead is already saved.
    }

    console.log("=== FIX REQUEST COMPLETE ===");

    return NextResponse.json({
      success: true,
      message: "Your fix plan request was received.",
    });
  } catch (error) {
    console.error("=== FIX REQUEST API ERROR ===");
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}