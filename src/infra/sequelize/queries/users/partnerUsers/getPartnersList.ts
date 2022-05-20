import { userRepo } from '@dataAccess'

export const getPartnersList = async () => {
  return await userRepo.findAll({ role: ['acheteur-obligé', 'ademe'] })
}
