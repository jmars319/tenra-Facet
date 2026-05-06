import { buildFacetOrientationPacket } from "@facet/api-contracts";
import { facetOrientationPacketSchema } from "@facet/validation";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { runFacetSearch } from "../../../../lib/server/facet-search";

export async function POST(request: Request) {
  try {
    const response = await runFacetSearch(await request.json());
    const packet = facetOrientationPacketSchema.parse(
      buildFacetOrientationPacket({
        response,
        recommendedNextApp: "derive"
      })
    );

    return NextResponse.json(packet);
  } catch (caughtError) {
    if (caughtError instanceof ZodError) {
      return NextResponse.json({ error: "Invalid Facet orientation packet request.", issues: caughtError.issues }, { status: 400 });
    }

    return NextResponse.json({ error: "Facet orientation packet export failed." }, { status: 500 });
  }
}
