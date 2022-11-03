import type { MeterProvider } from "@opentelemetry/api-metrics";

declare module "opentelemetry-node-metrics" {
  function setupNodeMetrics(
    meterProvider: MeterProvider,
    config: { prefix: string; labels: { [key: string]: string } }
  ): void;
  export = setupNodeMetrics;
}
