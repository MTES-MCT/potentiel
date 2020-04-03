import { AppelOffre } from '../entities'
import { ResultAsync, OptionAsync } from '../types'

export type AppelOffreRepo = {
  findAll: () => Promise<Array<AppelOffre>>
  findById: (id: AppelOffre['id']) => Promise<AppelOffre | undefined>
}
