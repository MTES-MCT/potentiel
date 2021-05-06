import makeFakeUser from './user'
import makeFakeProject from './project'
import { UniqueEntityID } from '../../core/domain'

export default function makeFakeModificationRequest(overrides?, includeInfo?: boolean) {
  const defaultObj: any = {
    id: '1',
    userId: new UniqueEntityID().toString(),
    projectId: new UniqueEntityID().toString(),
    type: 'recours',
    actionnaire: 'nouvel actionnaire',
  }

  if (includeInfo) {
    defaultObj.user = makeFakeUser()
    defaultObj.project = makeFakeProject()
  }

  return {
    ...defaultObj,
    ...overrides,
  }
}
