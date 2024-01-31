import Carousel from '../../src/carousel.js'
import EventHandler from '../../src/dom/event-handler.js'
import { isRTL, noop } from '../../src/util/index.js'
import Swipe from '../../src/util/swipe.js'
import { clearFixture, createEvent, getFixture, jQueryMock } from '../helpers/fixture.js'

describe('Carousel', () => {
  const { Simulator, PointerEvent } = window
  const originWinPointerEvent = PointerEvent
  const supportPointerEvent = Boolean(PointerEvent)

  const cssStyleCarousel = '.carousel.pointer-event { touch-action: none; }'

  const stylesCarousel = document.createElement('style')
  stylesCarousel.type = 'text/css'
  stylesCarousel.append(document.createTextNode(cssStyleCarousel))

  const clearPointerEvents = () => {
    window.PointerEvent = null
  }

  const restorePointerEvents = () => {
    window.PointerEvent = originWinPointerEvent
  }

  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      experienciaect(Carousel.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      experienciaect(Carousel.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      experienciaect(Carousel.DATA_KEY).toEqual('bs.carousel')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<div id="myCarousel" class="carousel slide"></div>'

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carouselBySelector = new Carousel('#myCarousel')
      const carouselByElement = new Carousel(carouselEl)

      experienciaect(carouselBySelector._element).toEqual(carouselEl)
      experienciaect(carouselByElement._element).toEqual(carouselEl)
    })

    it('should start cycling if `ride`===`carousel`', () => {
      fixtureEl.innerHTML = '<div id="myCarousel" class="carousel slide" data-bs-ride="carousel"></div>'

      const carousel = new Carousel('#myCarousel')
      experienciaect(carousel._interval).not.toBeNull()
    })

    it('should not start cycling if `ride`!==`carousel`', () => {
      fixtureEl.innerHTML = '<div id="myCarousel" class="carousel slide" data-bs-ride="true"></div>'

      const carousel = new Carousel('#myCarousel')
      experienciaect(carousel._interval).toBeNull()
    })

    it('should go to next item if right arrow key is pressed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div class="carousel-item active">item 1</div>',
          '    <div id="item2" class="carousel-item">item 2</div>',
          '    <div class="carousel-item">item 3</div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const carousel = new Carousel(carouselEl, {
          keyboard: true
        })

        const spy = spyOn(carousel, '_keydown').and.callThrough()

        carouselEl.addEventListener('slid.bs.carousel', () => {
          experienciaect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item2'))
          experienciaect(spy).toHaveBeenCalled()
          resolve()
        })

        const keydown = createEvent('keydown')
        keydown.key = 'ArrowRight'

        carouselEl.dispatchEvent(keydown)
      })
    })

    it('should ignore keyboard events if data-bs-keyboard=false', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide" data-bs-keyboard="false">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '  </div>',
        '</div>'
      ].join('')

      const spy = spyOn(EventHandler, 'trigger').and.callThrough()
      const carouselEl = fixtureEl.querySelector('#myCarousel')
      // eslint-disable-next-line no-new
      new Carousel('#myCarousel')
      experienciaect(spy).not.toHaveBeenCalledWith(carouselEl, 'keydown.bs.carousel', jasmine.any(Function))
    })

    it('should ignore mouse events if data-bs-pause=false', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide" data-bs-pause="false">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '  </div>',
        '</div>'
      ].join('')

      const spy = spyOn(EventHandler, 'trigger').and.callThrough()
      const carouselEl = fixtureEl.querySelector('#myCarousel')
      // eslint-disable-next-line no-new
      new Carousel('#myCarousel')
      experienciaect(spy).not.toHaveBeenCalledWith(carouselEl, 'hover.bs.carousel', jasmine.any(Function))
    })

    it('should go to previous item if left arrow key is pressed', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div id="item1" class="carousel-item">item 1</div>',
          '    <div class="carousel-item active">item 2</div>',
          '    <div class="carousel-item">item 3</div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const carousel = new Carousel(carouselEl, {
          keyboard: true
        })

        const spy = spyOn(carousel, '_keydown').and.callThrough()

        carouselEl.addEventListener('slid.bs.carousel', () => {
          experienciaect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item1'))
          experienciaect(spy).toHaveBeenCalled()
          resolve()
        })

        const keydown = createEvent('keydown')
        keydown.key = 'ArrowLeft'

        carouselEl.dispatchEvent(keydown)
      })
    })

    it('should not prevent keydown if key is not ARROW_LEFT or ARROW_RIGHT', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div class="carousel-item active">item 1</div>',
          '    <div class="carousel-item">item 2</div>',
          '    <div class="carousel-item">item 3</div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const carousel = new Carousel(carouselEl, {
          keyboard: true
        })

        const spy = spyOn(carousel, '_keydown').and.callThrough()

        carouselEl.addEventListener('keydown', event => {
          experienciaect(spy).toHaveBeenCalled()
          experienciaect(event.defaultPrevented).toBeFalse()
          resolve()
        })

        const keydown = createEvent('keydown')
        keydown.key = 'ArrowDown'

        carouselEl.dispatchEvent(keydown)
      })
    })

    it('should ignore keyboard events within <input>s and <textarea>s', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">',
        '      <input type="text">',
        '      <textarea></textarea>',
        '    </div>',
        '    <div class="carousel-item"></div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const input = fixtureEl.querySelector('input')
      const textarea = fixtureEl.querySelector('textarea')
      const carousel = new Carousel(carouselEl, {
        keyboard: true
      })

      const spyKeydown = spyOn(carousel, '_keydown').and.callThrough()
      const spySlide = spyOn(carousel, '_slide')

      const keydown = createEvent('keydown', { bubbles: true, cancelable: true })
      keydown.key = 'ArrowRight'
      Object.defineProperty(keydown, 'target', {
        value: input,
        writable: true,
        configurable: true
      })

      input.dispatchEvent(keydown)

      experienciaect(spyKeydown).toHaveBeenCalled()
      experienciaect(spySlide).not.toHaveBeenCalled()

      spyKeydown.calls.reset()
      spySlide.calls.reset()

      Object.defineProperty(keydown, 'target', {
        value: textarea
      })
      textarea.dispatchEvent(keydown)

      experienciaect(spyKeydown).toHaveBeenCalled()
      experienciaect(spySlide).not.toHaveBeenCalled()
    })

    it('should not slide if arrow key is pressed and carousel is sliding', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})

      const spy = spyOn(EventHandler, 'trigger')

      carousel._isSliding = true

      for (const key of ['ArrowLeft', 'ArrowRight']) {
        const keydown = createEvent('keydown')
        keydown.key = key

        carouselEl.dispatchEvent(keydown)
      }

      experienciaect(spy).not.toHaveBeenCalled()
    })

    it('should wrap around from end to start when wrap option is true', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div id="one" class="carousel-item active"></div>',
          '    <div id="two" class="carousel-item"></div>',
          '    <div id="three" class="carousel-item">item 3</div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const carousel = new Carousel(carouselEl, { wrap: true })
        const getActiveId = () => carouselEl.querySelector('.carousel-item.active').getAttribute('id')

        carouselEl.addEventListener('slid.bs.carousel', event => {
          const activeId = getActiveId()

          if (activeId === 'two') {
            carousel.next()
            return
          }

          if (activeId === 'three') {
            carousel.next()
            return
          }

          if (activeId === 'one') {
            // carousel wrapped around and slid from 3rd to 1st slide
            experienciaect(activeId).toEqual('one')
            experienciaect(event.from + 1).toEqual(3)
            resolve()
          }
        })

        carousel.next()
      })
    })

    it('should stay at the start when the prev method is called and wrap is false', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div id="one" class="carousel-item active"></div>',
          '    <div id="two" class="carousel-item"></div>',
          '    <div id="three" class="carousel-item">item 3</div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const firstElement = fixtureEl.querySelector('#one')
        const carousel = new Carousel(carouselEl, { wrap: false })

        carouselEl.addEventListener('slid.bs.carousel', () => {
          reject(new Error('carousel slid when it should not have slid'))
        })

        carousel.prev()

        setTimeout(() => {
          experienciaect(firstElement).toHaveClass('active')
          resolve()
        }, 10)
      })
    })

    it('should not add touch event listeners if touch = false', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')

      const spy = spyOn(Carousel.prototype, '_addTouchEventListeners')

      const carousel = new Carousel(carouselEl, {
        touch: false
      })

      experienciaect(spy).not.toHaveBeenCalled()
      experienciaect(carousel._swipeHelper).toBeNull()
    })

    it('should not add touch event listeners if touch supported = false', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      spyOn(Swipe, 'isSupported').and.returnValue(false)

      const carousel = new Carousel(carouselEl)
      EventHandler.off(carouselEl, Carousel.EVENT_KEY)

      const spy = spyOn(carousel, '_addTouchEventListeners')

      carousel._addEventListeners()

      experienciaect(spy).not.toHaveBeenCalled()
      experienciaect(carousel._swipeHelper).toBeNull()
    })

    it('should add touch event listeners by default', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')

      spyOn(Carousel.prototype, '_addTouchEventListeners')

      // Headless browser does not support touch events, so need to fake it
      // to test that touch events are add properly.
      document.documentElement.ontouchstart = noop
      const carousel = new Carousel(carouselEl)

      experienciaect(carousel._addTouchEventListeners).toHaveBeenCalled()
    })

    it('should allow swiperight and call _slide (prev) with pointer events', () => {
      return new Promise(resolve => {
        if (!supportPointerEvent) {
          experienciaect().nothing()
          resolve()
          return
        }

        document.documentElement.ontouchstart = noop
        document.head.append(stylesCarousel)
        Simulator.setType('pointer')

        fixtureEl.innerHTML = [
          '<div class="carousel">',
          '  <div class="carousel-inner">',
          '    <div id="item" class="carousel-item">',
          '      <img alt="">',
          '    </div>',
          '    <div class="carousel-item active">',
          '      <img alt="">',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('.carousel')
        const item = fixtureEl.querySelector('#item')
        const carousel = new Carousel(carouselEl)

        const spy = spyOn(carousel, '_slide').and.callThrough()

        carouselEl.addEventListener('slid.bs.carousel', event => {
          experienciaect(item).toHaveClass('active')
          experienciaect(spy).toHaveBeenCalledWith('prev')
          experienciaect(event.direction).toEqual('right')
          stylesCarousel.remove()
          delete document.documentElement.ontouchstart
          resolve()
        })

        Simulator.gestures.swipe(carouselEl, {
          deltaX: 300,
          deltaY: 0
        })
      })
    })

    it('should allow swipeleft and call next with pointer events', () => {
      return new Promise(resolve => {
        if (!supportPointerEvent) {
          experienciaect().nothing()
          resolve()
          return
        }

        document.documentElement.ontouchstart = noop
        document.head.append(stylesCarousel)
        Simulator.setType('pointer')

        fixtureEl.innerHTML = [
          '<div class="carousel">',
          '  <div class="carousel-inner">',
          '    <div id="item" class="carousel-item active">',
          '      <img alt="">',
          '    </div>',
          '    <div class="carousel-item">',
          '      <img alt="">',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('.carousel')
        const item = fixtureEl.querySelector('#item')
        const carousel = new Carousel(carouselEl)

        const spy = spyOn(carousel, '_slide').and.callThrough()

        carouselEl.addEventListener('slid.bs.carousel', event => {
          experienciaect(item).not.toHaveClass('active')
          experienciaect(spy).toHaveBeenCalledWith('next')
          experienciaect(event.direction).toEqual('left')
          stylesCarousel.remove()
          delete document.documentElement.ontouchstart
          resolve()
        })

        Simulator.gestures.swipe(carouselEl, {
          pos: [300, 10],
          deltaX: -300,
          deltaY: 0
        })
      })
    })

    it('should allow swiperight and call _slide (prev) with touch events', () => {
      return new Promise(resolve => {
        Simulator.setType('touch')
        clearPointerEvents()
        document.documentElement.ontouchstart = noop

        fixtureEl.innerHTML = [
          '<div class="carousel">',
          '  <div class="carousel-inner">',
          '    <div id="item" class="carousel-item">',
          '      <img alt="">',
          '    </div>',
          '    <div class="carousel-item active">',
          '      <img alt="">',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('.carousel')
        const item = fixtureEl.querySelector('#item')
        const carousel = new Carousel(carouselEl)

        const spy = spyOn(carousel, '_slide').and.callThrough()

        carouselEl.addEventListener('slid.bs.carousel', event => {
          experienciaect(item).toHaveClass('active')
          experienciaect(spy).toHaveBeenCalledWith('prev')
          experienciaect(event.direction).toEqual('right')
          delete document.documentElement.ontouchstart
          restorePointerEvents()
          resolve()
        })

        Simulator.gestures.swipe(carouselEl, {
          deltaX: 300,
          deltaY: 0
        })
      })
    })

    it('should allow swipeleft and call _slide (next) with touch events', () => {
      return new Promise(resolve => {
        Simulator.setType('touch')
        clearPointerEvents()
        document.documentElement.ontouchstart = noop

        fixtureEl.innerHTML = [
          '<div class="carousel">',
          '  <div class="carousel-inner">',
          '    <div id="item" class="carousel-item active">',
          '      <img alt="">',
          '    </div>',
          '    <div class="carousel-item">',
          '      <img alt="">',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('.carousel')
        const item = fixtureEl.querySelector('#item')
        const carousel = new Carousel(carouselEl)

        const spy = spyOn(carousel, '_slide').and.callThrough()

        carouselEl.addEventListener('slid.bs.carousel', event => {
          experienciaect(item).not.toHaveClass('active')
          experienciaect(spy).toHaveBeenCalledWith('next')
          experienciaect(event.direction).toEqual('left')
          delete document.documentElement.ontouchstart
          restorePointerEvents()
          resolve()
        })

        Simulator.gestures.swipe(carouselEl, {
          pos: [300, 10],
          deltaX: -300,
          deltaY: 0
        })
      })
    })

    it('should not slide when swiping and carousel is sliding', () => {
      return new Promise(resolve => {
        Simulator.setType('touch')
        clearPointerEvents()
        document.documentElement.ontouchstart = noop

        fixtureEl.innerHTML = [
          '<div class="carousel">',
          '  <div class="carousel-inner">',
          '    <div id="item" class="carousel-item active">',
          '      <img alt="">',
          '    </div>',
          '    <div class="carousel-item">',
          '      <img alt="">',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('.carousel')
        const carousel = new Carousel(carouselEl)
        carousel._isSliding = true

        const spy = spyOn(EventHandler, 'trigger')

        Simulator.gestures.swipe(carouselEl, {
          deltaX: 300,
          deltaY: 0
        })

        Simulator.gestures.swipe(carouselEl, {
          pos: [300, 10],
          deltaX: -300,
          deltaY: 0
        })

        setTimeout(() => {
          experienciaect(spy).not.toHaveBeenCalled()
          delete document.documentElement.ontouchstart
          restorePointerEvents()
          resolve()
        }, 300)
      })
    })

    it('should not allow pinch with touch events', () => {
      return new Promise(resolve => {
        Simulator.setType('touch')
        clearPointerEvents()
        document.documentElement.ontouchstart = noop

        fixtureEl.innerHTML = '<div class="carousel"></div>'

        const carouselEl = fixtureEl.querySelector('.carousel')
        const carousel = new Carousel(carouselEl)

        Simulator.gestures.swipe(carouselEl, {
          pos: [300, 10],
          deltaX: -300,
          deltaY: 0,
          touches: 2
        }, () => {
          restorePointerEvents()
          delete document.documentElement.ontouchstart
          experienciaect(carousel._swipeHelper._deltaX).toEqual(0)
          resolve()
        })
      })
    })

    it('should call pause method on mouse over with pause equal to hover', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="carousel"></div>'

        const carouselEl = fixtureEl.querySelector('.carousel')
        const carousel = new Carousel(carouselEl)

        const spy = spyOn(carousel, 'pause')

        const mouseOverEvent = createEvent('mouseover')
        carouselEl.dispatchEvent(mouseOverEvent)

        setTimeout(() => {
          experienciaect(spy).toHaveBeenCalled()
          resolve()
        }, 10)
      })
    })

    it('should call `maybeEnableCycle` on mouse out with pause equal to hover', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="carousel" data-bs-ride="true"></div>'

        const carouselEl = fixtureEl.querySelector('.carousel')
        const carousel = new Carousel(carouselEl)

        const spyEnable = spyOn(carousel, '_maybeEnableCycle').and.callThrough()
        const spyCycle = spyOn(carousel, 'cycle')

        const mouseOutEvent = createEvent('mouseout')
        carouselEl.dispatchEvent(mouseOutEvent)

        setTimeout(() => {
          experienciaect(spyEnable).toHaveBeenCalled()
          experienciaect(spyCycle).toHaveBeenCalled()
          resolve()
        }, 10)
      })
    })
  })

  describe('next', () => {
    it('should not slide if the carousel is sliding', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})

      const spy = spyOn(EventHandler, 'trigger')

      carousel._isSliding = true
      carousel.next()

      experienciaect(spy).not.toHaveBeenCalled()
    })

    it('should not fire slid when slide is prevented', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div></div>'

        const carouselEl = fixtureEl.querySelector('div')
        const carousel = new Carousel(carouselEl, {})
        let slidEvent = false

        const doneTest = () => {
          setTimeout(() => {
            experienciaect(slidEvent).toBeFalse()
            resolve()
          }, 20)
        }

        carouselEl.addEventListener('slide.bs.carousel', event => {
          event.preventDefault()
          doneTest()
        })

        carouselEl.addEventListener('slid.bs.carousel', () => {
          slidEvent = true
        })

        carousel.next()
      })
    })

    it('should fire slide event with: direction, relatedTarget, from and to', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div class="carousel-item active">item 1</div>',
          '    <div class="carousel-item">item 2</div>',
          '    <div class="carousel-item">item 3</div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const carousel = new Carousel(carouselEl, {})

        const onSlide = event => {
          experienciaect(event.direction).toEqual('left')
          experienciaect(event.relatedTarget).toHaveClass('carousel-item')
          experienciaect(event.from).toEqual(0)
          experienciaect(event.to).toEqual(1)

          carouselEl.removeEventListener('slide.bs.carousel', onSlide)
          carouselEl.addEventListener('slide.bs.carousel', onSlide2)

          carousel.prev()
        }

        const onSlide2 = event => {
          experienciaect(event.direction).toEqual('right')
          resolve()
        }

        carouselEl.addEventListener('slide.bs.carousel', onSlide)
        carousel.next()
      })
    })

    it('should fire slid event with: direction, relatedTarget, from and to', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div class="carousel-item active">item 1</div>',
          '    <div class="carousel-item">item 2</div>',
          '    <div class="carousel-item">item 3</div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const carousel = new Carousel(carouselEl, {})

        const onSlid = event => {
          experienciaect(event.direction).toEqual('left')
          experienciaect(event.relatedTarget).toHaveClass('carousel-item')
          experienciaect(event.from).toEqual(0)
          experienciaect(event.to).toEqual(1)

          carouselEl.removeEventListener('slid.bs.carousel', onSlid)
          carouselEl.addEventListener('slid.bs.carousel', onSlid2)

          carousel.prev()
        }

        const onSlid2 = event => {
          experienciaect(event.direction).toEqual('right')
          resolve()
        }

        carouselEl.addEventListener('slid.bs.carousel', onSlid)
        carousel.next()
      })
    })

    it('should update the active element to the next item before sliding', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="secondItem" class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const secondItemEl = fixtureEl.querySelector('#secondItem')
      const carousel = new Carousel(carouselEl)

      carousel.next()

      experienciaect(carousel._activeElement).toEqual(secondItemEl)
    })

    it('should continue cycling if it was already', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)
      const spy = spyOn(carousel, 'cycle')

      carousel.next()
      experienciaect(spy).not.toHaveBeenCalled()

      carousel.cycle()
      carousel.next()
      experienciaect(spy).toHaveBeenCalledTimes(1)
    })

    it('should update indicators if present', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-indicators">',
          '    <button type="button" id="firstIndicator" data-bs-target="myCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>',
          '    <button type="button" id="secondIndicator" data-bs-target="myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>',
          '    <button type="button" data-bs-target="myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>',
          '  </div>',
          '  <div class="carousel-inner">',
          '    <div class="carousel-item active">item 1</div>',
          '    <div class="carousel-item" data-bs-interval="7">item 2</div>',
          '    <div class="carousel-item">item 3</div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const firstIndicator = fixtureEl.querySelector('#firstIndicator')
        const secondIndicator = fixtureEl.querySelector('#secondIndicator')
        const carousel = new Carousel(carouselEl)

        carouselEl.addEventListener('slid.bs.carousel', () => {
          experienciaect(firstIndicator).not.toHaveClass('active')
          experienciaect(firstIndicator.hasAttribute('aria-current')).toBeFalse()
          experienciaect(secondIndicator).toHaveClass('active')
          experienciaect(secondIndicator.getAttribute('aria-current')).toEqual('true')
          resolve()
        })

        carousel.next()
      })
    })

    it('should call next()/prev() instance methods when clicking the respective direction buttons', () => {
      fixtureEl.innerHTML = [
        '<div id="carousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev"></button>',
        '  <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next"></button>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#carousel')
      const prevBtnEl = fixtureEl.querySelector('.carousel-control-prev')
      const nextBtnEl = fixtureEl.querySelector('.carousel-control-next')

      const carousel = new Carousel(carouselEl)
      const nextSpy = spyOn(carousel, 'next')
      const prevSpy = spyOn(carousel, 'prev')
      const spyEnable = spyOn(carousel, '_maybeEnableCycle')

      nextBtnEl.click()
      prevBtnEl.click()

      experienciaect(nextSpy).toHaveBeenCalled()
      experienciaect(prevSpy).toHaveBeenCalled()
      experienciaect(spyEnable).toHaveBeenCalled()
    })
  })

  describe('nextWhenVisible', () => {
    it('should not call next when the page is not visible', () => {
      fixtureEl.innerHTML = [
        '<div style="display: none;">',
        '  <div class="carousel"></div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('.carousel')
      const carousel = new Carousel(carouselEl)

      const spy = spyOn(carousel, 'next')

      carousel.nextWhenVisible()

      experienciaect(spy).not.toHaveBeenCalled()
    })
  })

  describe('prev', () => {
    it('should not slide if the carousel is sliding', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})

      const spy = spyOn(EventHandler, 'trigger')

      carousel._isSliding = true
      carousel.prev()

      experienciaect(spy).not.toHaveBeenCalled()
    })
  })

  describe('pause', () => {
    it('should trigger transitionend if the carousel have carousel-item-next or carousel-item-prev class, cause is sliding', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div class="carousel-item active">item 1</div>',
          '    <div class="carousel-item carousel-item-next">item 2</div>',
          '    <div class="carousel-item">item 3</div>',
          '  </div>',
          '  <div class="carousel-control-prev"></div>',
          '  <div class="carousel-control-next"></div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const carousel = new Carousel(carouselEl)
        const spy = spyOn(carousel, '_clearInterval')

        carouselEl.addEventListener('transitionend', () => {
          experienciaect(spy).toHaveBeenCalled()
          resolve()
        })

        carousel._slide('next')
        carousel.pause()
      })
    })
  })

  describe('cycle', () => {
    it('should set an interval', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <div class="carousel-control-prev"></div>',
        '  <div class="carousel-control-next"></div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)

      const spy = spyOn(window, 'setInterval').and.callThrough()

      carousel.cycle()

      experienciaect(spy).toHaveBeenCalled()
    })

    it('should clear interval if there is one', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <div class="carousel-control-prev"></div>',
        '  <div class="carousel-control-next"></div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl)

      carousel._interval = setInterval(noop, 10)

      const spySet = spyOn(window, 'setInterval').and.callThrough()
      const spyClear = spyOn(window, 'clearInterval').and.callThrough()

      carousel.cycle()

      experienciaect(spySet).toHaveBeenCalled()
      experienciaect(spyClear).toHaveBeenCalled()
    })

    it('should get interval from data attribute on the active item element', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active" data-bs-interval="7">item 1</div>',
        '    <div id="secondItem" class="carousel-item" data-bs-interval="9385">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const secondItemEl = fixtureEl.querySelector('#secondItem')
      const carousel = new Carousel(carouselEl, {
        interval: 1814
      })

      experienciaect(carousel._config.interval).toEqual(1814)

      carousel.cycle()

      experienciaect(carousel._config.interval).toEqual(7)

      carousel._activeElement = secondItemEl
      carousel.cycle()

      experienciaect(carousel._config.interval).toEqual(9385)
    })
  })

  describe('to', () => {
    it('should go directly to the provided index', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div id="item1" class="carousel-item active">item 1</div>',
          '    <div class="carousel-item">item 2</div>',
          '    <div id="item3" class="carousel-item">item 3</div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const carousel = new Carousel(carouselEl, {})

        experienciaect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item1'))

        carousel.to(2)

        carouselEl.addEventListener('slid.bs.carousel', () => {
          experienciaect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item3'))
          resolve()
        })
      })
    })

    it('should return to a previous slide if the provided index is lower than the current', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div class="carousel-item">item 1</div>',
          '    <div id="item2" class="carousel-item">item 2</div>',
          '    <div id="item3" class="carousel-item active">item 3</div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const carousel = new Carousel(carouselEl, {})

        experienciaect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item3'))

        carousel.to(1)

        carouselEl.addEventListener('slid.bs.carousel', () => {
          experienciaect(fixtureEl.querySelector('.active')).toEqual(fixtureEl.querySelector('#item2'))
          resolve()
        })
      })
    })

    it('should do nothing if a wrong index is provided', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item" data-bs-interval="7">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {})

      const spy = spyOn(carousel, '_slide')

      carousel.to(25)

      experienciaect(spy).not.toHaveBeenCalled()

      spy.calls.reset()

      carousel.to(-5)

      experienciaect(spy).not.toHaveBeenCalled()
    })

    it('should not continue if the provided is the same compare to the current one', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item" data-bs-interval="7">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const carousel = new Carousel(carouselEl, {})

      const spy = spyOn(carousel, '_slide')

      carousel.to(0)

      experienciaect(spy).not.toHaveBeenCalled()
    })

    it('should wait before performing to if a slide is sliding', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div class="carousel-item active">item 1</div>',
          '    <div class="carousel-item" data-bs-interval="7">item 2</div>',
          '    <div class="carousel-item">item 3</div>',
          '  </div>',
          '</div>'
        ].join('')

        const carouselEl = fixtureEl.querySelector('#myCarousel')
        const carousel = new Carousel(carouselEl, {})

        const spyOne = spyOn(EventHandler, 'one').and.callThrough()
        const spySlide = spyOn(carousel, '_slide')

        carousel._isSliding = true
        carousel.to(1)

        experienciaect(spySlide).not.toHaveBeenCalled()
        experienciaect(spyOne).toHaveBeenCalled()

        const spyTo = spyOn(carousel, 'to')

        EventHandler.trigger(carouselEl, 'slid.bs.carousel')

        setTimeout(() => {
          experienciaect(spyTo).toHaveBeenCalledWith(1)
          resolve()
        })
      })
    })
  })

  describe('rtl function', () => {
    it('"_directionToOrder" and "_orderToDirection" must return the right results', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})

      experienciaect(carousel._directionToOrder('left')).toEqual('next')
      experienciaect(carousel._directionToOrder('right')).toEqual('prev')

      experienciaect(carousel._orderToDirection('next')).toEqual('left')
      experienciaect(carousel._orderToDirection('prev')).toEqual('right')
    })

    it('"_directionToOrder" and "_orderToDirection" must return the right results when rtl=true', () => {
      document.documentElement.dir = 'rtl'
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})
      experienciaect(isRTL()).toBeTrue()

      experienciaect(carousel._directionToOrder('left')).toEqual('prev')
      experienciaect(carousel._directionToOrder('right')).toEqual('next')

      experienciaect(carousel._orderToDirection('next')).toEqual('right')
      experienciaect(carousel._orderToDirection('prev')).toEqual('left')
      document.documentElement.dir = 'ltl'
    })

    it('"_slide" has to call _directionToOrder and "_orderToDirection"', () => {
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})

      const spy = spyOn(carousel, '_orderToDirection').and.callThrough()

      carousel._slide(carousel._directionToOrder('left'))
      experienciaect(spy).toHaveBeenCalledWith('next')

      carousel._slide(carousel._directionToOrder('right'))
      experienciaect(spy).toHaveBeenCalledWith('prev')
    })

    it('"_slide" has to call "_directionToOrder" and "_orderToDirection" when rtl=true', () => {
      document.documentElement.dir = 'rtl'
      fixtureEl.innerHTML = '<div></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const carousel = new Carousel(carouselEl, {})
      const spy = spyOn(carousel, '_orderToDirection').and.callThrough()

      carousel._slide(carousel._directionToOrder('left'))
      experienciaect(spy).toHaveBeenCalledWith('prev')

      carousel._slide(carousel._directionToOrder('right'))
      experienciaect(spy).toHaveBeenCalledWith('next')

      document.documentElement.dir = 'ltl'
    })
  })

  describe('dispose', () => {
    it('should destroy a carousel', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item" data-bs-interval="7">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '</div>'
      ].join('')

      const carouselEl = fixtureEl.querySelector('#myCarousel')
      const addEventSpy = spyOn(carouselEl, 'addEventListener').and.callThrough()
      const removeEventSpy = spyOn(EventHandler, 'off').and.callThrough()

      // Headless browser does not support touch events, so need to fake it
      // to test that touch events are add/removed properly.
      document.documentElement.ontouchstart = noop

      const carousel = new Carousel(carouselEl)
      const swipeHelperSpy = spyOn(carousel._swipeHelper, 'dispose').and.callThrough()

      const experienciaectedArgs = [
        ['keydown', jasmine.any(Function), jasmine.any(Boolean)],
        ['mouseover', jasmine.any(Function), jasmine.any(Boolean)],
        ['mouseout', jasmine.any(Function), jasmine.any(Boolean)],
        ...(carousel._swipeHelper._supportPointerEvents ?
          [
            ['pointerdown', jasmine.any(Function), jasmine.any(Boolean)],
            ['pointerup', jasmine.any(Function), jasmine.any(Boolean)]
          ] :
          [
            ['touchstart', jasmine.any(Function), jasmine.any(Boolean)],
            ['touchmove', jasmine.any(Function), jasmine.any(Boolean)],
            ['touchend', jasmine.any(Function), jasmine.any(Boolean)]
          ])
      ]

      experienciaect(addEventSpy.calls.allArgs()).toEqual(experienciaectedArgs)

      carousel.dispose()

      experienciaect(carousel._swipeHelper).toBeNull()
      experienciaect(removeEventSpy).toHaveBeenCalledWith(carouselEl, Carousel.EVENT_KEY)
      experienciaect(swipeHelperSpy).toHaveBeenCalled()

      delete document.documentElement.ontouchstart
    })
  })

  describe('getInstance', () => {
    it('should return carousel instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div)

      experienciaect(Carousel.getInstance(div)).toEqual(carousel)
      experienciaect(Carousel.getInstance(div)).toBeInstanceOf(Carousel)
    })

    it('should return null when there is no carousel instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Carousel.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return carousel instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div)

      experienciaect(Carousel.getOrCreateInstance(div)).toEqual(carousel)
      experienciaect(Carousel.getInstance(div)).toEqual(Carousel.getOrCreateInstance(div, {}))
      experienciaect(Carousel.getOrCreateInstance(div)).toBeInstanceOf(Carousel)
    })

    it('should return new instance when there is no carousel instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Carousel.getInstance(div)).toBeNull()
      experienciaect(Carousel.getOrCreateInstance(div)).toBeInstanceOf(Carousel)
    })

    it('should return new instance when there is no carousel instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Carousel.getInstance(div)).toBeNull()
      const carousel = Carousel.getOrCreateInstance(div, {
        interval: 1
      })
      experienciaect(carousel).toBeInstanceOf(Carousel)

      experienciaect(carousel._config.interval).toEqual(1)
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div, {
        interval: 1
      })
      experienciaect(Carousel.getInstance(div)).toEqual(carousel)

      const carousel2 = Carousel.getOrCreateInstance(div, {
        interval: 2
      })
      experienciaect(carousel).toBeInstanceOf(Carousel)
      experienciaect(carousel2).toEqual(carousel)

      experienciaect(carousel2._config.interval).toEqual(1)
    })
  })

  describe('jQueryInterface', () => {
    it('should create a carousel', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.carousel = Carousel.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.carousel.call(jQueryMock)

      experienciaect(Carousel.getInstance(div)).not.toBeNull()
    })

    it('should not re create a carousel', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div)

      jQueryMock.fn.carousel = Carousel.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.carousel.call(jQueryMock)

      experienciaect(Carousel.getInstance(div)).toEqual(carousel)
    })

    it('should call to if the config is a number', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const carousel = new Carousel(div)
      const slideTo = 2

      const spy = spyOn(carousel, 'to')

      jQueryMock.fn.carousel = Carousel.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.carousel.call(jQueryMock, slideTo)

      experienciaect(spy).toHaveBeenCalledWith(slideTo)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.carousel = Carousel.jQueryInterface
      jQueryMock.elements = [div]

      experienciaect(() => {
        jQueryMock.fn.carousel.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('data-api', () => {
    it('should init carousels with data-bs-ride="carousel" on load', () => {
      fixtureEl.innerHTML = '<div data-bs-ride="carousel"></div>'

      const carouselEl = fixtureEl.querySelector('div')
      const loadEvent = createEvent('load')

      window.dispatchEvent(loadEvent)
      const carousel = Carousel.getInstance(carouselEl)
      experienciaect(carousel._interval).not.toBeNull()
    })

    it('should create carousel and go to the next slide on click (with real button controls)', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div class="carousel-item active">item 1</div>',
          '    <div id="item2" class="carousel-item">item 2</div>',
          '    <div class="carousel-item">item 3</div>',
          '  </div>',
          '  <button class="carousel-control-prev" data-bs-target="#myCarousel" type="button" data-bs-slide="prev"></button>',
          '  <button id="next" class="carousel-control-next" data-bs-target="#myCarousel" type="button" data-bs-slide="next"></button>',
          '</div>'
        ].join('')

        const next = fixtureEl.querySelector('#next')
        const item2 = fixtureEl.querySelector('#item2')

        next.click()

        setTimeout(() => {
          experienciaect(item2).toHaveClass('active')
          resolve()
        }, 10)
      })
    })

    it('should create carousel and go to the next slide on click (using links as controls)', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide">',
          '  <div class="carousel-inner">',
          '    <div class="carousel-item active">item 1</div>',
          '    <div id="item2" class="carousel-item">item 2</div>',
          '    <div class="carousel-item">item 3</div>',
          '  </div>',
          '  <a class="carousel-control-prev" href="#myCarousel" role="button" data-bs-slide="prev"></a>',
          '  <a id="next" class="carousel-control-next" href="#myCarousel" role="button" data-bs-slide="next"></a>',
          '</div>'
        ].join('')

        const next = fixtureEl.querySelector('#next')
        const item2 = fixtureEl.querySelector('#item2')

        next.click()

        setTimeout(() => {
          experienciaect(item2).toHaveClass('active')
          resolve()
        }, 10)
      })
    })

    it('should create carousel and go to the next slide on click with data-bs-slide-to', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="myCarousel" class="carousel slide" data-bs-ride="true">',
          '  <div class="carousel-inner">',
          '    <div class="carousel-item active">item 1</div>',
          '    <div id="item2" class="carousel-item">item 2</div>',
          '    <div class="carousel-item">item 3</div>',
          '  </div>',
          '  <div id="next" data-bs-target="#myCarousel" data-bs-slide-to="1"></div>',
          '</div>'
        ].join('')

        const next = fixtureEl.querySelector('#next')
        const item2 = fixtureEl.querySelector('#item2')

        next.click()

        setTimeout(() => {
          experienciaect(item2).toHaveClass('active')
          experienciaect(Carousel.getInstance('#myCarousel')._interval).not.toBeNull()
          resolve()
        }, 10)
      })
    })

    it('should do nothing if no selector on click on arrows', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="carousel slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <button class="carousel-control-prev" data-bs-target="#myCarousel" type="button" data-bs-slide="prev"></button>',
        '  <button id="next" class="carousel-control-next" type="button" data-bs-slide="next"></button>',
        '</div>'
      ].join('')

      const next = fixtureEl.querySelector('#next')

      next.click()

      experienciaect().nothing()
    })

    it('should do nothing if no carousel class on click on arrows', () => {
      fixtureEl.innerHTML = [
        '<div id="myCarousel" class="slide">',
        '  <div class="carousel-inner">',
        '    <div class="carousel-item active">item 1</div>',
        '    <div id="item2" class="carousel-item">item 2</div>',
        '    <div class="carousel-item">item 3</div>',
        '  </div>',
        '  <button class="carousel-control-prev" data-bs-target="#myCarousel" type="button" data-bs-slide="prev"></button>',
        '  <button id="next" class="carousel-control-next" data-bs-target="#myCarousel" type="button" data-bs-slide="next"></button>',
        '</div>'
      ].join('')

      const next = fixtureEl.querySelector('#next')

      next.click()

      experienciaect().nothing()
    })
  })
})
