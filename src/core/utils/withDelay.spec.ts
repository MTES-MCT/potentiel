import { err, ok, errAsync, okAsync } from './Result'
import { withDelay } from './withDelay'

const delayInMs = 100
describe('withDelay', () => {
  it('should execute the callback after delayInMs', async () => {
    const callback = jest.fn(() => ok(123))

    jest.useFakeTimers()
    withDelay(delayInMs, callback)
    expect(callback).not.toHaveBeenCalled()

    jest.advanceTimersByTime(delayInMs)

    expect(callback).toHaveBeenCalled()
  })

  describe('when given a callback that returns an ok Result', () => {
    const callback = jest.fn(() => ok<number, string>(123))

    it('should return an okAsync Result with the callback value', async () => {
      jest.useFakeTimers()
      const res = withDelay(delayInMs, callback)
      jest.runAllTimers()
      expect((await res)._unsafeUnwrap()).toEqual(123)
    })
  })

  describe('when given a callback that returns an err Result', () => {
    const callback = jest.fn(() => err<number, string>('non'))

    it('should return an errAsync Result with the callback error', async () => {
      jest.useFakeTimers()
      const res = withDelay(delayInMs, callback)
      jest.runAllTimers()
      expect((await res)._unsafeUnwrapErr()).toEqual('non')
    })
  })

  describe('when given a callback that returns an okAsync Result', () => {
    const callback = jest.fn(() => okAsync<number, string>(123))

    it('should return an okAsync Result with the callback value', async () => {
      jest.useFakeTimers()
      const res = withDelay(delayInMs, callback)
      jest.runAllTimers()
      expect((await res)._unsafeUnwrap()).toEqual(123)
    })
  })

  describe('when given a callback that returns an errAsync Result', () => {
    const callback = jest.fn(() => errAsync<number, string>('non'))

    it('should return an errAsync Result with the callback error', async () => {
      jest.useFakeTimers()
      const res = withDelay(delayInMs, callback)
      jest.runAllTimers()
      expect((await res)._unsafeUnwrapErr()).toEqual('non')
    })
  })
})
