import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getUserById } from './getUserById'

const { User } = models
describe('Requête Sequelize getUserById', () => {
  const userId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await User.bulkCreate([
      {
        id: userId,
        fullName: 'John Doe',
        email: 'test@test.test',
        role: 'porteur-projet',
        registeredOn: new Date(123),
        fonction: 'utilisateur test',
      },
    ])
  })

  describe(`Lorsque l'identifiant de l'utilisateur est null`, () => {
    it(`Alors la requête doit retourner 'null'`, async () => {
      const res = await getUserById(null)
      expect(res._unsafeUnwrap()).toBeNull()
    })
  })

  describe(`Lorsque l'utilisateur n'existe pas`, () => {
    it(`Alors la requête retourne 'null'`, async () => {
      const res = await getUserById(new UniqueEntityID().toString())
      expect(res._unsafeUnwrap()).toBeNull()
    })
  })

  describe(`Lorsque l'utilisateur existe`, () => {
    it(`Alors il doit être retourné`, async () => {
      const res = await getUserById(userId)

      expect(res._unsafeUnwrap()).toMatchObject({
        id: userId,
        fullName: 'John Doe',
        email: 'test@test.test',
        role: 'porteur-projet',
        fonction: 'utilisateur test',
      })
    })
  })
})
