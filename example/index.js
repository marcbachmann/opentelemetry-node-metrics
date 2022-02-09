const {MeterProvider} = require('@opentelemetry/sdk-metrics-base')
const {PrometheusExporter} = require('@opentelemetry/exporter-prometheus')

const exporter = new PrometheusExporter({port: 9464, startServer: true}, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Prometheus scrape endpoint: http://localhost:%s%s`,
    PrometheusExporter.DEFAULT_OPTIONS.port,
    PrometheusExporter.DEFAULT_OPTIONS.endpoint
  )
})

const meterProvider = new MeterProvider({
  exporter,
  interval: 5000
})

require('opentelemetry-node-metrics')(meterProvider)


// With opentelemetry 0.27, the proecss somehow doesn't keep any open handles
// and stops without that
setInterval(() => {}, 1000)
