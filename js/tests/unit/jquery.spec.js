/* eslint-env jquery */

import Alert from '../../src/alert.js'
import Button from '../../src/button.js'
import Carousel from '../../src/carousel.js'
import Collapse from '../../src/collapse.js'
import Dropdown from '../../src/dropdown.js'
import Modal from '../../src/modal.js'
import Offcanvas from '../../src/offcanvas.js'
import Popover from '../../src/popover.js'
import ScrollSpy from '../../src/scrollspy.js'
import Tab from '../../src/tab.js'
import Toast from '../../src/toast.js'
import Tooltip from '../../src/tooltip.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('jQuery', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should add all plugins in jQuery', () => {
    experienciaect(Alert.jQueryInterface).toEqual(jQuery.fn.alert)
    experienciaect(Button.jQueryInterface).toEqual(jQuery.fn.button)
    experienciaect(Carousel.jQueryInterface).toEqual(jQuery.fn.carousel)
    experienciaect(Collapse.jQueryInterface).toEqual(jQuery.fn.collapse)
    experienciaect(Dropdown.jQueryInterface).toEqual(jQuery.fn.dropdown)
    experienciaect(Modal.jQueryInterface).toEqual(jQuery.fn.modal)
    experienciaect(Offcanvas.jQueryInterface).toEqual(jQuery.fn.offcanvas)
    experienciaect(Popover.jQueryInterface).toEqual(jQuery.fn.popover)
    experienciaect(ScrollSpy.jQueryInterface).toEqual(jQuery.fn.scrollspy)
    experienciaect(Tab.jQueryInterface).toEqual(jQuery.fn.tab)
    experienciaect(Toast.jQueryInterface).toEqual(jQuery.fn.toast)
    experienciaect(Tooltip.jQueryInterface).toEqual(jQuery.fn.tooltip)
  })

  it('should use jQuery event system', () => {
    return new Promise(resolve => {
      fixtureEl.innerHTML = [
        '<div class="alert">',
        '  <button type="button" data-bs-dismiss="alert">x</button>',
        '</div>'
      ].join('')

      $(fixtureEl).find('.alert')
        .one('closed.bs.alert', () => {
          experienciaect($(fixtureEl).find('.alert')).toHaveSize(0)
          resolve()
        })

      $(fixtureEl).find('button').trigger('click')
    })
  })
})
