'use strict'
const v8 = require('v8')
const METRICS = ['total', 'used', 'available']
const NODEJS_HEAP_SIZE = {}

for (const metricType of METRICS) {
  NODEJS_HEAP_SIZE[metricType] = `nodejs_heap_space_size_${metricType}_bytes`
}

module.exports = (meter, {prefix, labels}) => {
  const boundMetricsBySpace = {}

  const total = meter.createObservableGauge(prefix + NODEJS_HEAP_SIZE.total, {
    description: `Process heap space size total from Node.js in bytes.`
  })

  const used = meter.createObservableGauge(prefix + NODEJS_HEAP_SIZE.used, {
    description: `Process heap space size used from Node.js in bytes.`
  })

  const available = meter.createObservableGauge(prefix + NODEJS_HEAP_SIZE.available, {
    description: `Process heap space size available from Node.js in bytes.`
  }, () => {
    for (const space of v8.getHeapSpaceStatistics()) {
      let bound = boundMetricsBySpace[space.space_name]
      if (!bound) {
        const spaceName = space.space_name.substr(0, space.space_name.indexOf('_space'))
        boundMetricsBySpace[space.space_name] = {
          total: total.bind({...labels, space: spaceName}),
          used: used.bind({...labels, space: spaceName}),
          available: available.bind({...labels, space: spaceName})
        }

        bound = boundMetricsBySpace[space.space_name]
      }

      bound.total.update(space.space_size)
      bound.used.update(space.space_used_size)
      bound.available.update(space.space_available_size)
    }
  })
}

module.exports.metricNames = Object.values(NODEJS_HEAP_SIZE)
