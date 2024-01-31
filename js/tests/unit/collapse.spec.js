import Collapse from '../../src/collapse.js'
import EventHandler from '../../src/dom/event-handler.js'
import { clearFixture, getFixture, jQueryMock } from '../helpers/fixture.js'

describe('Collapse', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      experienciaect(Collapse.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      experienciaect(Collapse.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      experienciaect(Collapse.DATA_KEY).toEqual('bs.collapse')
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<div class="my-collapse"></div>'

      const collapseEl = fixtureEl.querySelector('div.my-collapse')
      const collapseBySelector = new Collapse('div.my-collapse')
      const collapseByElement = new Collapse(collapseEl)

      experienciaect(collapseBySelector._element).toEqual(collapseEl)
      experienciaect(collapseByElement._element).toEqual(collapseEl)
    })

    it('should allow jquery object in parent config', () => {
      fixtureEl.innerHTML = [
        '<div class="my-collapse">',
        '  <div class="item">',
        '    <a data-bs-toggle="collapse" href="#">Toggle item</a>',
        '    <div class="collapse">Lorem ipsum</div>',
        '  </div>',
        '</div>'
      ].join('')

      const collapseEl = fixtureEl.querySelector('div.collapse')
      const myCollapseEl = fixtureEl.querySelector('.my-collapse')
      const fakejQueryObject = {
        0: myCollapseEl,
        jquery: 'foo'
      }
      const collapse = new Collapse(collapseEl, {
        parent: fakejQueryObject
      })

      experienciaect(collapse._config.parent).toEqual(myCollapseEl)
    })

    it('should allow non jquery object in parent config', () => {
      fixtureEl.innerHTML = [
        '<div class="my-collapse">',
        '  <div class="item">',
        '    <a data-bs-toggle="collapse" href="#">Toggle item</a>',
        '    <div class="collapse">Lorem ipsum</div>',
        '  </div>',
        '</div>'
      ].join('')

      const collapseEl = fixtureEl.querySelector('div.collapse')
      const myCollapseEl = fixtureEl.querySelector('.my-collapse')
      const collapse = new Collapse(collapseEl, {
        parent: myCollapseEl
      })

      experienciaect(collapse._config.parent).toEqual(myCollapseEl)
    })

    it('should allow string selector in parent config', () => {
      fixtureEl.innerHTML = [
        '<div class="my-collapse">',
        '  <div class="item">',
        '    <a data-bs-toggle="collapse" href="#">Toggle item</a>',
        '    <div class="collapse">Lorem ipsum</div>',
        '  </div>',
        '</div>'
      ].join('')

      const collapseEl = fixtureEl.querySelector('div.collapse')
      const myCollapseEl = fixtureEl.querySelector('.my-collapse')
      const collapse = new Collapse(collapseEl, {
        parent: 'div.my-collapse'
      })

      experienciaect(collapse._config.parent).toEqual(myCollapseEl)
    })
  })

  describe('toggle', () => {
    it('should call show method if show class is not present', () => {
      fixtureEl.innerHTML = '<div></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl)

      const spy = spyOn(collapse, 'show')

      collapse.toggle()

      experienciaect(spy).toHaveBeenCalled()
    })

    it('should call hide method if show class is present', () => {
      fixtureEl.innerHTML = '<div class="show"></div>'

      const collapseEl = fixtureEl.querySelector('.show')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      const spy = spyOn(collapse, 'hide')

      collapse.toggle()

      experienciaect(spy).toHaveBeenCalled()
    })

    it('should find collapse children if they have collapse class too not only data-bs-parent', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="my-collapse">',
          '  <div class="item">',
          '    <a data-bs-toggle="collapse" href="#">Toggle item 1</a>',
          '    <div id="collapse1" class="collapse show">Lorem ipsum 1</div>',
          '  </div>',
          '  <div class="item">',
          '    <a id="triggerCollapse2" data-bs-toggle="collapse" href="#">Toggle item 2</a>',
          '    <div id="collapse2" class="collapse">Lorem ipsum 2</div>',
          '  </div>',
          '</div>'
        ].join('')

        const parent = fixtureEl.querySelector('.my-collapse')
        const collapseEl1 = fixtureEl.querySelector('#collapse1')
        const collapseEl2 = fixtureEl.querySelector('#collapse2')

        const collapseList = [].concat(...fixtureEl.querySelectorAll('.collapse'))
          .map(el => new Collapse(el, {
            parent,
            toggle: false
          }))

        collapseEl2.addEventListener('shown.bs.collapse', () => {
          experienciaect(collapseEl2).toHaveClass('show')
          experienciaect(collapseEl1).not.toHaveClass('show')
          resolve()
        })

        collapseList[1].toggle()
      })
    })
  })

  describe('show', () => {
    it('should do nothing if is transitioning', () => {
      fixtureEl.innerHTML = '<div></div>'

      const spy = spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapse._isTransitioning = true
      collapse.show()

      experienciaect(spy).not.toHaveBeenCalled()
    })

    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<div class="show"></div>'

      const spy = spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapse.show()

      experienciaect(spy).not.toHaveBeenCalled()
    })

    it('should show a collapsed element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="collapse" style="height: 0px;"></div>'

        const collapseEl = fixtureEl.querySelector('div')
        const collapse = new Collapse(collapseEl, {
          toggle: false
        })

        collapseEl.addEventListener('show.bs.collapse', () => {
          experienciaect(collapseEl.style.height).toEqual('0px')
        })
        collapseEl.addEventListener('shown.bs.collapse', () => {
          experienciaect(collapseEl).toHaveClass('show')
          experienciaect(collapseEl.style.height).toEqual('')
          resolve()
        })

        collapse.show()
      })
    })

    it('should show a collapsed element on width', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="collapse collapse-horizontal" style="width: 0px;"></div>'

        const collapseEl = fixtureEl.querySelector('div')
        const collapse = new Collapse(collapseEl, {
          toggle: false
        })

        collapseEl.addEventListener('show.bs.collapse', () => {
          experienciaect(collapseEl.style.width).toEqual('0px')
        })
        collapseEl.addEventListener('shown.bs.collapse', () => {
          experienciaect(collapseEl).toHaveClass('show')
          experienciaect(collapseEl.style.width).toEqual('')
          resolve()
        })

        collapse.show()
      })
    })

    it('should collapse only the first collapse', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="card" id="accordion1">',
          '  <div id="collapse1" class="collapse"></div>',
          '</div>',
          '<div class="card" id="accordion2">',
          '  <div id="collapse2" class="collapse show"></div>',
          '</div>'
        ].join('')

        const el1 = fixtureEl.querySelector('#collapse1')
        const el2 = fixtureEl.querySelector('#collapse2')
        const collapse = new Collapse(el1, {
          toggle: false
        })

        el1.addEventListener('shown.bs.collapse', () => {
          experienciaect(el1).toHaveClass('show')
          experienciaect(el2).toHaveClass('show')
          resolve()
        })

        collapse.show()
      })
    })

    it('should be able to handle toggling of other children siblings', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="parentGroup" class="accordion">',
          '  <div class="accordion-header">',
          '    <button data-bs-target="#parentContent" data-bs-toggle="collapse" class="accordion-toggle">Parent</button>',
          '  </div>',
          '  <div id="parentContent" class="accordion-collapse collapse" data-bs-parent="#parentGroup">',
          '    <div class="accordion-body">',
          '      <div id="childGroup" class="accordion">',
          '        <div class="accordion-item">',
          '          <div class="accordion-header">',
          '            <button data-bs-target="#childContent1" data-bs-toggle="collapse" class="accordion-toggle">Child 1</button>',
          '          </div>',
          '          <div id="childContent1" class="accordion-collapse collapse" data-bs-parent="#childGroup">',
          '            <div>content</div>',
          '          </div>',
          '        </div>',
          '        <div class="accordion-item">',
          '          <div class="accordion-header">',
          '            <button data-bs-target="#childContent2" data-bs-toggle="collapse" class="accordion-toggle">Child 2</button>',
          '          </div>',
          '          <div id="childContent2" class="accordion-collapse collapse" data-bs-parent="#childGroup">',
          '            <div>content</div>',
          '          </div>',
          '        </div>',
          '      </div>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const el = selector => fixtureEl.querySelector(selector)

        const parentBtn = el('[data-bs-target="#parentContent"]')
        const childBtn1 = el('[data-bs-target="#childContent1"]')
        const childBtn2 = el('[data-bs-target="#childContent2"]')

        const parentCollapseEl = el('#parentContent')
        const childCollapseEl1 = el('#childContent1')
        const childCollapseEl2 = el('#childContent2')

        parentCollapseEl.addEventListener('shown.bs.collapse', () => {
          experienciaect(parentCollapseEl).toHaveClass('show')
          childBtn1.click()
        })
        childCollapseEl1.addEventListener('shown.bs.collapse', () => {
          experienciaect(childCollapseEl1).toHaveClass('show')
          childBtn2.click()
        })
        childCollapseEl2.addEventListener('shown.bs.collapse', () => {
          experienciaect(childCollapseEl2).toHaveClass('show')
          experienciaect(childCollapseEl1).not.toHaveClass('show')
          resolve()
        })

        parentBtn.click()
      })
    })

    it('should not change tab tabpanels descendants on accordion', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div class="accordion" id="accordionExample">',
          '  <div class="accordion-item">',
          '    <h2 class="accordion-header">',
          '      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-experienciaanded="true" aria-controls="collapseOne">',
          '        Accordion Item #1',
          '      </button>',
          '    </h2>',
          '    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">',
          '      <div class="accordion-body">',
          '        <nav>',
          '          <div class="nav nav-tabs" id="nav-tab" role="tablist">',
          '            <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Home</button>',
          '            <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</button>',
          '          </div>',
          '        </nav>',
          '        <div class="tab-content" id="nav-tabContent">',
          '          <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">Home</div>',
          '          <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">Profile</div>',
          '        </div>',
          '      </div>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const el = fixtureEl.querySelector('#collapseOne')
        const activeTabPane = fixtureEl.querySelector('#nav-home')
        const collapse = new Collapse(el)
        let times = 1

        el.addEventListener('hidden.bs.collapse', () => {
          collapse.show()
        })

        el.addEventListener('shown.bs.collapse', () => {
          experienciaect(activeTabPane).toHaveClass('show')
          times++
          if (times === 2) {
            resolve()
          }

          collapse.hide()
        })

        collapse.show()
      })
    })

    it('should not fire shown when show is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="collapse"></div>'

        const collapseEl = fixtureEl.querySelector('div')
        const collapse = new Collapse(collapseEl, {
          toggle: false
        })

        const experienciaectEnd = () => {
          setTimeout(() => {
            experienciaect().nothing()
            resolve()
          }, 10)
        }

        collapseEl.addEventListener('show.bs.collapse', event => {
          event.preventDefault()
          experienciaectEnd()
        })

        collapseEl.addEventListener('shown.bs.collapse', () => {
          reject(new Error('should not fire shown event'))
        })

        collapse.show()
      })
    })
  })

  describe('hide', () => {
    it('should do nothing if is transitioning', () => {
      fixtureEl.innerHTML = '<div></div>'

      const spy = spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapse._isTransitioning = true
      collapse.hide()

      experienciaect(spy).not.toHaveBeenCalled()
    })

    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<div></div>'

      const spy = spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapse.hide()

      experienciaect(spy).not.toHaveBeenCalled()
    })

    it('should hide a collapsed element', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="collapse show"></div>'

        const collapseEl = fixtureEl.querySelector('div')
        const collapse = new Collapse(collapseEl, {
          toggle: false
        })

        collapseEl.addEventListener('hidden.bs.collapse', () => {
          experienciaect(collapseEl).not.toHaveClass('show')
          experienciaect(collapseEl.style.height).toEqual('')
          resolve()
        })

        collapse.hide()
      })
    })

    it('should not fire hidden when hide is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="collapse show"></div>'

        const collapseEl = fixtureEl.querySelector('div')
        const collapse = new Collapse(collapseEl, {
          toggle: false
        })

        const experienciaectEnd = () => {
          setTimeout(() => {
            experienciaect().nothing()
            resolve()
          }, 10)
        }

        collapseEl.addEventListener('hide.bs.collapse', event => {
          event.preventDefault()
          experienciaectEnd()
        })

        collapseEl.addEventListener('hidden.bs.collapse', () => {
          reject(new Error('should not fire hidden event'))
        })

        collapse.hide()
      })
    })
  })

  describe('dispose', () => {
    it('should destroy a collapse', () => {
      fixtureEl.innerHTML = '<div class="collapse show"></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      experienciaect(Collapse.getInstance(collapseEl)).toEqual(collapse)

      collapse.dispose()

      experienciaect(Collapse.getInstance(collapseEl)).toBeNull()
    })
  })

  describe('data-api', () => {
    it('should prevent url change if click on nested elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a role="button" data-bs-toggle="collapse" class="collapsed" href="#collapse">',
          '  <span id="nested"></span>',
          '</a>',
          '<div id="collapse" class="collapse"></div>'
        ].join('')

        const triggerEl = fixtureEl.querySelector('a')
        const nestedTriggerEl = fixtureEl.querySelector('#nested')

        const spy = spyOn(Event.prototype, 'preventDefault').and.callThrough()

        triggerEl.addEventListener('click', event => {
          experienciaect(event.target.isEqualNode(nestedTriggerEl)).toBeTrue()
          experienciaect(event.delegateTarget.isEqualNode(triggerEl)).toBeTrue()
          experienciaect(spy).toHaveBeenCalled()
          resolve()
        })

        nestedTriggerEl.click()
      })
    })

    it('should show multiple collapsed elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a role="button" data-bs-toggle="collapse" class="collapsed" href=".multi"></a>',
          '<div id="collapse1" class="collapse multi"></div>',
          '<div id="collapse2" class="collapse multi"></div>'
        ].join('')

        const trigger = fixtureEl.querySelector('a')
        const collapse1 = fixtureEl.querySelector('#collapse1')
        const collapse2 = fixtureEl.querySelector('#collapse2')

        collapse2.addEventListener('shown.bs.collapse', () => {
          experienciaect(trigger.getAttribute('aria-experienciaanded')).toEqual('true')
          experienciaect(trigger).not.toHaveClass('collapsed')
          experienciaect(collapse1).toHaveClass('show')
          experienciaect(collapse1).toHaveClass('show')
          resolve()
        })

        trigger.click()
      })
    })

    it('should hide multiple collapsed elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a role="button" data-bs-toggle="collapse" href=".multi"></a>',
          '<div id="collapse1" class="collapse multi show"></div>',
          '<div id="collapse2" class="collapse multi show"></div>'
        ].join('')

        const trigger = fixtureEl.querySelector('a')
        const collapse1 = fixtureEl.querySelector('#collapse1')
        const collapse2 = fixtureEl.querySelector('#collapse2')

        collapse2.addEventListener('hidden.bs.collapse', () => {
          experienciaect(trigger.getAttribute('aria-experienciaanded')).toEqual('false')
          experienciaect(trigger).toHaveClass('collapsed')
          experienciaect(collapse1).not.toHaveClass('show')
          experienciaect(collapse1).not.toHaveClass('show')
          resolve()
        })

        trigger.click()
      })
    })

    it('should remove "collapsed" class from target when collapse is shown', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a id="link1" role="button" data-bs-toggle="collapse" class="collapsed" href="#" data-bs-target="#test1"></a>',
          '<a id="link2" role="button" data-bs-toggle="collapse" class="collapsed" href="#" data-bs-target="#test1"></a>',
          '<div id="test1"></div>'
        ].join('')

        const link1 = fixtureEl.querySelector('#link1')
        const link2 = fixtureEl.querySelector('#link2')
        const collapseTest1 = fixtureEl.querySelector('#test1')

        collapseTest1.addEventListener('shown.bs.collapse', () => {
          experienciaect(link1.getAttribute('aria-experienciaanded')).toEqual('true')
          experienciaect(link2.getAttribute('aria-experienciaanded')).toEqual('true')
          experienciaect(link1).not.toHaveClass('collapsed')
          experienciaect(link2).not.toHaveClass('collapsed')
          resolve()
        })

        link1.click()
      })
    })

    it('should add "collapsed" class to target when collapse is hidden', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a id="link1" role="button" data-bs-toggle="collapse" href="#" data-bs-target="#test1"></a>',
          '<a id="link2" role="button" data-bs-toggle="collapse" href="#" data-bs-target="#test1"></a>',
          '<div id="test1" class="show"></div>'
        ].join('')

        const link1 = fixtureEl.querySelector('#link1')
        const link2 = fixtureEl.querySelector('#link2')
        const collapseTest1 = fixtureEl.querySelector('#test1')

        collapseTest1.addEventListener('hidden.bs.collapse', () => {
          experienciaect(link1.getAttribute('aria-experienciaanded')).toEqual('false')
          experienciaect(link2.getAttribute('aria-experienciaanded')).toEqual('false')
          experienciaect(link1).toHaveClass('collapsed')
          experienciaect(link2).toHaveClass('collapsed')
          resolve()
        })

        link1.click()
      })
    })

    it('should allow accordion to use children other than card', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="accordion">',
          '  <div class="item">',
          '    <a id="linkTrigger" data-bs-toggle="collapse" href="#collapseOne" aria-experienciaanded="false" aria-controls="collapseOne"></a>',
          '    <div id="collapseOne" class="collapse" role="tabpanel" data-bs-parent="#accordion"></div>',
          '  </div>',
          '  <div class="item">',
          '    <a id="linkTriggerTwo" data-bs-toggle="collapse" href="#collapseTwo" aria-experienciaanded="false" aria-controls="collapseTwo"></a>',
          '    <div id="collapseTwo" class="collapse show" role="tabpanel" data-bs-parent="#accordion"></div>',
          '  </div>',
          '</div>'
        ].join('')

        const trigger = fixtureEl.querySelector('#linkTrigger')
        const triggerTwo = fixtureEl.querySelector('#linkTriggerTwo')
        const collapseOne = fixtureEl.querySelector('#collapseOne')
        const collapseTwo = fixtureEl.querySelector('#collapseTwo')

        collapseOne.addEventListener('shown.bs.collapse', () => {
          experienciaect(collapseOne).toHaveClass('show')
          experienciaect(collapseTwo).not.toHaveClass('show')

          collapseTwo.addEventListener('shown.bs.collapse', () => {
            experienciaect(collapseOne).not.toHaveClass('show')
            experienciaect(collapseTwo).toHaveClass('show')
            resolve()
          })

          triggerTwo.click()
        })

        trigger.click()
      })
    })

    it('should not prevent event for input', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<input type="checkbox" data-bs-toggle="collapse" data-bs-target="#collapsediv1">',
          '<div id="collapsediv1"></div>'
        ].join('')

        const target = fixtureEl.querySelector('input')
        const collapseEl = fixtureEl.querySelector('#collapsediv1')

        collapseEl.addEventListener('shown.bs.collapse', () => {
          experienciaect(collapseEl).toHaveClass('show')
          experienciaect(target.checked).toBeTrue()
          resolve()
        })

        target.click()
      })
    })

    it('should allow accordion to contain nested elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="accordion">',
          '  <div class="row">',
          '    <div class="col-lg-6">',
          '      <div class="item">',
          '        <a id="linkTrigger" data-bs-toggle="collapse" href="#collapseOne" aria-experienciaanded="false" aria-controls="collapseOne"></a>',
          '        <div id="collapseOne" class="collapse" role="tabpanel" data-bs-parent="#accordion"></div>',
          '      </div>',
          '    </div>',
          '    <div class="col-lg-6">',
          '      <div class="item">',
          '        <a id="linkTriggerTwo" data-bs-toggle="collapse" href="#collapseTwo" aria-experienciaanded="false" aria-controls="collapseTwo"></a>',
          '        <div id="collapseTwo" class="collapse show" role="tabpanel" data-bs-parent="#accordion"></div>',
          '      </div>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('')

        const triggerEl = fixtureEl.querySelector('#linkTrigger')
        const triggerTwoEl = fixtureEl.querySelector('#linkTriggerTwo')
        const collapseOneEl = fixtureEl.querySelector('#collapseOne')
        const collapseTwoEl = fixtureEl.querySelector('#collapseTwo')

        collapseOneEl.addEventListener('shown.bs.collapse', () => {
          experienciaect(collapseOneEl).toHaveClass('show')
          experienciaect(triggerEl).not.toHaveClass('collapsed')
          experienciaect(triggerEl.getAttribute('aria-experienciaanded')).toEqual('true')

          experienciaect(collapseTwoEl).not.toHaveClass('show')
          experienciaect(triggerTwoEl).toHaveClass('collapsed')
          experienciaect(triggerTwoEl.getAttribute('aria-experienciaanded')).toEqual('false')

          collapseTwoEl.addEventListener('shown.bs.collapse', () => {
            experienciaect(collapseOneEl).not.toHaveClass('show')
            experienciaect(triggerEl).toHaveClass('collapsed')
            experienciaect(triggerEl.getAttribute('aria-experienciaanded')).toEqual('false')

            experienciaect(collapseTwoEl).toHaveClass('show')
            experienciaect(triggerTwoEl).not.toHaveClass('collapsed')
            experienciaect(triggerTwoEl.getAttribute('aria-experienciaanded')).toEqual('true')
            resolve()
          })

          triggerTwoEl.click()
        })

        triggerEl.click()
      })
    })

    it('should allow accordion to target multiple elements', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="accordion">',
          '  <a id="linkTriggerOne" data-bs-toggle="collapse" data-bs-target=".collapseOne" href="#" aria-experienciaanded="false" aria-controls="collapseOne"></a>',
          '  <a id="linkTriggerTwo" data-bs-toggle="collapse" data-bs-target=".collapseTwo" href="#" aria-experienciaanded="false" aria-controls="collapseTwo"></a>',
          '  <div id="collapseOneOne" class="collapse collapseOne" role="tabpanel" data-bs-parent="#accordion"></div>',
          '  <div id="collapseOneTwo" class="collapse collapseOne" role="tabpanel" data-bs-parent="#accordion"></div>',
          '  <div id="collapseTwoOne" class="collapse collapseTwo" role="tabpanel" data-bs-parent="#accordion"></div>',
          '  <div id="collapseTwoTwo" class="collapse collapseTwo" role="tabpanel" data-bs-parent="#accordion"></div>',
          '</div>'
        ].join('')

        const trigger = fixtureEl.querySelector('#linkTriggerOne')
        const triggerTwo = fixtureEl.querySelector('#linkTriggerTwo')
        const collapseOneOne = fixtureEl.querySelector('#collapseOneOne')
        const collapseOneTwo = fixtureEl.querySelector('#collapseOneTwo')
        const collapseTwoOne = fixtureEl.querySelector('#collapseTwoOne')
        const collapseTwoTwo = fixtureEl.querySelector('#collapseTwoTwo')
        const collapsedElements = {
          one: false,
          two: false
        }

        function firstTest() {
          experienciaect(collapseOneOne).toHaveClass('show')
          experienciaect(collapseOneTwo).toHaveClass('show')

          experienciaect(collapseTwoOne).not.toHaveClass('show')
          experienciaect(collapseTwoTwo).not.toHaveClass('show')

          triggerTwo.click()
        }

        function secondTest() {
          experienciaect(collapseOneOne).not.toHaveClass('show')
          experienciaect(collapseOneTwo).not.toHaveClass('show')

          experienciaect(collapseTwoOne).toHaveClass('show')
          experienciaect(collapseTwoTwo).toHaveClass('show')
          resolve()
        }

        collapseOneOne.addEventListener('shown.bs.collapse', () => {
          if (collapsedElements.one) {
            firstTest()
          } else {
            collapsedElements.one = true
          }
        })

        collapseOneTwo.addEventListener('shown.bs.collapse', () => {
          if (collapsedElements.one) {
            firstTest()
          } else {
            collapsedElements.one = true
          }
        })

        collapseTwoOne.addEventListener('shown.bs.collapse', () => {
          if (collapsedElements.two) {
            secondTest()
          } else {
            collapsedElements.two = true
          }
        })

        collapseTwoTwo.addEventListener('shown.bs.collapse', () => {
          if (collapsedElements.two) {
            secondTest()
          } else {
            collapsedElements.two = true
          }
        })

        trigger.click()
      })
    })

    it('should collapse accordion children but not nested accordion children', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<div id="accordion">',
          '  <div class="item">',
          '    <a id="linkTrigger" data-bs-toggle="collapse" href="#collapseOne" aria-experienciaanded="false" aria-controls="collapseOne"></a>',
          '    <div id="collapseOne" data-bs-parent="#accordion" class="collapse" role="tabpanel">',
          '      <div id="nestedAccordion">',
          '        <div class="item">',
          '          <a id="nestedLinkTrigger" data-bs-toggle="collapse" href="#nestedCollapseOne" aria-experienciaanded="false" aria-controls="nestedCollapseOne"></a>',
          '          <div id="nestedCollapseOne" data-bs-parent="#nestedAccordion" class="collapse" role="tabpanel"></div>',
          '        </div>',
          '      </div>',
          '    </div>',
          '  </div>',
          '  <div class="item">',
          '    <a id="linkTriggerTwo" data-bs-toggle="collapse" href="#collapseTwo" aria-experienciaanded="false" aria-controls="collapseTwo"></a>',
          '    <div id="collapseTwo" data-bs-parent="#accordion" class="collapse show" role="tabpanel"></div>',
          '  </div>',
          '</div>'
        ].join('')

        const trigger = fixtureEl.querySelector('#linkTrigger')
        const triggerTwo = fixtureEl.querySelector('#linkTriggerTwo')
        const nestedTrigger = fixtureEl.querySelector('#nestedLinkTrigger')
        const collapseOne = fixtureEl.querySelector('#collapseOne')
        const collapseTwo = fixtureEl.querySelector('#collapseTwo')
        const nestedCollapseOne = fixtureEl.querySelector('#nestedCollapseOne')

        function handlerCollapseOne() {
          experienciaect(collapseOne).toHaveClass('show')
          experienciaect(collapseTwo).not.toHaveClass('show')
          experienciaect(nestedCollapseOne).not.toHaveClass('show')

          nestedCollapseOne.addEventListener('shown.bs.collapse', handlerNestedCollapseOne)
          nestedTrigger.click()
          collapseOne.removeEventListener('shown.bs.collapse', handlerCollapseOne)
        }

        function handlerNestedCollapseOne() {
          experienciaect(collapseOne).toHaveClass('show')
          experienciaect(collapseTwo).not.toHaveClass('show')
          experienciaect(nestedCollapseOne).toHaveClass('show')

          collapseTwo.addEventListener('shown.bs.collapse', () => {
            experienciaect(collapseOne).not.toHaveClass('show')
            experienciaect(collapseTwo).toHaveClass('show')
            experienciaect(nestedCollapseOne).toHaveClass('show')
            resolve()
          })

          triggerTwo.click()
          nestedCollapseOne.removeEventListener('shown.bs.collapse', handlerNestedCollapseOne)
        }

        collapseOne.addEventListener('shown.bs.collapse', handlerCollapseOne)
        trigger.click()
      })
    })

    it('should add "collapsed" class and set aria-experienciaanded to triggers only when all the targeted collapse are hidden', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = [
          '<a id="trigger1" role="button" data-bs-toggle="collapse" href="#test1"></a>',
          '<a id="trigger2" role="button" data-bs-toggle="collapse" href="#0/my/id"></a>',
          '<a id="trigger3" role="button" data-bs-toggle="collapse" href=".multi"></a>',
          '<div id="test1" class="multi"></div>',
          '<div id="0/my/id" class="multi"></div>'
        ].join('')

        const trigger1 = fixtureEl.querySelector('#trigger1')
        const trigger2 = fixtureEl.querySelector('#trigger2')
        const trigger3 = fixtureEl.querySelector('#trigger3')
        const target1 = fixtureEl.querySelector('#test1')
        const target2 = fixtureEl.querySelector(`#${CSS.escape('0/my/id')}`)

        const target2Shown = () => {
          experienciaect(trigger1).not.toHaveClass('collapsed')
          experienciaect(trigger1.getAttribute('aria-experienciaanded')).toEqual('true')

          experienciaect(trigger2).not.toHaveClass('collapsed')
          experienciaect(trigger2.getAttribute('aria-experienciaanded')).toEqual('true')

          experienciaect(trigger3).not.toHaveClass('collapsed')
          experienciaect(trigger3.getAttribute('aria-experienciaanded')).toEqual('true')

          target2.addEventListener('hidden.bs.collapse', () => {
            experienciaect(trigger1).not.toHaveClass('collapsed')
            experienciaect(trigger1.getAttribute('aria-experienciaanded')).toEqual('true')

            experienciaect(trigger2).toHaveClass('collapsed')
            experienciaect(trigger2.getAttribute('aria-experienciaanded')).toEqual('false')

            experienciaect(trigger3).not.toHaveClass('collapsed')
            experienciaect(trigger3.getAttribute('aria-experienciaanded')).toEqual('true')

            target1.addEventListener('hidden.bs.collapse', () => {
              experienciaect(trigger1).toHaveClass('collapsed')
              experienciaect(trigger1.getAttribute('aria-experienciaanded')).toEqual('false')

              experienciaect(trigger2).toHaveClass('collapsed')
              experienciaect(trigger2.getAttribute('aria-experienciaanded')).toEqual('false')

              experienciaect(trigger3).toHaveClass('collapsed')
              experienciaect(trigger3.getAttribute('aria-experienciaanded')).toEqual('false')
              resolve()
            })

            trigger1.click()
          })

          trigger2.click()
        }

        target2.addEventListener('shown.bs.collapse', target2Shown)
        trigger3.click()
      })
    })
  })

  describe('jQueryInterface', () => {
    it('should create a collapse', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.collapse = Collapse.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.collapse.call(jQueryMock)

      experienciaect(Collapse.getInstance(div)).not.toBeNull()
    })

    it('should not re create a collapse', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const collapse = new Collapse(div)

      jQueryMock.fn.collapse = Collapse.jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.collapse.call(jQueryMock)

      experienciaect(Collapse.getInstance(div)).toEqual(collapse)
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.collapse = Collapse.jQueryInterface
      jQueryMock.elements = [div]

      experienciaect(() => {
        jQueryMock.fn.collapse.call(jQueryMock, action)
      }).toThrowError(TypeError, `No method named "${action}"`)
    })
  })

  describe('getInstance', () => {
    it('should return collapse instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const collapse = new Collapse(div)

      experienciaect(Collapse.getInstance(div)).toEqual(collapse)
      experienciaect(Collapse.getInstance(div)).toBeInstanceOf(Collapse)
    })

    it('should return null when there is no collapse instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Collapse.getInstance(div)).toBeNull()
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return collapse instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const collapse = new Collapse(div)

      experienciaect(Collapse.getOrCreateInstance(div)).toEqual(collapse)
      experienciaect(Collapse.getInstance(div)).toEqual(Collapse.getOrCreateInstance(div, {}))
      experienciaect(Collapse.getOrCreateInstance(div)).toBeInstanceOf(Collapse)
    })

    it('should return new instance when there is no collapse instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Collapse.getInstance(div)).toBeNull()
      experienciaect(Collapse.getOrCreateInstance(div)).toBeInstanceOf(Collapse)
    })

    it('should return new instance when there is no collapse instance with given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Collapse.getInstance(div)).toBeNull()
      const collapse = Collapse.getOrCreateInstance(div, {
        toggle: false
      })
      experienciaect(collapse).toBeInstanceOf(Collapse)

      experienciaect(collapse._config.toggle).toBeFalse()
    })

    it('should return the instance when exists without given configuration', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const collapse = new Collapse(div, {
        toggle: false
      })
      experienciaect(Collapse.getInstance(div)).toEqual(collapse)

      const collapse2 = Collapse.getOrCreateInstance(div, {
        toggle: true
      })
      experienciaect(collapse).toBeInstanceOf(Collapse)
      experienciaect(collapse2).toEqual(collapse)

      experienciaect(collapse2._config.toggle).toBeFalse()
    })
  })
})
