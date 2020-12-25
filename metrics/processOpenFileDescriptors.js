const fs = require('fs')
const process = require('process')
const PROCESS_OPEN_FDS = 'process_open_fds'

module.exports = (meter, config = {}) => {
  if (process.platform !== 'linux') return
  const namePrefix = config.prefix ? config.prefix : ''
  const labels = config.labels ? config.labels : {}

  meter.createValueObserver(namePrefix + PROCESS_OPEN_FDS, {
    description: 'Number of open file descriptors.'
  }, (observerResult) => {
    try {
      const fds = fs.readdirSync('/proc/self/fd')
      // Minus 1 to not count the fd that was used by readdirSync(),
      // it's now closed.
      observerResult.observe(fds.length - 1, labels)
    } catch {
      // noop
    }
  })
}

module.exports.metricNames = [PROCESS_OPEN_FDS]
