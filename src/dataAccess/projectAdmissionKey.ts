import { ProjectAdmissionKey } from '../entities'
import { ResultAsync, OptionAsync } from '../types'

export type ProjectAdmissionKeyRepo = {
  findById: (id: ProjectAdmissionKey['id']) => OptionAsync<ProjectAdmissionKey>
  findAll: (query?: Record<string, any>) => Promise<Array<ProjectAdmissionKey>>
  save: (
    projectAdmissionKey: ProjectAdmissionKey
  ) => ResultAsync<ProjectAdmissionKey>
}
