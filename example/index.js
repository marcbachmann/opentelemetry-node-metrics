const {MeterProvider} = require('@opentelemetry/metrics')
const {PrometheusExporter} = require('@opentelemetry/exporter-prometheus')

const exporter = new PrometheusExporter({startServer: true}, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Prometheus scrape endpoint: http://localhost:%s%s`,
    PrometheusExporter.DEFAULT_OPTIONS.port,
    PrometheusExporter.DEFAULT_OPTIONS.endpoint
  )
})

const meterProvider = new MeterProvider({
  exporter,
  interval: 2000
})

require('opentelemetry-node-metrics')(meterProvider)
