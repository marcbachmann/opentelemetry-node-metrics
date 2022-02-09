'use strict'
const v8 = require('v8')
const METRICS = ['total', 'used', 'available']
const NODEJS_HEAP_SIZE = {}

for (const metricType of METRICS) {
  NODEJS_HEAP_SIZE[metricType] = `nodejs_heap_space_size_${metricType}_bytes`
}

module.exports = (meter, {prefix, labels}) => {
  const labelsBySpace = {}
  let stats
  function getStats () {
    if (stats !== undefined) return stats
    stats = v8.getHeapSpaceStatistics()
      .map((space) => {
        const spaceLabels = labelsBySpace[space.space_name] || (function () {
          const spaceName = space.space_name.replace(/_space$/, '')
          labelsBySpace[space.space_name] = {
            total: {...labels, space: spaceName},
            used: {...labels, space: spaceName},
            available: {...labels, space: spaceName}
          }
          return labelsBySpace[space.space_name]
        })()

        return {
          total: {value: space.space_size, labels: spaceLabels.total},
          used: {value: space.space_used_size, labels: spaceLabels.used},
          available: {value: space.space_available_size, labels: spaceLabels.available}
        }
      })

    setTimeout(() => { stats = undefined }, 1000).unref()
    return stats
  }

  meter.createObservableGauge(prefix + NODEJS_HEAP_SIZE.total, {
    description: `Process heap space size total from Node.js in bytes.`
  }, (observable) => {
    if (!getStats()) return
    for (let i = 0; i < stats.length; i++) {
      observable.observe(stats[i].total.value, stats[i].total.labels)
    }
  })

  meter.createObservableGauge(prefix + NODEJS_HEAP_SIZE.used, {
    description: `Process heap space size used from Node.js in bytes.`
  }, (observable) => {
    if (!getStats()) return
    for (let i = 0; i < stats.length; i++) {
      observable.observe(stats[i].used.value, stats[i].used.labels)
    }
  })

  meter.createObservableGauge(prefix + NODEJS_HEAP_SIZE.available, {
    description: `Process heap space size available from Node.js in bytes.`
  }, (observable) => {
    if (!getStats()) return
    for (let i = 0; i < stats.length; i++) {
      observable.observe(stats[i].available.value, stats[i].available.labels)
    }
  })
}

module.exports.metricNames = Object.values(NODEJS_HEAP_SIZE)
