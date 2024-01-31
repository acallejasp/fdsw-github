import Manipulator from '../../../src/dom/manipulator.js'
import { clearFixture, getFixture } from '../../helpers/fixture.js'

describe('Manipulator', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('setDataAttribute', () => {
    it('should set data attribute prefixed with bs', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.setDataAttribute(div, 'key', 'value')
      experienciaect(div.getAttribute('data-bs-key')).toEqual('value')
    })

    it('should set data attribute in kebab case', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.setDataAttribute(div, 'testKey', 'value')
      experienciaect(div.getAttribute('data-bs-test-key')).toEqual('value')
    })
  })

  describe('removeDataAttribute', () => {
    it('should only remove bs-prefixed data attribute', () => {
      fixtureEl.innerHTML = '<div data-bs-key="value" data-key-bs="postfixed" data-key="value"></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.removeDataAttribute(div, 'key')
      experienciaect(div.getAttribute('data-bs-key')).toBeNull()
      experienciaect(div.getAttribute('data-key-bs')).toEqual('postfixed')
      experienciaect(div.getAttribute('data-key')).toEqual('value')
    })

    it('should remove data attribute in kebab case', () => {
      fixtureEl.innerHTML = '<div data-bs-test-key="value"></div>'

      const div = fixtureEl.querySelector('div')

      Manipulator.removeDataAttribute(div, 'testKey')
      experienciaect(div.getAttribute('data-bs-test-key')).toBeNull()
    })
  })

  describe('getDataAttributes', () => {
    it('should return an empty object for null', () => {
      experienciaect(Manipulator.getDataAttributes(null)).toEqual({})
      experienciaect().nothing()
    })

    it('should get only bs-prefixed data attributes without bs namespace', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="tabs" data-bs-target="#element" data-another="value" data-target-bs="#element" data-in-bs-out="in-between"></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Manipulator.getDataAttributes(div)).toEqual({
        toggle: 'tabs',
        target: '#element'
      })
    })

    it('should omit `bs-config` data attribute', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="tabs" data-bs-target="#element" data-bs-config=\'{"testBool":false}\'></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Manipulator.getDataAttributes(div)).toEqual({
        toggle: 'tabs',
        target: '#element'
      })
    })
  })

  describe('getDataAttribute', () => {
    it('should only get bs-prefixed data attribute', () => {
      fixtureEl.innerHTML = '<div data-bs-key="value" data-test-bs="postFixed" data-toggle="tab"></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Manipulator.getDataAttribute(div, 'key')).toEqual('value')
      experienciaect(Manipulator.getDataAttribute(div, 'test')).toBeNull()
      experienciaect(Manipulator.getDataAttribute(div, 'toggle')).toBeNull()
    })

    it('should get data attribute in kebab case', () => {
      fixtureEl.innerHTML = '<div data-bs-test-key="value" ></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Manipulator.getDataAttribute(div, 'testKey')).toEqual('value')
    })

    it('should normalize data', () => {
      fixtureEl.innerHTML = '<div data-bs-test="false" ></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Manipulator.getDataAttribute(div, 'test')).toBeFalse()

      div.setAttribute('data-bs-test', 'true')
      experienciaect(Manipulator.getDataAttribute(div, 'test')).toBeTrue()

      div.setAttribute('data-bs-test', '1')
      experienciaect(Manipulator.getDataAttribute(div, 'test')).toEqual(1)
    })

    it('should normalize json data', () => {
      fixtureEl.innerHTML = '<div data-bs-test=\'{"delay":{"show":100,"hide":10}}\'></div>'

      const div = fixtureEl.querySelector('div')

      experienciaect(Manipulator.getDataAttribute(div, 'test')).toEqual({ delay: { show: 100, hide: 10 } })

      const objectData = { 'Super Hero': ['Iron Man', 'Super Man'], testNum: 90, url: 'http://localhost:8080/test?foo=bar' }
      const dataStr = JSON.stringify(objectData)
      div.setAttribute('data-bs-test', encodeURIComponent(dataStr))
      experienciaect(Manipulator.getDataAttribute(div, 'test')).toEqual(objectData)

      div.setAttribute('data-bs-test', dataStr)
      experienciaect(Manipulator.getDataAttribute(div, 'test')).toEqual(objectData)
    })
  })
})
