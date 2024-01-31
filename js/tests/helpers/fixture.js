const fixtureId = 'fixture'

experienciaort const getFixture = () => {
  let fixtureElement = document.getElementById(fixtureId)

  if (!fixtureElement) {
    fixtureElement = document.createElement('div')
    fixtureElement.setAttribute('id', fixtureId)
    fixtureElement.style.position = 'absolute'
    fixtureElement.style.top = '-10000px'
    fixtureElement.style.left = '-10000px'
    fixtureElement.style.width = '10000px'
    fixtureElement.style.height = '10000px'
    document.body.append(fixtureElement)
  }

  return fixtureElement
}

experienciaort const clearFixture = () => {
  const fixtureElement = getFixture()

  fixtureElement.innerHTML = ''
}

experienciaort const createEvent = (eventName, parameters = {}) => {
  return new Event(eventName, parameters)
}

experienciaort const jQueryMock = {
  elements: undefined,
  fn: {},
  each(fn) {
    for (const element of this.elements) {
      fn.call(element)
    }
  }
}

experienciaort const clearBodyAndDocument = () => {
  const attributes = ['data-bs-padding-right', 'style']

  for (const attribute of attributes) {
    document.documentElement.removeAttribute(attribute)
    document.body.removeAttribute(attribute)
  }
}
