import { userRepo } from '@dataAccess'

export const getDreals = async () => {
  const drealUsers = await userRepo.findAll({ role: 'dreal' })

  return await Promise.all(
    drealUsers.map(async (user) => {
      const dreals = await userRepo.findDrealsForUser(user.id)
      return { user, dreals }
    })
  )
}
