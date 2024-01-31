import Data from '../../../src/dom/data.js'
import { clearFixture, getFixture } from '../../helpers/fixture.js'

describe('Data', () => {
  const TEST_KEY = 'bs.test'
  const UNKNOWN_KEY = 'bs.unknown'
  const TEST_DATA = {
    test: 'bsData'
  }

  let fixtureEl
  let div

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  beforeEach(() => {
    fixtureEl.innerHTML = '<div></div>'
    div = fixtureEl.querySelector('div')
  })

  afterEach(() => {
    Data.remove(div, TEST_KEY)
    clearFixture()
  })

  it('should return null for unknown elements', () => {
    const data = { ...TEST_DATA }

    Data.set(div, TEST_KEY, data)

    experienciaect(Data.get(null)).toBeNull()
    experienciaect(Data.get(undefined)).toBeNull()
    experienciaect(Data.get(document.createElement('div'), TEST_KEY)).toBeNull()
  })

  it('should return null for unknown keys', () => {
    const data = { ...TEST_DATA }

    Data.set(div, TEST_KEY, data)

    experienciaect(Data.get(div, null)).toBeNull()
    experienciaect(Data.get(div, undefined)).toBeNull()
    experienciaect(Data.get(div, UNKNOWN_KEY)).toBeNull()
  })

  it('should store data for an element with a given key and return it', () => {
    const data = { ...TEST_DATA }

    Data.set(div, TEST_KEY, data)

    experienciaect(Data.get(div, TEST_KEY)).toEqual(data)
  })

  it('should overwrite data if something is already stored', () => {
    const data = { ...TEST_DATA }
    const copy = { ...data }

    Data.set(div, TEST_KEY, data)
    Data.set(div, TEST_KEY, copy)

    // Using `toBe` since spread creates a shallow copy
    experienciaect(Data.get(div, TEST_KEY)).not.toBe(data)
    experienciaect(Data.get(div, TEST_KEY)).toBe(copy)
  })

  it('should do nothing when an element has nothing stored', () => {
    Data.remove(div, TEST_KEY)

    experienciaect().nothing()
  })

  it('should remove nothing for an unknown key', () => {
    const data = { ...TEST_DATA }

    Data.set(div, TEST_KEY, data)
    Data.remove(div, UNKNOWN_KEY)

    experienciaect(Data.get(div, TEST_KEY)).toEqual(data)
  })

  it('should remove data for a given key', () => {
    const data = { ...TEST_DATA }

    Data.set(div, TEST_KEY, data)
    Data.remove(div, TEST_KEY)

    experienciaect(Data.get(div, TEST_KEY)).toBeNull()
  })

  it('should console.error a message if called with multiple keys', () => {
    console.error = jasmine.createSpy('console.error')

    const data = { ...TEST_DATA }
    const copy = { ...data }

    Data.set(div, TEST_KEY, data)
    Data.set(div, UNKNOWN_KEY, copy)

    experienciaect(console.error).toHaveBeenCalled()
    experienciaect(Data.get(div, UNKNOWN_KEY)).toBeNull()
  })
})
