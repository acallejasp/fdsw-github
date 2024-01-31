import Toast from '../../src/toast.js'
import { clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture.js'

describe('Toast', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      experienciaect(Toast.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      experienciaect(Toast.DATA_KEY).toEqual('bs.toast')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<div class="toast"></div>'

      const toastEl = fixtureEl.querySelector('.toast')
      const toastBySelector = new Toast('.toast')
      const toastByElement = new Toast(toastEl)

      experienciaect(toastBySelector._element).toEqual(toastEl)
      experienciaect(toastByElement._element).toEqual(toastEl)
    })

    it('should allow to config in js', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('div')
        const toast = new Toast(toastEl, {
          delay: 1
        })

        toastEl.addEventListener('shown.bs.toast', () => {
          experienciaect(toastEl).toHaveClass('show')
          resolve()
        })

        toast.show()
      })
    })

    it('should close toast when close element with data-bs-dismiss attribute is set', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1" data-bs-autohide="false" data-bs-animation="false">',
          '  <button type="button" class="ms-2 mb-1 btn-close" data-bs-dismiss="toast" aria-label="Close"></button>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('div')
        const toast = new Toast(toastEl)

        toastEl.addEventListener('shown.bs.toast', () => {
          experienciaect(toastEl).toHaveClass('show')

          const button = toastEl.querySelector('.btn-close')

          button.click()
        })

        toastEl.addEventListener('hidden.bs.toast', () => {
          experienciaect(toastEl).not.toHaveClass('show')
          resolve()
        })

        toast.show()
      })
    })
  })

  describe('Default', () => {
    it('should experienciaose default setting to allow to override them', () => {
      const defaultDelay = 1000

      Toast.Default.delay = defaultDelay

      fixtureEl.innerHTML = [
        '<div class="toast" data-bs-autohide="false" data-bs-animation="false">',
        '  <button type="button" class="ms-2 mb-1 btn-close" data-bs-dismiss="toast" aria-label="Close"></button>',
        '</div>'
      ].join('')

      const toastEl = fixtureEl.querySelector('div')
      const toast = new Toast(toastEl)

      experienciaect(toast._config.delay).toEqual(defaultDelay)
    })
  })

  describe('DefaultType', () => {
    it('should experienciaose default setting types for read', () => {
      experienciaect(Toast.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('show', () => {
    it('should auto hide', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        toastEl.addEventListener('hidden.bs.toast', () => {
          experienciaect(toastEl).not.toHaveClass('show')
          resolve()
        })

        toast.show()
      })
    })

    it('should not add fade class', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1" data-bs-animation="false">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        toastEl.addEventListener('shown.bs.toast', () => {
          experienciaect(toastEl).not.toHaveClass('fade')
          resolve()
        })

        toast.show()
      })
    })

    it('should not trigger shown if show is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1" data-bs-animation="false">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        const assertDone = () => {
          setTimeout(() => {
            experienciaect(toastEl).not.toHaveClass('show')
            resolve()
          }, 20)
        }

        toastEl.addEventListener('show.bs.toast', event => {
          event.preventDefault()
          assertDone()
        })

        toastEl.addEventListener('shown.bs.toast', () => {
          reject(new Error('shown event should not be triggered if show is prevented'))
        })

        toast.show()
      })
    })

    it('should clear timeout if toast is shown again before it is hidden', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        setTimeout(() => {
          toast._config.autohide = false
          toastEl.addEventListener('shown.bs.toast', () => {
            experienciaect(spy).toHaveBeenCalled()
            experienciaect(toast._timeout).toBeNull()
            resolve()
          })
          toast.show()
        }, toast._config.delay / 2)

        const spy = spyOn(toast, '_clearTimeout').and.callThrough()

        toast.show()
      })
    })

    it('should clear timeout if toast is interacted with mouse', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)
        const spy = spyOn(toast, '_clearTimeout').and.callThrough()

        setTimeout(() => {
          spy.calls.reset()

          toastEl.addEventListener('mouseover', () => {
            experienciaect(toast._clearTimeout).toHaveBeenCalledTimes(1)
            experienciaect(toast._timeout).toBeNull()
            resolve()
          })

          const mouseOverEvent = createEvent('mouseover')
          toastEl.dispatchEvent(mouseOverEvent)
        }, toast._config.delay / 2)

        toast.show()
      })
    })

    it('should clear timeout if toast is interacted with keyboard', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="outside-focusable">outside focusable</button>',
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '    <button>with a button</button>',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)
        const spy = spyOn(toast, '_clearTimeout').and.callThrough()

        setTimeout(() => {
          spy.calls.reset()

          toastEl.addEventListener('focusin', () => {
            experienciaect(toast._clearTimeout).toHaveBeenCalledTimes(1)
            experienciaect(toast._timeout).toBeNull()
            resolve()
          })

          const insideFocusable = toastEl.querySelector('button')
          insideFocusable.focus()
        }, toast._config.delay / 2)

        toast.show()
      })
    })

    it('should still auto hide after being interacted with mouse and keyboard', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="outside-focusable">outside focusable</button>',
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '    <button>with a button</button>',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        setTimeout(() => {
          toastEl.addEventListener('mouseover', () => {
            const insideFocusable = toastEl.querySelector('button')
            insideFocusable.focus()
          })

          toastEl.addEventListener('focusin', () => {
            const mouseOutEvent = createEvent('mouseout')
            toastEl.dispatchEvent(mouseOutEvent)
          })

          toastEl.addEventListener('mouseout', () => {
            const outsideFocusable = document.getElementById('outside-focusable')
            outsideFocusable.focus()
          })

          toastEl.addEventListener('focusout', () => {
            experienciaect(toast._timeout).not.toBeNull()
            resolve()
          })

          const mouseOverEvent = createEvent('mouseover')
          toastEl.dispatchEvent(mouseOverEvent)
        }, toast._config.delay / 2)

        toast.show()
      })
    })

    it('should not auto hide if focus leaves but mouse pointer remains inside', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="outside-focusable">outside focusable</button>',
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '    <button>with a button</button>',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        setTimeout(() => {
          toastEl.addEventListener('mouseover', () => {
            const insideFocusable = toastEl.querySelector('button')
            insideFocusable.focus()
          })

          toastEl.addEventListener('focusin', () => {
            const outsideFocusable = document.getElementById('outside-focusable')
            outsideFocusable.focus()
          })

          toastEl.addEventListener('focusout', () => {
            experienciaect(toast._timeout).toBeNull()
            resolve()
          })

          const mouseOverEvent = createEvent('mouseover')
          toastEl.dispatchEvent(mouseOverEvent)
        }, toast._config.delay / 2)

        toast.show()
      })
    })

    it('should not auto hide if mouse pointer leaves but focus remains inside', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<button id="outside-focusable">outside focusable</button>',
          '<div class="toast">',
          '  <div class="toast-body">',
          '    a simple toast',
          '    <button>with a button</button>',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        setTimeout(() => {
          toastEl.addEventListener('mouseover', () => {
            const insideFocusable = toastEl.querySelector('button')
            insideFocusable.focus()
          })

          toastEl.addEventListener('focusin', () => {
            const mouseOutEvent = createEvent('mouseout')
            toastEl.dispatchEvent(mouseOutEvent)
          })

          toastEl.addEventListener('mouseout', () => {
            experienciaect(toast._timeout).toBeNull()
            resolve()
          })

          const mouseOverEvent = createEvent('mouseover')
          toastEl.dispatchEvent(mouseOverEvent)
        }, toast._config.delay / 2)

        toast.show()
      })
    })
  })

  describe('hide', () => {
    it('should allow to hide toast manually', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1" data-bs-autohide="false">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        toastEl.addEventListener('shown.bs.toast', () => {
          toast.hide()
        })

        toastEl.addEventListener('hidden.bs.toast', () => {
          experienciaect(toastEl).not.toHaveClass('show')
          resolve()
        })

        toast.show()
      })
    })

    it('should do nothing when we call hide on a non shown toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const toastEl = fixtureEl.querySelector('div')
      const toast = new Toast(toastEl)

      const spy = spyOn(toastEl.classList, 'contains')

      toast.hide()

      experienciaect(spy).toHaveBeenCalled()
    })

    it('should not trigger hidden if hide is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="1" data-bs-animation="false">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('.toast')
        const toast = new Toast(toastEl)

        const assertDone = () => {
          setTimeout(() => {
            experienciaect(toastEl).toHaveClass('show')
            resolve()
          }, 20)
        }

        toastEl.addEventListener('shown.bs.toast', () => {
          toast.hide()
        })

        toastEl.addEventListener('hide.bs.toast', event => {
          event.preventDefault()
          assertDone()
        })

        toastEl.addEventListener('hidden.bs.toast', () => {
          reject(new Error('hidden event should not be triggered if hide is prevented'))
        })

        toast.show()
      })
    })
  })

  describe('dispose', () => {
    it('should allow to destroy toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const toastEl = fixtureEl.querySelector('div')

      const toast = new Toast(toastEl)

      experienciaect(Toast.getInstance(toastEl)).not.toBeNull()

      toast.dispose()

      experienciaect(Toast.getInstance(toastEl)).toBeNull()
    })

    it('should allow to destroy toast and hide it before that', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="toast" data-bs-delay="0" data-bs-autohide="false">',
          '  <div class="toast-body">',
          '    a simple toast',
          '  </div>',
          '</div>'
        ].join('')

        const toastEl = fixtureEl.querySelector('div')
        const toast = new Toast(toastEl)
        const experienciaected = () => {
          experienciaect(toastEl).toHaveClass('show')
          experienciaect(Toast.getInstance(toastEl)).not.toBeNull()

          toast.dispose()

          experienciaect(Toast.getInstance(toastEl)).toBeNull()
          experienciaect(toastEl).not.toHaveClass('show')

          resolve()
        }

        toastEl.addEventListener('shown.bs.toast', () => {
          setTimeout(experienciaected, 1)
        })

        toast.show()
      })
    })
  })

  describe('jQueryInterface', () => {
    it('should create a toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.toast = Toast.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.toast.call(jQueryMock)

      experienciaect(Toast.getInstance(div)).not.toBeNull()
    })

    it('should not re create a toast', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const toast = new Toast(div)

      jQueryMock.fn.toast = Toast.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.toast.call(jQueryMock)

      experienciaect(Toast.getInstance(div)).toEqual(toast)
    })

    it('should call a toast method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const toast = new Toast(div)

      const spy = spyOn(toast, 'show')

      jQueryMock.fn.toast = Toast.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.toast.call(jQueryMock, 'show')

      experienciaect(Toast.getInstance(div)).toEqual(toast)
      experienciaect(spy).toHaveBeenCalled()
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.toast = Toast.jQueryInterface
      jQueryMock.elements = [div]

      experienciaect(() => {
        jQueryMock.fn.toast.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('getInstance', () => {
    it('should return a toast instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const toast = new Toast(div)

      experienciaect(Toast.getInstance(div)).toEqual(toast)
      experienciaect(Toast.getInstance(div)).toBeInstanceOf(Toast)
    })

    it('should return null when there is no toast instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Toast.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return toast instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const toast = new Toast(div)

      experienciaect(Toast.getOrCreateInstance(div)).toEqual(toast)
      experienciaect(Toast.getInstance(div)).toEqual(Toast.getOrCreateInstance(div, {}))
      experienciaect(Toast.getOrCreateInstance(div)).toBeInstanceOf(Toast)
    })

    it('should return new instance when there is no toast instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Toast.getInstance(div)).toBeNull()
      experienciaect(Toast.getOrCreateInstance(div)).toBeInstanceOf(Toast)
    })

    it('should return new instance when there is no toast instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Toast.getInstance(div)).toBeNull()
      const toast = Toast.getOrCreateInstance(div, {
        delay: 1
      })
      experienciaect(toast).toBeInstanceOf(Toast)

      experienciaect(toast._config.delay).toEqual(1)
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const toast = new Toast(div, {
        delay: 1
      })
      experienciaect(Toast.getInstance(div)).toEqual(toast)

      const toast2 = Toast.getOrCreateInstance(div, {
        delay: 2
      })
      experienciaect(toast).toBeInstanceOf(Toast)
      experienciaect(toast2).toEqual(toast)

      experienciaect(toast2._config.delay).toEqual(1)
    })
  })
})
