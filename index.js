module.exports = function setupNodeMetrics (meterProvider, config) {
  config = config ? {...config} : {}
  config.prefix = config.prefix || ''
  config.labels = config.labels || {}

  const meter = meterProvider.getMeter('opentelemetry-node-metrics')

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
