import { makeModificationRequest } from './'

describe('ModificationRequest entity', () => {
  it("should accept an 'actionnaire' request with actionnaire and filePath", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'actionnaire',
      actionnaire: 'nouvel actionnaire',
      filePath: 'filePath'
    } as any)

    expect(modificationRequestResult.is_ok()).toBeTruthy()
  })

  it("should refuse a 'actionnaire' request that is missing filePath", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'actionnaire',
      actionnaire: 'nouvel actionnaire'
      // filePath: 'filePath'
    } as any)

    expect(modificationRequestResult.is_err()).toBeTruthy()
  })

  it("should refuse a 'actionnaire' request that is missing actionnaire", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'actionnaire',
      // actionnaire: 'nouvel actionnaire'
      filePath: 'filePath'
    } as any)

    expect(modificationRequestResult.is_err()).toBeTruthy()
  })
})
