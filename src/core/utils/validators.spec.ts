import {
  makePropertyValidator,
  isNumber,
  isPositiveNumber,
  isStrictlyPositiveNumber,
  isDefined,
} from './validators'

describe('validators', () => {
  describe('isDefined()', () => {
    it('should throw when argument is undefined', () => {
      expect(() => isDefined(undefined)).toThrow()
      expect(() => isDefined(1)).not.toThrow()
      expect(() => isDefined(true)).not.toThrow()
      expect(() => isDefined(false)).not.toThrow()
      expect(() => isDefined(null)).not.toThrow()
      expect(() => isDefined({ a: '' })).not.toThrow()
      expect(() => isDefined([1])).not.toThrow()
    })
  })

  describe('isNumber()', () => {
    it('should throw when argument is not a number', () => {
      expect(() => isNumber(123)).not.toThrow()
      expect(() => isNumber('')).toThrow()
      expect(() => isNumber(Infinity)).toThrow()
      expect(() => isNumber(true)).toThrow()
      expect(() => isNumber(false)).toThrow()
      expect(() => isNumber(undefined)).toThrow()
      expect(() => isNumber(null)).toThrow()
      expect(() => isNumber({ a: '' })).toThrow()
      expect(() => isNumber([1])).toThrow()
      expect(() => isNumber(Number('test'))).toThrow() // NaN
    })
  })

  describe('isPositiveNumber()', () => {
    it('should throw when argument is not a number', () => {
      expect(() => isPositiveNumber(1)).not.toThrow()
      expect(() => isPositiveNumber('')).toThrow()
      expect(() => isPositiveNumber(Infinity)).toThrow()
      expect(() => isPositiveNumber(true)).toThrow()
      expect(() => isPositiveNumber(false)).toThrow()
      expect(() => isPositiveNumber(undefined)).toThrow()
      expect(() => isPositiveNumber(null)).toThrow()
      expect(() => isPositiveNumber({ a: '' })).toThrow()
      expect(() => isPositiveNumber([1])).toThrow()
      expect(() => isPositiveNumber(Number('test'))).toThrow() // NaN
    })

    it('should throw when argument is negative', () => {
      expect(() => isPositiveNumber(1)).not.toThrow()
      expect(() => isPositiveNumber(0)).not.toThrow()
      expect(() => isPositiveNumber(-1)).toThrow()
    })
  })

  describe('isStrictlyPositiveNumber()', () => {
    it('should throw when argument is not a number', () => {
      expect(() => isStrictlyPositiveNumber('')).toThrow()
      expect(() => isStrictlyPositiveNumber(Infinity)).toThrow()
      expect(() => isStrictlyPositiveNumber(true)).toThrow()
      expect(() => isStrictlyPositiveNumber(false)).toThrow()
      expect(() => isStrictlyPositiveNumber(undefined)).toThrow()
      expect(() => isStrictlyPositiveNumber(null)).toThrow()
      expect(() => isStrictlyPositiveNumber({ a: '' })).toThrow()
      expect(() => isStrictlyPositiveNumber([1])).toThrow()
      expect(() => isStrictlyPositiveNumber(Number('test'))).toThrow() // NaN
    })

    it('should throw when argument is negative', () => {
      expect(() => isStrictlyPositiveNumber(1)).not.toThrow()
      expect(() => isStrictlyPositiveNumber(-1)).toThrow()
    })

    it('should throw when argument is 0', () => {
      expect(() => isStrictlyPositiveNumber(0)).toThrow()
    })
  })

  describe('makePropertyValidator(validatorMap)', () => {
    it('should return an object containing each erroneous field and the error message', () => {
      const validator = makePropertyValidator({
        a: isNumber,
        b: isPositiveNumber,
        c: (obj: any) => {
          // custom validator
          if (typeof obj !== 'string') throw new Error('must be string')
        },
      })

      const res = validator({
        a: 1,
        b: -1,
        c: true,
      })

      expect(res).not.toHaveProperty('a')

      expect(res).toHaveProperty('b')
      expect(res.b).toEqual('doit être un nombre positif')

      expect(res).toHaveProperty('c')
      expect(res.c).toEqual('must be string')
    })
  })
})
