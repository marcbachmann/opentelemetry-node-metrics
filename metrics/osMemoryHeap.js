'use strict'
const linuxVariant = require('./osMemoryHeapLinux')
const safeMemoryUsage = require('./helpers/safeMemoryUsage')
const PROCESS_RESIDENT_MEMORY = 'process_resident_memory_bytes'

/**
 * @param {import('@opentelemetry/api-metrics').Meter} meter 
 * @param {*} config 
 */
function notLinuxVariant (meter, {prefix, labels}) {
  meter.createObservableGauge(prefix + PROCESS_RESIDENT_MEMORY, (observable) => {
    const memUsage = safeMemoryUsage()
    // I don't think the other things returned from
    // `process.memoryUsage()` is relevant to a standard export
    if (memUsage) observable.observe(memUsage.rss, labels)
  }, {
    description: 'Resident memory size in bytes.'
  })
}

module.exports = process.platform === 'linux'
  ? linuxVariant
  : notLinuxVariant

module.exports.metricNames = process.platform === 'linux'
  ? linuxVariant.metricNames
  : [PROCESS_RESIDENT_MEMORY]
