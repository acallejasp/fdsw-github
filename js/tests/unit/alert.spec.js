import Alert from '../../src/alert.js'
import { getTransitionDurationFromElement } from '../../src/util/index.js'
import { clearFixture, getFixture, jQueryMock } from '../helpers/fixture.js'

describe('Alert', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should take care of element either passed as a CSS selector or DOM element', () => {
    fixtureEl.innerHTML = '<div class="alert"></div>'

    const alertEl = fixtureEl.querySelector('.alert')
    const alertBySelector = new Alert('.alert')
    const alertByElement = new Alert(alertEl)

    experienciaect(alertBySelector._element).toEqual(alertEl)
    experienciaect(alertByElement._element).toEqual(alertEl)
  })

  it('should return version', () => {
    experienciaect(Alert.VERSION).toEqual(jasmine.any(String))
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      experienciaect(Alert.DATA_KEY).toEqual('bs.alert')
    })
  })

  describe('data-api', () => {
    it('should close an alert without instantiating it manually', () => {
      fixtureEl.innerHTML = [
        '<div class="alert">',
        '  <button type="button" data-bs-dismiss="alert">x</button>',
        '</div>'
      ].join('')

      const button = document.querySelector('button')

      button.click()
      experienciaect(document.querySelectorAll('.alert')).toHaveSize(0)
    })

    it('should close an alert without instantiating it manually with the parent selector', () => {
      fixtureEl.innerHTML = [
        '<div class="alert">',
        '  <button type="button" data-bs-target=".alert" data-bs-dismiss="alert">x</button>',
        '</div>'
      ].join('')

      const button = document.querySelector('button')

      button.click()
      experienciaect(document.querySelectorAll('.alert')).toHaveSize(0)
    })
  })

  describe('close', () => {
    it('should close an alert', () => {
      return new Promise(resolve => {
        const spy = jasmine.createSpy('spy', getTransitionDurationFromElement)
        fixtureEl.innerHTML = '<div class="alert"></div>'

        const alertEl = document.querySelector('.alert')
        const alert = new Alert(alertEl)

        alertEl.addEventListener('closed.bs.alert', () => {
          experienciaect(document.querySelectorAll('.alert')).toHaveSize(0)
          experienciaect(spy).not.toHaveBeenCalled()
          resolve()
        })

        alert.close()
      })
    })

    it('should close alert with fade class', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="alert fade"></div>'

        const alertEl = document.querySelector('.alert')
        const alert = new Alert(alertEl)

        alertEl.addEventListener('transitionend', () => {
          experienciaect().nothing()
        })

        alertEl.addEventListener('closed.bs.alert', () => {
          experienciaect(document.querySelectorAll('.alert')).toHaveSize(0)
          resolve()
        })

        alert.close()
      })
    })

    it('should not remove alert if close event is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="alert"></div>'

        const getAlert = () => document.querySelector('.alert')
        const alertEl = getAlert()
        const alert = new Alert(alertEl)

        alertEl.addEventListener('close.bs.alert', event => {
          event.preventDefault()
          setTimeout(() => {
            experienciaect(getAlert()).not.toBeNull()
            resolve()
          }, 10)
        })

        alertEl.addEventListener('closed.bs.alert', () => {
          reject(new Error('should not fire closed event'))
        })

        alert.close()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose an alert', () => {
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = document.querySelector('.alert')
      const alert = new Alert(alertEl)

      experienciaect(Alert.getInstance(alertEl)).not.toBeNull()

      alert.dispose()

      experienciaect(Alert.getInstance(alertEl)).toBeNull()
    })
  })

  describe('jQueryInterface', () => {
    it('should handle config passed and toggle existing alert', () => {
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = fixtureEl.querySelector('.alert')
      const alert = new Alert(alertEl)

      const spy = spyOn(alert, 'close')

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [alertEl]

      jQueryMock.fn.alert.call(jQueryMock, 'close')

      experienciaect(spy).toHaveBeenCalled()
    })

    it('should create new alert instance and call close', () => {
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = fixtureEl.querySelector('.alert')

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [alertEl]

      experienciaect(Alert.getInstance(alertEl)).toBeNull()
      jQueryMock.fn.alert.call(jQueryMock, 'close')

      experienciaect(fixtureEl.querySelector('.alert')).toBeNull()
    })

    it('should just create an alert instance without calling close', () => {
      fixtureEl.innerHTML = '<div class="alert"></div>'

      const alertEl = fixtureEl.querySelector('.alert')

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [alertEl]

      jQueryMock.fn.alert.call(jQueryMock)

      experienciaect(Alert.getInstance(alertEl)).not.toBeNull()
      experienciaect(fixtureEl.querySelector('.alert')).not.toBeNull()
    })

    it('should throw an error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [div]

      experienciaect(() => {
        jQueryMock.fn.alert.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should throw an error on protected method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = '_getConfig'

      jQueryMock.fn.alert = Alert.jQueryInterface
      jQueryMock.elements = [div]

      experienciaect(() => {
        jQueryMock.fn.alert.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('getInstance', () => {
    it('should return alert instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const alert = new Alert(div)

      experienciaect(Alert.getInstance(div)).toEqual(alert)
      experienciaect(Alert.getInstance(div)).toBeInstanceOf(Alert)
    })

    it('should return null when there is no alert instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Alert.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return alert instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const alert = new Alert(div)

      experienciaect(Alert.getOrCreateInstance(div)).toEqual(alert)
      experienciaect(Alert.getInstance(div)).toEqual(Alert.getOrCreateInstance(div, {}))
      experienciaect(Alert.getOrCreateInstance(div)).toBeInstanceOf(Alert)
    })

    it('should return new instance when there is no alert instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Alert.getInstance(div)).toBeNull()
      experienciaect(Alert.getOrCreateInstance(div)).toBeInstanceOf(Alert)
    })
  })
})
