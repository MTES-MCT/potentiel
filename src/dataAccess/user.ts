import { makeUser, User } from '../entities'

export default function makeUserAccess({
  isDbReady,
  userDb
}: {
  isDbReady: Promise<void>
  userDb: any
}) {
  return Object.freeze({
    findById,
    insert
  })

  async function findById({ id: _id }): Promise<User> {
    await isDbReady

    const user = await userDb.findOne({
      where: { id: _id }
    })

    return user ? makeUser(user) : null
  }

  async function insert(user: User) {
    await isDbReady

    return await userDb.create(user)
  }
}
