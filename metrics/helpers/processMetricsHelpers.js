function aggregateByObjectName (list) {
  const data = {}

  for (let i = 0; i < list.length; i++) {
    const listElement = list[i]

    if (!listElement || typeof listElement.constructor === 'undefined') {
      continue
    }

    if (Object.hasOwnProperty.call(data, listElement.constructor.name)) {
      data[listElement.constructor.name] += 1
    } else {
      data[listElement.constructor.name] = 1
    }
  }
  return data
}

module.exports = {
  aggregateByObjectName
}
