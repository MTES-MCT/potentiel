import { v4 as uuid } from 'uuid'

export default function makeFakeProjectStep(overrides?) {
  return {
    id: uuid(),
    type: 'garantie-financiere',
    projectId: uuid(),
    stepDate: new Date(123),
    fileId: uuid(),
    submittedOn: new Date(123),
    submittedBy: uuid(),
    createdAt: new Date(123),
    ...overrides,
  }
}
