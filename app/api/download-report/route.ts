import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type RequestBody = {
  auditId?: string;
  reportType?: string;
  reportPath?: string;
};

export async function POST(request: Request) {
  try {
    const token = process.env.BROWSERLESS_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Browserless is not configured." },
        { status: 500 }
      );
    }

    const body: RequestBody = await request.json();

    if (!body.auditId) {
      return NextResponse.json(
        { error: "Missing audit ID." },
        { status: 400 }
      );
    }

    if (!body.reportPath) {
      return NextResponse.json(
        { error: "Missing report path." },
        { status: 400 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ??
      new URL(request.url).origin;

    const reportUrl = `${origin}${body.reportPath}?pdf=1`;

    console.log("Generating PDF from:", reportUrl);

    const browserlessResponse = await fetch(
      `https://production-sfo.browserless.io/pdf?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: reportUrl,
          options: {
            format: "A4",
            printBackground: true,
            displayHeaderFooter: true,
            margin: {
              top: "0.5in",
              bottom: "0.6in",
              left: "0.4in",
              right: "0.4in",
            },
          },
        }),
      }
    );

    if (!browserlessResponse.ok) {
      const text = await browserlessResponse.text();

      console.error("Browserless Error:", text);

      return NextResponse.json(
        {
          error: "Browserless could not generate the PDF.",
        },
        {
          status: browserlessResponse.status,
        }
      );
    }

    const pdf = await browserlessResponse.arrayBuffer();

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="auditfix-report-${body.auditId}.pdf"`,
      },
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Unexpected server error.",
      },
      {
        status: 500,
      }
    );
  }
}
