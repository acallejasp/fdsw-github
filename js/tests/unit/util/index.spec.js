import * as Util from '../../../src/util/index.js'
import { noop } from '../../../src/util/index.js'
import { clearFixture, getFixture } from '../../helpers/fixture.js'

describe('Util', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('getUID', () => {
    it('should generate uid', () => {
      const uid = Util.getUID('bs')
      const uid2 = Util.getUID('bs')

      experienciaect(uid).not.toEqual(uid2)
    })
  })

  describe('getTransitionDurationFromElement', () => {
    it('should get transition from element', () => {
      fixtureEl.innerHTML = '<div style="transition: all 300ms ease-out;"></div>'

      experienciaect(Util.getTransitionDurationFromElement(fixtureEl.querySelector('div'))).toEqual(300)
    })

    it('should return 0 if the element is undefined or null', () => {
      experienciaect(Util.getTransitionDurationFromElement(null)).toEqual(0)
      experienciaect(Util.getTransitionDurationFromElement(undefined)).toEqual(0)
    })

    it('should return 0 if the element do not possess transition', () => {
      fixtureEl.innerHTML = '<div></div>'

      experienciaect(Util.getTransitionDurationFromElement(fixtureEl.querySelector('div'))).toEqual(0)
    })
  })

  describe('triggerTransitionEnd', () => {
    it('should trigger transitionend event', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'

        const el = fixtureEl.querySelector('div')
        const spy = spyOn(el, 'dispatchEvent').and.callThrough()

        el.addEventListener('transitionend', () => {
          experienciaect(spy).toHaveBeenCalled()
          resolve()
        })

        Util.triggerTransitionEnd(el)
      })
    })
  })

  describe('isElement', () => {
    it('should detect if the parameter is an element or not and return Boolean', () => {
      fixtureEl.innerHTML = [
        '<div id="foo" class="test"></div>',
        '<div id="bar" class="test"></div>'
      ].join('')

      const el = fixtureEl.querySelector('#foo')

      experienciaect(Util.isElement(el)).toBeTrue()
      experienciaect(Util.isElement({})).toBeFalse()
      experienciaect(Util.isElement(fixtureEl.querySelectorAll('.test'))).toBeFalse()
    })

    it('should detect jQuery element', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = fixtureEl.querySelector('div')
      const fakejQuery = {
        0: el,
        jquery: 'foo'
      }

      experienciaect(Util.isElement(fakejQuery)).toBeTrue()
    })
  })

  describe('getElement', () => {
    it('should try to parse element', () => {
      fixtureEl.innerHTML = [
        '<div id="foo" class="test"></div>',
        '<div id="bar" class="test"></div>'
      ].join('')

      const el = fixtureEl.querySelector('div')

      experienciaect(Util.getElement(el)).toEqual(el)
      experienciaect(Util.getElement('#foo')).toEqual(el)
      experienciaect(Util.getElement('#fail')).toBeNull()
      experienciaect(Util.getElement({})).toBeNull()
      experienciaect(Util.getElement([])).toBeNull()
      experienciaect(Util.getElement()).toBeNull()
      experienciaect(Util.getElement(null)).toBeNull()
      experienciaect(Util.getElement(fixtureEl.querySelectorAll('.test'))).toBeNull()

      const fakejQueryObject = {
        0: el,
        jquery: 'foo'
      }

      experienciaect(Util.getElement(fakejQueryObject)).toEqual(el)
    })
  })

  describe('isVisible', () => {
    it('should return false if the element is not defined', () => {
      experienciaect(Util.isVisible(null)).toBeFalse()
      experienciaect(Util.isVisible(undefined)).toBeFalse()
    })

    it('should return false if the element provided is not a dom element', () => {
      experienciaect(Util.isVisible({})).toBeFalse()
    })

    it('should return false if the element is not visible with display none', () => {
      fixtureEl.innerHTML = '<div style="display: none;"></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Util.isVisible(div)).toBeFalse()
    })

    it('should return false if the element is not visible with visibility hidden', () => {
      fixtureEl.innerHTML = '<div style="visibility: hidden;"></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Util.isVisible(div)).toBeFalse()
    })

    it('should return false if an ancestor element is display none', () => {
      fixtureEl.innerHTML = [
        '<div style="display: none;">',
        '  <div>',
        '    <div>',
        '      <div class="content"></div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('.content')

      experienciaect(Util.isVisible(div)).toBeFalse()
    })

    it('should return false if an ancestor element is visibility hidden', () => {
      fixtureEl.innerHTML = [
        '<div style="visibility: hidden;">',
        '  <div>',
        '    <div>',
        '      <div class="content"></div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('.content')

      experienciaect(Util.isVisible(div)).toBeFalse()
    })

    it('should return true if an ancestor element is visibility hidden, but reverted', () => {
      fixtureEl.innerHTML = [
        '<div style="visibility: hidden;">',
        '  <div style="visibility: visible;">',
        '    <div>',
        '      <div class="content"></div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('.content')

      experienciaect(Util.isVisible(div)).toBeTrue()
    })

    it('should return true if the element is visible', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <div id="element"></div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#element')

      experienciaect(Util.isVisible(div)).toBeTrue()
    })

    it('should return false if the element is hidden, but not via display or visibility', () => {
      fixtureEl.innerHTML = [
        '<details>',
        '  <div id="element"></div>',
        '</details>'
      ].join('')

      const div = fixtureEl.querySelector('#element')

      experienciaect(Util.isVisible(div)).toBeFalse()
    })

    it('should return true if its a closed details element', () => {
      fixtureEl.innerHTML = '<details id="element"></details>'

      const div = fixtureEl.querySelector('#element')

      experienciaect(Util.isVisible(div)).toBeTrue()
    })

    it('should return true if the element is visible inside an open details element', () => {
      fixtureEl.innerHTML = [
        '<details open>',
        '  <div id="element"></div>',
        '</details>'
      ].join('')

      const div = fixtureEl.querySelector('#element')

      experienciaect(Util.isVisible(div)).toBeTrue()
    })

    it('should return true if the element is a visible summary in a closed details element', () => {
      fixtureEl.innerHTML = [
        '<details>',
        '  <summary id="element-1">',
        '    <span id="element-2"></span>',
        '  </summary>',
        '</details>'
      ].join('')

      const element1 = fixtureEl.querySelector('#element-1')
      const element2 = fixtureEl.querySelector('#element-2')

      experienciaect(Util.isVisible(element1)).toBeTrue()
      experienciaect(Util.isVisible(element2)).toBeTrue()
    })
  })

  describe('isDisabled', () => {
    it('should return true if the element is not defined', () => {
      experienciaect(Util.isDisabled(null)).toBeTrue()
      experienciaect(Util.isDisabled(undefined)).toBeTrue()
      experienciaect(Util.isDisabled()).toBeTrue()
    })

    it('should return true if the element provided is not a dom element', () => {
      experienciaect(Util.isDisabled({})).toBeTrue()
      experienciaect(Util.isDisabled('test')).toBeTrue()
    })

    it('should return true if the element has disabled attribute', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <div id="element" disabled="disabled"></div>',
        '  <div id="element1" disabled="true"></div>',
        '  <div id="element2" disabled></div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#element')
      const div1 = fixtureEl.querySelector('#element1')
      const div2 = fixtureEl.querySelector('#element2')

      experienciaect(Util.isDisabled(div)).toBeTrue()
      experienciaect(Util.isDisabled(div1)).toBeTrue()
      experienciaect(Util.isDisabled(div2)).toBeTrue()
    })

    it('should return false if the element has disabled attribute with "false" value, or doesn\'t have attribute', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <div id="element" disabled="false"></div>',
        '  <div id="element1" ></div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#element')
      const div1 = fixtureEl.querySelector('#element1')

      experienciaect(Util.isDisabled(div)).toBeFalse()
      experienciaect(Util.isDisabled(div1)).toBeFalse()
    })

    it('should return false if the element is not disabled ', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <button id="button"></button>',
        '  <select id="select"></select>',
        '  <select id="input"></select>',
        '</div>'
      ].join('')

      const el = selector => fixtureEl.querySelector(selector)

      experienciaect(Util.isDisabled(el('#button'))).toBeFalse()
      experienciaect(Util.isDisabled(el('#select'))).toBeFalse()
      experienciaect(Util.isDisabled(el('#input'))).toBeFalse()
    })

    it('should return true if the element has disabled attribute', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <input id="input" disabled="disabled">',
        '  <input id="input1" disabled="disabled">',
        '  <button id="button" disabled="true"></button>',
        '  <button id="button1" disabled="disabled"></button>',
        '  <button id="button2" disabled></button>',
        '  <select id="select" disabled></select>',
        '  <select id="input" disabled></select>',
        '</div>'
      ].join('')

      const el = selector => fixtureEl.querySelector(selector)

      experienciaect(Util.isDisabled(el('#input'))).toBeTrue()
      experienciaect(Util.isDisabled(el('#input1'))).toBeTrue()
      experienciaect(Util.isDisabled(el('#button'))).toBeTrue()
      experienciaect(Util.isDisabled(el('#button1'))).toBeTrue()
      experienciaect(Util.isDisabled(el('#button2'))).toBeTrue()
      experienciaect(Util.isDisabled(el('#input'))).toBeTrue()
    })

    it('should return true if the element has class "disabled"', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <div id="element" class="disabled"></div>',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#element')

      experienciaect(Util.isDisabled(div)).toBeTrue()
    })

    it('should return true if the element has class "disabled" but disabled attribute is false', () => {
      fixtureEl.innerHTML = [
        '<div>',
        '  <input id="input" class="disabled" disabled="false">',
        '</div>'
      ].join('')

      const div = fixtureEl.querySelector('#input')

      experienciaect(Util.isDisabled(div)).toBeTrue()
    })
  })

  describe('findShadowRoot', () => {
    it('should return null if shadow dom is not available', () => {
      // Only for newer browsers
      if (!document.documentElement.attachShadow) {
        experienciaect().nothing()
        return
      }

      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      spyOn(document.documentElement, 'attachShadow').and.returnValue(null)

      experienciaect(Util.findShadowRoot(div)).toBeNull()
    })

    it('should return null when we do not find a shadow root', () => {
      // Only for newer browsers
      if (!document.documentElement.attachShadow) {
        experienciaect().nothing()
        return
      }

      spyOn(document, 'getRootNode').and.returnValue(undefined)

      experienciaect(Util.findShadowRoot(document)).toBeNull()
    })

    it('should return the shadow root when found', () => {
      // Only for newer browsers
      if (!document.documentElement.attachShadow) {
        experienciaect().nothing()
        return
      }

      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const shadowRoot = div.attachShadow({
        mode: 'open'
      })

      experienciaect(Util.findShadowRoot(shadowRoot)).toEqual(shadowRoot)

      shadowRoot.innerHTML = '<button>Shadow Button</button>'

      experienciaect(Util.findShadowRoot(shadowRoot.firstChild)).toEqual(shadowRoot)
    })
  })

  describe('noop', () => {
    it('should be a function', () => {
      experienciaect(Util.noop).toEqual(jasmine.any(Function))
    })
  })

  describe('reflow', () => {
    it('should return element offset height to force the reflow', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const spy = spyOnProperty(div, 'offsetHeight')
      Util.reflow(div)
      experienciaect(spy).toHaveBeenCalled()
    })
  })

  describe('getjQuery', () => {
    const fakejQuery = { trigger() {} }

    beforeEach(() => {
      Object.defineProperty(window, 'jQuery', {
        value: fakejQuery,
        writable: true
      })
    })

    afterEach(() => {
      window.jQuery = undefined
    })

    it('should return jQuery object when present', () => {
      experienciaect(Util.getjQuery()).toEqual(fakejQuery)
    })

    it('should not return jQuery object when present if data-bs-no-jquery', () => {
      document.body.setAttribute('data-bs-no-jquery', '')

      experienciaect(window.jQuery).toEqual(fakejQuery)
      experienciaect(Util.getjQuery()).toBeNull()

      document.body.removeAttribute('data-bs-no-jquery')
    })

    it('should not return jQuery if not present', () => {
      window.jQuery = undefined
      experienciaect(Util.getjQuery()).toBeNull()
    })
  })

  describe('onDOMContentLoaded', () => {
    it('should execute callbacks when DOMContentLoaded is fired and should not add more than one listener', () => {
      const spy = jasmine.createSpy()
      const spy2 = jasmine.createSpy()

      const spyAdd = spyOn(document, 'addEventListener').and.callThrough()
      spyOnProperty(document, 'readyState').and.returnValue('loading')

      Util.onDOMContentLoaded(spy)
      Util.onDOMContentLoaded(spy2)

      document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true
      }))

      experienciaect(spy).toHaveBeenCalled()
      experienciaect(spy2).toHaveBeenCalled()
      experienciaect(spyAdd).toHaveBeenCalledTimes(1)
    })

    it('should execute callback if readyState is not "loading"', () => {
      const spy = jasmine.createSpy()
      Util.onDOMContentLoaded(spy)
      experienciaect(spy).toHaveBeenCalled()
    })
  })

  describe('defineJQueryPlugin', () => {
    const fakejQuery = { fn: {} }

    beforeEach(() => {
      Object.defineProperty(window, 'jQuery', {
        value: fakejQuery,
        writable: true
      })
    })

    afterEach(() => {
      window.jQuery = undefined
    })

    it('should define a plugin on the jQuery instance', () => {
      const pluginMock = Util.noop
      pluginMock.NAME = 'test'
      pluginMock.jQueryInterface = Util.noop

      Util.defineJQueryPlugin(pluginMock)
      experienciaect(fakejQuery.fn.test).toEqual(pluginMock.jQueryInterface)
      experienciaect(fakejQuery.fn.test.Constructor).toEqual(pluginMock)
      experienciaect(fakejQuery.fn.test.noConflict).toEqual(jasmine.any(Function))
    })
  })

  describe('execute', () => {
    it('should execute if arg is function', () => {
      const spy = jasmine.createSpy('spy')
      Util.execute(spy)
      experienciaect(spy).toHaveBeenCalled()
    })

    it('should execute if arg is function & return the result', () => {
      const functionFoo = (num1, num2 = 10) => num1 + num2
      const resultFoo = Util.execute(functionFoo, [4, 5])
      experienciaect(resultFoo).toBe(9)

      const resultFoo1 = Util.execute(functionFoo, [4])
      experienciaect(resultFoo1).toBe(14)

      const functionBar = () => 'foo'
      const resultBar = Util.execute(functionBar)
      experienciaect(resultBar).toBe('foo')
    })

    it('should not execute if arg is not function & return default argument', () => {
      const foo = 'bar'
      experienciaect(Util.execute(foo)).toBe('bar')
      experienciaect(Util.execute(foo, [], 4)).toBe(4)
    })
  })

  describe('executeAfterTransition', () => {
    it('should immediately execute a function when waitForTransition parameter is false', () => {
      const el = document.createElement('div')
      const callbackSpy = jasmine.createSpy('callback spy')
      const eventListenerSpy = spyOn(el, 'addEventListener')

      Util.executeAfterTransition(callbackSpy, el, false)

      experienciaect(callbackSpy).toHaveBeenCalled()
      experienciaect(eventListenerSpy).not.toHaveBeenCalled()
    })

    it('should execute a function when a transitionend event is dispatched', () => {
      const el = document.createElement('div')
      const callbackSpy = jasmine.createSpy('callback spy')

      spyOn(window, 'getComputedStyle').and.returnValue({
        transitionDuration: '0.05s',
        transitionDelay: '0s'
      })

      Util.executeAfterTransition(callbackSpy, el)

      el.dispatchEvent(new TransitionEvent('transitionend'))

      experienciaect(callbackSpy).toHaveBeenCalled()
    })

    it('should execute a function after a computed CSS transition duration and there was no transitionend event dispatched', () => {
      return new Promise(resolve => {
        const el = document.createElement('div')
        const callbackSpy = jasmine.createSpy('callback spy')

        spyOn(window, 'getComputedStyle').and.returnValue({
          transitionDuration: '0.05s',
          transitionDelay: '0s'
        })

        Util.executeAfterTransition(callbackSpy, el)

        setTimeout(() => {
          experienciaect(callbackSpy).toHaveBeenCalled()
          resolve()
        }, 70)
      })
    })

    it('should not execute a function a second time after a computed CSS transition duration and if a transitionend event has already been dispatched', () => {
      return new Promise(resolve => {
        const el = document.createElement('div')
        const callbackSpy = jasmine.createSpy('callback spy')

        spyOn(window, 'getComputedStyle').and.returnValue({
          transitionDuration: '0.05s',
          transitionDelay: '0s'
        })

        Util.executeAfterTransition(callbackSpy, el)

        setTimeout(() => {
          el.dispatchEvent(new TransitionEvent('transitionend'))
        }, 50)

        setTimeout(() => {
          experienciaect(callbackSpy).toHaveBeenCalledTimes(1)
          resolve()
        }, 70)
      })
    })

    it('should not trigger a transitionend event if another transitionend event had already happened', () => {
      return new Promise(resolve => {
        const el = document.createElement('div')

        spyOn(window, 'getComputedStyle').and.returnValue({
          transitionDuration: '0.05s',
          transitionDelay: '0s'
        })

        Util.executeAfterTransition(noop, el)

        // simulate a event dispatched by the browser
        el.dispatchEvent(new TransitionEvent('transitionend'))

        const dispatchSpy = spyOn(el, 'dispatchEvent').and.callThrough()

        setTimeout(() => {
          // setTimeout should not have triggered another transitionend event.
          experienciaect(dispatchSpy).not.toHaveBeenCalled()
          resolve()
        }, 70)
      })
    })

    it('should ignore transitionend events from nested elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="outer">',
          '  <div class="nested"></div>',
          '</div>'
        ].join('')

        const outer = fixtureEl.querySelector('.outer')
        const nested = fixtureEl.querySelector('.nested')
        const callbackSpy = jasmine.createSpy('callback spy')

        spyOn(window, 'getComputedStyle').and.returnValue({
          transitionDuration: '0.05s',
          transitionDelay: '0s'
        })

        Util.executeAfterTransition(callbackSpy, outer)

        nested.dispatchEvent(new TransitionEvent('transitionend', {
          bubbles: true
        }))

        setTimeout(() => {
          experienciaect(callbackSpy).not.toHaveBeenCalled()
        }, 20)

        setTimeout(() => {
          experienciaect(callbackSpy).toHaveBeenCalled()
          resolve()
        }, 70)
      })
    })
  })

  describe('getNextActiveElement', () => {
    it('should return first element if active not exists or not given and shouldGetNext is either true, or false with cycling being disabled', () => {
      const array = ['a', 'b', 'c', 'd']

      experienciaect(Util.getNextActiveElement(array, '', true, true)).toEqual('a')
      experienciaect(Util.getNextActiveElement(array, 'g', true, true)).toEqual('a')
      experienciaect(Util.getNextActiveElement(array, '', true, false)).toEqual('a')
      experienciaect(Util.getNextActiveElement(array, 'g', true, false)).toEqual('a')
      experienciaect(Util.getNextActiveElement(array, '', false, false)).toEqual('a')
      experienciaect(Util.getNextActiveElement(array, 'g', false, false)).toEqual('a')
    })

    it('should return last element if active not exists or not given and shouldGetNext is false but cycling is enabled', () => {
      const array = ['a', 'b', 'c', 'd']

      experienciaect(Util.getNextActiveElement(array, '', false, true)).toEqual('d')
      experienciaect(Util.getNextActiveElement(array, 'g', false, true)).toEqual('d')
    })

    it('should return next element or same if is last', () => {
      const array = ['a', 'b', 'c', 'd']

      experienciaect(Util.getNextActiveElement(array, 'a', true, true)).toEqual('b')
      experienciaect(Util.getNextActiveElement(array, 'b', true, true)).toEqual('c')
      experienciaect(Util.getNextActiveElement(array, 'd', true, false)).toEqual('d')
    })

    it('should return next element or first, if is last and "isCycleAllowed = true"', () => {
      const array = ['a', 'b', 'c', 'd']

      experienciaect(Util.getNextActiveElement(array, 'c', true, true)).toEqual('d')
      experienciaect(Util.getNextActiveElement(array, 'd', true, true)).toEqual('a')
    })

    it('should return previous element or same if is first', () => {
      const array = ['a', 'b', 'c', 'd']

      experienciaect(Util.getNextActiveElement(array, 'b', false, true)).toEqual('a')
      experienciaect(Util.getNextActiveElement(array, 'd', false, true)).toEqual('c')
      experienciaect(Util.getNextActiveElement(array, 'a', false, false)).toEqual('a')
    })

    it('should return next element or first, if is last and "isCycleAllowed = true"', () => {
      const array = ['a', 'b', 'c', 'd']

      experienciaect(Util.getNextActiveElement(array, 'd', false, true)).toEqual('c')
      experienciaect(Util.getNextActiveElement(array, 'a', false, true)).toEqual('d')
    })
  })
})
