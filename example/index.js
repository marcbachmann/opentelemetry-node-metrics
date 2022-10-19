const {MeterProvider, View, ExplicitBucketHistogramAggregation, InstrumentType} = require('@opentelemetry/sdk-metrics')
const {PrometheusExporter} = require('@opentelemetry/exporter-prometheus')

const meterProvider = new MeterProvider({
  views: [
    // Opentelemetry doesn't support boundaries
    // declarations during metrics construction.
    // It requires setting up a View that defines the boundaries.
    new View({
      instrumentName: 'nodejs_gc_duration_seconds',
      instrumentType: InstrumentType.HISTOGRAM,
      aggregation: new ExplicitBucketHistogramAggregation([0.001, 0.01, 0.1, 1, 2, 5])
    })
  ]
})
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
