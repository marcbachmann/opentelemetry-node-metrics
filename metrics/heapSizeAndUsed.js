const safeMemoryUsage = require('./helpers/safeMemoryUsage')
const NODEJS_HEAP_SIZE_TOTAL = 'nodejs_heap_size_total_bytes'
const NODEJS_HEAP_SIZE_USED = 'nodejs_heap_size_used_bytes'
const NODEJS_EXTERNAL_MEMORY = 'nodejs_external_memory_bytes'

module.exports = (meter, {labels, prefix}) => {
  const heapSizeTotal = meter.createValueObserver(prefix + NODEJS_HEAP_SIZE_TOTAL, {
    description: 'Process heap size from Node.js in bytes.'
  })

  const heapSizeUsed = meter.createValueObserver(prefix + NODEJS_HEAP_SIZE_USED, {
    description: 'Process heap size used from Node.js in bytes.'
  })

  const externalMemUsed = meter.createValueObserver(prefix + NODEJS_EXTERNAL_MEMORY, {
    description: 'Node.js external memory size in bytes.'
  })

  meter.createBatchObserver((observerBatchResult) => {
    const memUsage = safeMemoryUsage()
    if (!memUsage) return
    observerBatchResult.observe(labels, [
      heapSizeTotal.observation(memUsage.heapTotal),
      heapSizeUsed.observation(memUsage.heapUsed),
      memUsage.external !== undefined ? externalMemUsed.observation(memUsage.external) : undefined
    ])
  })
}

module.exports.metricNames = [
  NODEJS_HEAP_SIZE_TOTAL,
  NODEJS_HEAP_SIZE_USED,
  NODEJS_EXTERNAL_MEMORY
]
