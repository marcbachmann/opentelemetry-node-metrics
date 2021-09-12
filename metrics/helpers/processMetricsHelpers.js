'use strict'
function createAggregatorByObjectName () {
  const all = new Map()
  return function aggregateByObjectName (metric, labels, list) {
    const current = new Map()
    for (const key of all.keys()) current.set(key, 0)

    for (let i = 0; i < list.length; i++) {
      const listElementConstructor = list[i] && list[i].constructor
      if (typeof listElementConstructor === 'undefined') continue
      current.set(listElementConstructor.name, (current.get(listElementConstructor.name) || 0) + 1)
    }

    for (const [key, value] of current) {
      const instrument = all.get(key) || metric.bind({...labels, type: key})
      instrument.update(value)
      all.set(key, instrument)
    }
  }
}

module.exports = {
  createAggregatorByObjectName
}
