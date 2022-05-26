'use strict'
const fs = require('fs')
const process = require('process')
const PROCESS_OPEN_FDS = 'process_open_fds'

/**
 * @param {import('@opentelemetry/api-metrics').Meter} meter 
 * @param {*} config 
 */
module.exports = (meter, {prefix, labels}) => {
  if (process.platform !== 'linux') return

  meter.createObservableGauge(prefix + PROCESS_OPEN_FDS, (observable) => {
    try {
      const fds = fs.readdirSync('/proc/self/fd')
      // Minus 1 to not count the fd that was used by readdirSync(),
      // it's now closed.
      observable.observe(fds.length - 1, labels)
    } catch {
      // noop
    }
  }, {
    description: 'Number of open file descriptors.'
  })
}

module.exports.metricNames = [PROCESS_OPEN_FDS]
