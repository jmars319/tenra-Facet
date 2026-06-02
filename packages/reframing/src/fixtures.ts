import type { OrientationBlock, ReframingRequestContext } from "./index";
import { resolveMockOrientationScenario } from "./fixtures/matching";
import { fallbackOrientation, mockOrientationScenarios } from "./fixtures/scenarioData";

export async function orientWithMockLayer(context: ReframingRequestContext): Promise<OrientationBlock> {
  return resolveMockOrientationScenario(context.query.text, mockOrientationScenarios)?.block ?? fallbackOrientation;
}
