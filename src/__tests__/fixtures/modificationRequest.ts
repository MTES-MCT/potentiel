import makeFakeUser from './user'
import makeFakeProject from './project'

export default function makeFakeModificationRequest(
  overrides?,
  includeInfo?: boolean
) {
  const defaultObj: any = {
    id: '1',
    userId: 'userId',
    projectId: 'projectId',
    type: 'actionnaire',
    actionnaire: 'nouvel actionnaire',
    filePath: '/projectId/fichier.pdf'
  }

  if (includeInfo) {
    defaultObj.user = makeFakeUser()
    defaultObj.project = makeFakeProject()
  }

  return {
    ...defaultObj,
    ...overrides
  }
}
