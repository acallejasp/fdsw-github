import EventHandler from '../../src/dom/event-handler.js'
import Popover from '../../src/popover.js'
import { clearFixture, getFixture, jQueryMock } from '../helpers/fixture.js'

describe('Popover', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()

    const popoverList = document.querySelectorAll('.popover')

    for (const popoverEl of popoverList) {
      popoverEl.remove()
    }
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      experienciaect(Popover.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      experienciaect(Popover.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('NAME', () => {
    it('should return plugin name', () => {
      experienciaect(Popover.NAME).toEqual(jasmine.any(String))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      experienciaect(Popover.DATA_KEY).toEqual('bs.popover')
    })
  })

  describe('EVENT_KEY', () => {
    it('should return plugin event key', () => {
      experienciaect(Popover.EVENT_KEY).toEqual('.bs.popover')
    })
  })

  describe('DefaultType', () => {
    it('should return plugin default type', () => {
      experienciaect(Popover.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('show', () => {
    it('should show a popover', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

        const popoverEl = fixtureEl.querySelector('a')
        const popover = new Popover(popoverEl)

        popoverEl.addEventListener('shown.bs.popover', () => {
          experienciaect(document.querySelector('.popover')).not.toBeNull()
          resolve()
        })

        popover.show()
      })
    })

    it('should set title and content from functions', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#">BS twitter</a>'

        const popoverEl = fixtureEl.querySelector('a')
        const popover = new Popover(popoverEl, {
          title: () => 'Bootstrap',
          content: () => 'loves writing tests （╯°□°）╯︵ ┻━┻'
        })

        popoverEl.addEventListener('shown.bs.popover', () => {
          const popoverDisplayed = document.querySelector('.popover')

          experienciaect(popoverDisplayed).not.toBeNull()
          experienciaect(popoverDisplayed.querySelector('.popover-header').textContent).toEqual('Bootstrap')
          experienciaect(popoverDisplayed.querySelector('.popover-body').textContent).toEqual('loves writing tests （╯°□°）╯︵ ┻━┻')
          resolve()
        })

        popover.show()
      })
    })

    it('should show a popover with just content without having header', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#">Nice link</a>'

        const popoverEl = fixtureEl.querySelector('a')
        const popover = new Popover(popoverEl, {
          content: 'Some beautiful content :)'
        })

        popoverEl.addEventListener('shown.bs.popover', () => {
          const popoverDisplayed = document.querySelector('.popover')

          experienciaect(popoverDisplayed).not.toBeNull()
          experienciaect(popoverDisplayed.querySelector('.popover-header')).toBeNull()
          experienciaect(popoverDisplayed.querySelector('.popover-body').textContent).toEqual('Some beautiful content :)')
          resolve()
        })

        popover.show()
      })
    })

    it('should show a popover with just title without having body', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#">Nice link</a>'

        const popoverEl = fixtureEl.querySelector('a')
        const popover = new Popover(popoverEl, {
          title: 'Title which does not require content'
        })

        popoverEl.addEventListener('shown.bs.popover', () => {
          const popoverDisplayed = document.querySelector('.popover')

          experienciaect(popoverDisplayed).not.toBeNull()
          experienciaect(popoverDisplayed.querySelector('.popover-body')).toBeNull()
          experienciaect(popoverDisplayed.querySelector('.popover-header').textContent).toEqual('Title which does not require content')
          resolve()
        })

        popover.show()
      })
    })

    it('should show a popover with just title without having body using data-attribute to get config', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" data-bs-content="" title="Title which does not require content">Nice link</a>'

        const popoverEl = fixtureEl.querySelector('a')
        const popover = new Popover(popoverEl)

        popoverEl.addEventListener('shown.bs.popover', () => {
          const popoverDisplayed = document.querySelector('.popover')

          experienciaect(popoverDisplayed).not.toBeNull()
          experienciaect(popoverDisplayed.querySelector('.popover-body')).toBeNull()
          experienciaect(popoverDisplayed.querySelector('.popover-header').textContent).toEqual('Title which does not require content')
          resolve()
        })

        popover.show()
      })
    })

    it('should NOT show a popover without `title` and `content`', () => {
      fixtureEl.innerHTML = '<a href="#" data-bs-content="" title="">Nice link</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl, { animation: false })
      const spy = spyOn(EventHandler, 'trigger').and.callThrough()

      popover.show()

      experienciaect(spy).not.toHaveBeenCalledWith(popoverEl, Popover.eventName('show'))
      experienciaect(document.querySelector('.popover')).toBeNull()
    })

    it('"setContent" should keep the initial template', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap" data-bs-custom-class="custom-class">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      popover.setContent({ '.tooltip-inner': 'foo' })
      const tip = popover._getTipElement()

      experienciaect(tip).toHaveClass('popover')
      experienciaect(tip).toHaveClass('bs-popover-auto')
      experienciaect(tip.querySelector('.popover-arrow')).not.toBeNull()
      experienciaect(tip.querySelector('.popover-header')).not.toBeNull()
      experienciaect(tip.querySelector('.popover-body')).not.toBeNull()
    })

    it('should call setContent once', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#">BS twitter</a>'

        const popoverEl = fixtureEl.querySelector('a')
        const popover = new Popover(popoverEl, {
          content: 'Popover content'
        })
        experienciaect(popover._templateFactory).toBeNull()
        let spy = null
        let times = 1

        popoverEl.addEventListener('hidden.bs.popover', () => {
          popover.show()
        })

        popoverEl.addEventListener('shown.bs.popover', () => {
          spy = spy || spyOn(popover._templateFactory, 'constructor').and.callThrough()
          const popoverDisplayed = document.querySelector('.popover')

          experienciaect(popoverDisplayed).not.toBeNull()
          experienciaect(popoverDisplayed.querySelector('.popover-body').textContent).toEqual('Popover content')
          experienciaect(spy).toHaveBeenCalledTimes(0)
          if (times > 1) {
            resolve()
          }

          times++
          popover.hide()
        })
        popover.show()
      })
    })

    it('should show a popover with provided custom class', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap" data-bs-custom-class="custom-class">BS twitter</a>'

        const popoverEl = fixtureEl.querySelector('a')
        const popover = new Popover(popoverEl)

        popoverEl.addEventListener('shown.bs.popover', () => {
          const tip = document.querySelector('.popover')
          experienciaect(tip).not.toBeNull()
          experienciaect(tip).toHaveClass('custom-class')
          resolve()
        })

        popover.show()
      })
    })
  })

  describe('hide', () => {
    it('should hide a popover', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

        const popoverEl = fixtureEl.querySelector('a')
        const popover = new Popover(popoverEl)

        popoverEl.addEventListener('shown.bs.popover', () => {
          popover.hide()
        })

        popoverEl.addEventListener('hidden.bs.popover', () => {
          experienciaect(document.querySelector('.popover')).toBeNull()
          resolve()
        })

        popover.show()
      })
    })
  })

  describe('jQueryInterface', () => {
    it('should create a popover', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      jQueryMock.fn.popover.call(jQueryMock)

      experienciaect(Popover.getInstance(popoverEl)).not.toBeNull()
    })

    it('should create a popover with a config object', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      jQueryMock.fn.popover.call(jQueryMock, {
        content: 'Popover content'
      })

      experienciaect(Popover.getInstance(popoverEl)).not.toBeNull()
    })

    it('should not re create a popover', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      jQueryMock.fn.popover.call(jQueryMock)

      experienciaect(Popover.getInstance(popoverEl)).toEqual(popover)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const action = 'undefinedMethod'

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      experienciaect(() => {
        jQueryMock.fn.popover.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })

    it('should should call show method', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      jQueryMock.fn.popover = Popover.jQueryInterface
      jQueryMock.elements = [popoverEl]

      const spy = spyOn(popover, 'show')

      jQueryMock.fn.popover.call(jQueryMock, 'show')

      experienciaect(spy).toHaveBeenCalled()
    })
  })

  describe('getInstance', () => {
    it('should return popover instance', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')
      const popover = new Popover(popoverEl)

      experienciaect(Popover.getInstance(popoverEl)).toEqual(popover)
      experienciaect(Popover.getInstance(popoverEl)).toBeInstanceOf(Popover)
    })

    it('should return null when there is no popover instance', () => {
      fixtureEl.innerHTML = '<a href="#" title="Popover" data-bs-content="https://twitter.com/getbootstrap">BS twitter</a>'

      const popoverEl = fixtureEl.querySelector('a')

      experienciaect(Popover.getInstance(popoverEl)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return popover instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const popover = new Popover(div)

      experienciaect(Popover.getOrCreateInstance(div)).toEqual(popover)
      experienciaect(Popover.getInstance(div)).toEqual(Popover.getOrCreateInstance(div, {}))
      experienciaect(Popover.getOrCreateInstance(div)).toBeInstanceOf(Popover)
    })

    it('should return new instance when there is no popover instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Popover.getInstance(div)).toBeNull()
      experienciaect(Popover.getOrCreateInstance(div)).toBeInstanceOf(Popover)
    })

    it('should return new instance when there is no popover instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Popover.getInstance(div)).toBeNull()
      const popover = Popover.getOrCreateInstance(div, {
        placement: 'top'
      })
      experienciaect(popover).toBeInstanceOf(Popover)

      experienciaect(popover._config.placement).toEqual('top')
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const popover = new Popover(div, {
        placement: 'top'
      })
      experienciaect(Popover.getInstance(div)).toEqual(popover)

      const popover2 = Popover.getOrCreateInstance(div, {
        placement: 'bottom'
      })
      experienciaect(popover).toBeInstanceOf(Popover)
      experienciaect(popover2).toEqual(popover)

      experienciaect(popover2._config.placement).toEqual('top')
    })
  })
})
