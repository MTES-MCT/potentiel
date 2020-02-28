import { makeUser, User } from '../entities'

export type UserRepo = {
  findById: ({ id: string }) => Promise<User>
  insert: (user: User) => Promise<void>
}

interface MakeUserRepoProps {
  isDbReady: Promise<void>
  userDb: any
}

export default function makeUserRepo({
  isDbReady,
  userDb
}: MakeUserRepoProps): UserRepo {
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

    await userDb.create(user)
  }
}
