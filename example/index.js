const {MeterProvider} = require('@opentelemetry/sdk-metrics')
const {PrometheusExporter} = require('@opentelemetry/exporter-prometheus')

const meterProvider = new MeterProvider({})
const exporter = new PrometheusExporter({port: 9464}, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Prometheus scrape endpoint: http://localhost:%s%s`,
    PrometheusExporter.DEFAULT_OPTIONS.port,
    PrometheusExporter.DEFAULT_OPTIONS.endpoint
  )
})
meterProvider.addMetricReader(exporter)

require('opentelemetry-node-metrics')(meterProvider)


// With opentelemetry 0.33, the process somehow doesn't keep any open handles
// and stops without that
setInterval(() => {}, 1000)
