import { validateUniqueId } from './validateUniqueId'

describe('validateUniqueId', () => {
  it('should return true with a valid uuid v4', () => {
    expect(validateUniqueId('a99a00b8-66ff-42e5-95fb-3c026449e19c')).toBe(true)
  })

  it('should return false with a shorter string', () => {
    expect(validateUniqueId('a99a00b8-66ff-42e5-95fb-3c026449e19')).toBe(false)
  })

  it('should return false with a longer string', () => {
    expect(validateUniqueId('a99a00b8-66ff-42e5-95fb-3c026449e19cc')).toBe(false)
  })

  it('should return false with two uuids', () => {
    expect(
      validateUniqueId('a99a00b8-66ff-42e5-95fb-3c026449e19c,a99a00b8-66ff-42e5-95fb-3c026449e19c')
    ).toBe(false)
  })

  it('should return false with undefined', () => {
    // @ts-ignore
    expect(validateUniqueId(undefined)).toBe(false)
  })

  it('should return false with an empty string', () => {
    expect(validateUniqueId('')).toBe(false)
  })
})
