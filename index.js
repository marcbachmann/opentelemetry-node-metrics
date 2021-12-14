module.exports = function setupNodeMetrics (meterProvider, config) {
  config = config || {}
  config.prefix = config.prefix ? config.prefix : ''
  config.labels = config.labels ? config.labels : {}

  let meter = meterProvider.getMeter('opentelemetry-node-metrics')

  // keep opentelemetry compatibility with v0.24.x
  if (!meter.createObservableGauge) {
    meter = {
      createObservableGauge: meter.createValueObserver.bind(meter),
      createHistogram: meter.createValueRecorder.bind(meter),
      createCounter: meter.createCounter.bind(meter),
      createUpDownCounter: meter.createUpDownCounter.bind(meter)
    }
  }

  require('./metrics/version')(meter, config)
  require('./metrics/processStartTime')(meter, config)
  require('./metrics/eventLoopLag')(meter, config)
  require('./metrics/gc')(meter, config)
  require('./metrics/heapSizeAndUsed')(meter, config)
  require('./metrics/heapSpacesSizeAndUsed')(meter, config)
  require('./metrics/osMemoryHeap')(meter, config)
  require('./metrics/processCpuTotal')(meter, config)
  require('./metrics/processHandles')(meter, config)
  require('./metrics/processMaxFileDescriptors')(meter, config)
  require('./metrics/processOpenFileDescriptors')(meter, config)
  require('./metrics/processRequests')(meter, config)
}
