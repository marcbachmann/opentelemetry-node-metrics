const linuxVariant = require('./osMemoryHeapLinux')
const safeMemoryUsage = require('./helpers/safeMemoryUsage')
const PROCESS_RESIDENT_MEMORY = 'process_resident_memory_bytes'

function notLinuxVariant (meter, config = {}) {
  const namePrefix = config.prefix ? config.prefix : ''
  const labels = config.labels ? config.labels : {}

  meter.createValueObserver(namePrefix + PROCESS_RESIDENT_MEMORY, {
    description: 'Resident memory size in bytes.'
  }, (observerResult) => {
    const memUsage = safeMemoryUsage()
    // I don't think the other things returned from
    // `process.memoryUsage()` is relevant to a standard export
    if (memUsage) observerResult.observe(memUsage.rss, labels)
  })
}

module.exports = process.platform === 'linux'
  ? linuxVariant
  : notLinuxVariant

module.exports.metricNames = process.platform === 'linux'
  ? linuxVariant.metricNames
  : [PROCESS_RESIDENT_MEMORY]
