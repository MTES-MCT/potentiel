import { v4 as uuid } from 'uuid'

export default function makeFakeFile(overrides?) {
  const defaultObj = {
    id: uuid(),
    filename: 'filename.txt',
    forProject: null,
    createdBy: null,
    designation: 'other',
    storedAt: null,
  }

  return {
    ...defaultObj,
    ...overrides,
  }
}
