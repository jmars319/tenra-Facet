import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { runFacetSearch } from "../../../../lib/server/facet-search";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await runFacetSearch(payload);

    return NextResponse.json(response);
  } catch (caughtError) {
    if (caughtError instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid Facet search request.",
          issues: caughtError.issues.map((issue) => ({
            message: issue.message,
            path: issue.path.join(".")
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Facet search orchestration failed."
      },
      { status: 500 }
    );
  }
}
