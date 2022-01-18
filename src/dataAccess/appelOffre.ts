import { AppelOffre } from '@entities'

export type AppelOffreRepo = {
  findAll: () => Promise<Array<AppelOffre>>
  findById: (id: AppelOffre['id']) => Promise<AppelOffre | undefined>
}
