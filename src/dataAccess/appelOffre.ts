import { AppelOffre } from '@entities'
import { GetPeriodeTitle, GetFamille } from '@modules/appelOffre'

export type AppelOffreRepo = {
  findAll: () => Promise<AppelOffre[]>
  findById: (id: AppelOffre['id']) => Promise<AppelOffre | undefined>
  getFamille: GetFamille
  getPeriodeTitle: GetPeriodeTitle
}
