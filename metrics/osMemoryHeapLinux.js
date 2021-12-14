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
  const residentMemGauge = meter.createObservableGauge(prefix + PROCESS_RESIDENT_MEMORY, {
    description: 'Resident memory size in bytes.'
  }).bind(labels)

  const virtualMemGauge = meter.createObservableGauge(prefix + PROCESS_VIRTUAL_MEMORY, {
    description: 'Virtual memory size in bytes.'
  }).bind(labels)

  const heapSizeMemGauge = meter.createObservableGauge(prefix + PROCESS_HEAP, {
    description: 'Process heap size in bytes.'
  }, () => {
    try {
      // Sync I/O is often problematic, but /proc isn't really I/O, it
      // a virtual filesystem that maps directly to in-kernel data
      // structures and never blocks.
      //
      // Node.js/libuv do this already for process.memoryUsage(), see:
      // - https://github.com/libuv/libuv/blob/a629688008694ed8022269e66826d4d6ec688b83/src/unix/linux-core.c#L506-L523
      const stat = fs.readFileSync('/proc/self/status', 'utf8')
      const structuredOutput = structureOutput(stat)

      residentMemGauge.update(structuredOutput.VmRSS)
      virtualMemGauge.update(structuredOutput.VmSize)
      heapSizeMemGauge.update(structuredOutput.VmData)
    } catch {
      // noop
    }
  }).bind(labels)
}

module.exports.metricNames = [
  PROCESS_RESIDENT_MEMORY,
  PROCESS_VIRTUAL_MEMORY,
  PROCESS_HEAP
]
