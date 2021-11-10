import { isStrictlyPositiveNumber } from "./formValidators"

describe('isStrictlyPositiveNumber', () => {
    it('should return true for a strict positive number with .', () => {
        expect(isStrictlyPositiveNumber(1)).toEqual(true)
    })
    it('should return false for undefined', () => {
        expect(isStrictlyPositiveNumber(undefined)).toEqual(false)
    })
    it('should return true for a strict positive number with ,', () => {
        expect(isStrictlyPositiveNumber('1,6')).toEqual(true)
    })
})