'use strict'
const safeMemoryUsage = require('./helpers/safeMemoryUsage')
const NODEJS_HEAP_SIZE_TOTAL = 'nodejs_heap_size_total_bytes'
const NODEJS_HEAP_SIZE_USED = 'nodejs_heap_size_used_bytes'
const NODEJS_EXTERNAL_MEMORY = 'nodejs_external_memory_bytes'

module.exports = (meter, {labels, prefix}) => {
  const heapSizeTotal = meter.createObservableGauge(prefix + NODEJS_HEAP_SIZE_TOTAL, {
    description: 'Process heap size from Node.js in bytes.'
  }).bind(labels)

  const heapSizeUsed = meter.createObservableGauge(prefix + NODEJS_HEAP_SIZE_USED, {
    description: 'Process heap size used from Node.js in bytes.'
  }).bind(labels)

  const externalMemUsed = meter.createObservableGauge(prefix + NODEJS_EXTERNAL_MEMORY, {
    description: 'Node.js external memory size in bytes.'
  }, () => {
    const memUsage = safeMemoryUsage()
    if (!memUsage) return
    heapSizeTotal.update(memUsage.heapTotal)
    heapSizeUsed.update(memUsage.heapUsed)
    if (memUsage.external !== undefined) externalMemUsed.update(memUsage.external)
  }).bind(labels)
}

module.exports.metricNames = [
  NODEJS_HEAP_SIZE_TOTAL,
  NODEJS_HEAP_SIZE_USED,
  NODEJS_EXTERNAL_MEMORY
]
