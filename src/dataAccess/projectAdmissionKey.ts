import { ProjectAdmissionKey } from '../entities'

export type ProjectAdmissionKeyRepo = {
  findById: ({ id: string }) => Promise<ProjectAdmissionKey | null>
  findAll: (query?) => Promise<Array<ProjectAdmissionKey>>
  insertMany: (
    projectAdmissionKeys: Array<ProjectAdmissionKey>
  ) => Promise<void>
}
