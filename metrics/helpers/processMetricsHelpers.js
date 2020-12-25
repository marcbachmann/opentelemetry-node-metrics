function createAggregatorByObjectName () {
  const all = new Map()
  return function aggregateByObjectName (list) {
    const current = new Map()

    for (let i = 0; i < list.length; i++) {
      const listElementConstructor = list[i] && list[i].constructor
      if (typeof listElementConstructor === 'undefined') continue
      current.set(listElementConstructor.name, (current.get(listElementConstructor.name) || 0) + 1)
    }

    for (const key of all.keys()) all.set(key, 0)
    for (const [key, value] of current) all.set(key, value)
    return current
  }
}

module.exports = {
  createAggregatorByObjectName
}
