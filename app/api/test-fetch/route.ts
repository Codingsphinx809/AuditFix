import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://example.com");

    return NextResponse.json({
      success: true,
      status: response.status,
      ok: response.ok,
    });
  } catch (error) {
    console.error("TEST FETCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
