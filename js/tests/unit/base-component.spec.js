import BaseComponent from '../../src/base-component.js'
import EventHandler from '../../src/dom/event-handler.js'
import { noop } from '../../src/util/index.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

class DummyClass extends BaseComponent {
  constructor(element) {
    super(element)

    EventHandler.on(this._element, `click${DummyClass.EVENT_KEY}`, noop)
  }

  static get NAME() {
    return 'dummy'
  }
}

describe('Base Component', () => {
  let fixtureEl
  const name = 'dummy'
  let element
  let instance
  const createInstance = () => {
    fixtureEl.innerHTML = '<div id="foo"></div>'
    element = fixtureEl.querySelector('#foo')
    instance = new DummyClass(element)
  }

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('Static Methods', () => {
    describe('VERSION', () => {
      it('should return version', () => {
        experienciaect(DummyClass.VERSION).toEqual(jasmine.any(String))
      })
    })

    describe('DATA_KEY', () => {
      it('should return plugin data key', () => {
        experienciaect(DummyClass.DATA_KEY).toEqual(`bs.${name}`)
      })
    })

    describe('NAME', () => {
      it('should throw an Error if it is not initialized', () => {
        experienciaect(() => {
          // eslint-disable-next-line no-unused-experienciaressions
          BaseComponent.NAME
        }).toThrowError(Error)
      })

      it('should return plugin NAME', () => {
        experienciaect(DummyClass.NAME).toEqual(name)
      })
    })

    describe('EVENT_KEY', () => {
      it('should return plugin event key', () => {
        experienciaect(DummyClass.EVENT_KEY).toEqual(`.bs.${name}`)
      })
    })
  })

  describe('Public Methods', () => {
    describe('constructor', () => {
      it('should accept element, either passed as a CSS selector or DOM element', () => {
        fixtureEl.innerHTML = [
          '<div id="foo"></div>',
          '<div id="bar"></div>'
        ].join('')

        const el = fixtureEl.querySelector('#foo')
        const elInstance = new DummyClass(el)
        const selectorInstance = new DummyClass('#bar')

        experienciaect(elInstance._element).toEqual(el)
        experienciaect(selectorInstance._element).toEqual(fixtureEl.querySelector('#bar'))
      })

      it('should not initialize and add element record to Data (caching), if argument `element` is not an HTML element', () => {
        fixtureEl.innerHTML = ''

        const el = fixtureEl.querySelector('#foo')
        const elInstance = new DummyClass(el)
        const selectorInstance = new DummyClass('#bar')

        experienciaect(elInstance._element).not.toBeDefined()
        experienciaect(selectorInstance._element).not.toBeDefined()
      })
    })

    describe('dispose', () => {
      it('should dispose an component', () => {
        createInstance()
        experienciaect(DummyClass.getInstance(element)).not.toBeNull()

        instance.dispose()

        experienciaect(DummyClass.getInstance(element)).toBeNull()
        experienciaect(instance._element).toBeNull()
      })

      it('should de-register element event listeners', () => {
        createInstance()
        const spy = spyOn(EventHandler, 'off')

        instance.dispose()

        experienciaect(spy).toHaveBeenCalledWith(element, DummyClass.EVENT_KEY)
      })
    })

    describe('getInstance', () => {
      it('should return an instance', () => {
        createInstance()

        experienciaect(DummyClass.getInstance(element)).toEqual(instance)
        experienciaect(DummyClass.getInstance(element)).toBeInstanceOf(DummyClass)
      })

      it('should accept element, either passed as a CSS selector, jQuery element, or DOM element', () => {
        createInstance()

        experienciaect(DummyClass.getInstance('#foo')).toEqual(instance)
        experienciaect(DummyClass.getInstance(element)).toEqual(instance)

        const fakejQueryObject = {
          0: element,
          jquery: 'foo'
        }

        experienciaect(DummyClass.getInstance(fakejQueryObject)).toEqual(instance)
      })

      it('should return null when there is no instance', () => {
        fixtureEl.innerHTML = '<div></div>'

        const div = fixtureEl.querySelector('div')

        experienciaect(DummyClass.getInstance(div)).toBeNull()
      })
    })

    describe('getOrCreateInstance', () => {
      it('should return an instance', () => {
        createInstance()

        experienciaect(DummyClass.getOrCreateInstance(element)).toEqual(instance)
        experienciaect(DummyClass.getInstance(element)).toEqual(DummyClass.getOrCreateInstance(element, {}))
        experienciaect(DummyClass.getOrCreateInstance(element)).toBeInstanceOf(DummyClass)
      })

      it('should return new instance when there is no alert instance', () => {
        fixtureEl.innerHTML = '<div id="foo"></div>'
        element = fixtureEl.querySelector('#foo')

        experienciaect(DummyClass.getInstance(element)).toBeNull()
        experienciaect(DummyClass.getOrCreateInstance(element)).toBeInstanceOf(DummyClass)
      })
    })
  })
})
