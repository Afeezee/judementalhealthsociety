import { getImpactMetrics } from "@/lib/public-data";
import { ImpactCounterView } from "./ImpactCounterView";

export async function ImpactCounter() {
  const metrics = await getImpactMetrics();
  return <ImpactCounterView metrics={metrics} />;
}
