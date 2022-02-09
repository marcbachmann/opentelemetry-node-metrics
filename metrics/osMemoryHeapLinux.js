'use strict'
const fs = require('fs')
const values = ['VmSize', 'VmRSS', 'VmData']

const PROCESS_RESIDENT_MEMORY = 'process_resident_memory_bytes'
const PROCESS_VIRTUAL_MEMORY = 'process_virtual_memory_bytes'
const PROCESS_HEAP = 'process_heap_bytes'

function structureOutput (input) {
  const returnValue = {}

  input
    .split('\n')
    .filter(s => values.some(value => s.indexOf(value) === 0))
    .forEach(string => {
      const split = string.split(':')

      // Get the value
      let value = split[1].trim()
      // Remove trailing ` kb`
      value = value.substr(0, value.length - 3)
      // Make it into a number in bytes bytes
      value = Number(value) * 1024

      returnValue[split[0]] = value
    })

  return returnValue
}

module.exports = (meter, {prefix, labels}) => {
  let stats
  function getStats () {
    if (stats !== undefined) return stats

    try {
      const stat = fs.readFileSync('/proc/self/status', 'utf8')
      stats = structureOutput(stat)
    } catch {
      stats = false
    }
    setTimeout(() => { stats = undefined }, 1000).unref()
    return stats
  }

  meter.createObservableGauge(prefix + PROCESS_RESIDENT_MEMORY, {
    description: 'Resident memory size in bytes.'
  }, (observable) => {
    if (!getStats()) return
    observable.observe(stats.VmRSS, labels)
  })

  meter.createObservableGauge(prefix + PROCESS_VIRTUAL_MEMORY, {
    description: 'Virtual memory size in bytes.'
  }, (observable) => {
    if (!getStats()) return
    observable.observe(stats.VmSize, labels)
  })

  meter.createObservableGauge(prefix + PROCESS_HEAP, {
    description: 'Process heap size in bytes.'
  }, (observable) => {
    if (!getStats()) return
    observable.observe(stats.VmData, labels)
  })
}

module.exports.metricNames = [
  PROCESS_RESIDENT_MEMORY,
  PROCESS_VIRTUAL_MEMORY,
  PROCESS_HEAP
]
