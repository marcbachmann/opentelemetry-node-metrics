'use strict'
const fs = require('fs')
const process = require('process')
const PROCESS_OPEN_FDS = 'process_open_fds'

module.exports = (meter, {prefix, labels}) => {
  if (process.platform !== 'linux') return

  const boundInstrument = meter.createObservableGauge(prefix + PROCESS_OPEN_FDS, {
    description: 'Number of open file descriptors.'
  }, () => {
    try {
      const fds = fs.readdirSync('/proc/self/fd')
      // Minus 1 to not count the fd that was used by readdirSync(),
      // it's now closed.
      boundInstrument.update(fds.length - 1)
    } catch {
      // noop
    }
  }).bind(labels)
}

module.exports.metricNames = [PROCESS_OPEN_FDS]
