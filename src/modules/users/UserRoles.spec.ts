import { User } from '../../entities'
import { userIs, userIsNot } from './UserRoles'

describe('userIs', () => {
  describe('when given a single role', () => {
    const userIsAdmin = userIs('admin')

    it('should return true when the user has this role', () => {
      expect(userIsAdmin({ role: 'admin' } as User)).toBe(true)
    })

    it('should return false when the user has another role', () => {
      expect(userIsAdmin({ role: 'dreal' } as User)).toBe(false)
    })
  })

  describe('when given an array of roles', () => {
    const userIsAdminOrDreal = userIs(['admin', 'dreal'])

    it('should return true when the user has on of the roles', () => {
      expect(userIsAdminOrDreal({ role: 'admin' } as User)).toBe(true)
      expect(userIsAdminOrDreal({ role: 'dreal' } as User)).toBe(true)
    })

    it('should return false when the user has another role', () => {
      expect(userIsAdminOrDreal({ role: 'porteur-projet' } as User)).toBe(false)
    })
  })
})

describe('userIsNot', () => {
  describe('when given a single role', () => {
    const userIsNotAdmin = userIsNot('admin')

    it('should return false when the user has this role', () => {
      expect(userIsNotAdmin({ role: 'admin' } as User)).toBe(false)
    })

    it('should return true when the user has another role', () => {
      expect(userIsNotAdmin({ role: 'dreal' } as User)).toBe(true)
    })
  })

  describe('when given an array of roles', () => {
    const userIsNeitherAdminNorDreal = userIsNot(['admin', 'dreal'])

    it('should return false when the user has on of the roles', () => {
      expect(userIsNeitherAdminNorDreal({ role: 'admin' } as User)).toBe(false)
      expect(userIsNeitherAdminNorDreal({ role: 'dreal' } as User)).toBe(false)
    })

    it('should return true when the user has another role', () => {
      expect(userIsNeitherAdminNorDreal({ role: 'porteur-projet' } as User)).toBe(true)
    })
  })
})
