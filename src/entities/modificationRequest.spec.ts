import { makeModificationRequest } from './'

describe('ModificationRequest entity', () => {
  it("should accept an 'actionnaire' request with actionnaire and filename", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'actionnaire',
      actionnaire: 'nouvel actionnaire',
      fileId: 'filename',
    } as any)

    expect(modificationRequestResult.is_ok()).toBeTruthy()
  })

  it("should refuse a 'actionnaire' request that is missing filename", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'actionnaire',
      actionnaire: 'nouvel actionnaire',
    } as any)

    expect(modificationRequestResult.is_err()).toBeTruthy()
  })

  it("should refuse a 'actionnaire' request that is missing actionnaire", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'actionnaire',
      fileId: 'filename',
    } as any)

    expect(modificationRequestResult.is_err()).toBeTruthy()
  })

  it("should accept an 'producteur' request with producteur and filename", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'producteur',
      producteur: 'nouveau producteur',
      fileId: 'filename',
    } as any)

    expect(modificationRequestResult.is_ok()).toBeTruthy()
  })

  it("should refuse a 'producteur' request that is missing filename", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'producteur',
      producteur: 'nouvel producteur',
    } as any)

    expect(modificationRequestResult.is_err()).toBeTruthy()
  })

  it("should refuse a 'producteur' request that is missing producteur", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'producteur',
      fileId: 'filename',
    } as any)

    expect(modificationRequestResult.is_err()).toBeTruthy()
  })

  it("should accept an 'fournisseur' request with fournisseur, evaluationCarbone, justification and filename", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'fournisseur',
      fournisseur: 'nouveau fournisseur',
      fileId: 'filename',
      evaluationCarbone: 10,
      justification: 'because',
    } as any)

    expect(modificationRequestResult.is_ok()).toBeTruthy()
  })

  it("should refuse a 'fournisseur' request that is missing filename", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'fournisseur',
      fournisseur: 'nouvel fournisseur',
      evaluationCarbone: 10,
      justification: 'because',
    } as any)

    expect(modificationRequestResult.is_err()).toBeTruthy()
  })

  it("should refuse a 'fournisseur' request that is missing fournisseur", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'fournisseur',
      fileId: 'filename',
      evaluationCarbone: 10,
      justification: 'because',
    } as any)

    expect(modificationRequestResult.is_err()).toBeTruthy()
  })

  it("should refuse a 'fournisseur' request that is missing evaluationCarbone", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'fournisseur',
      fournisseur: 'nouvel fournisseur',
      fileId: 'filename',
      justification: 'because',
    } as any)

    expect(modificationRequestResult.is_err()).toBeTruthy()
  })

  it("should refuse a 'fournisseur' request that is missing justification", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'fournisseur',
      fournisseur: 'nouvel fournisseur',
      fileId: 'filename',
      evaluationCarbone: 10,
    } as any)

    expect(modificationRequestResult.is_err()).toBeTruthy()
  })

  it("should accept an 'delai' request with justification and delayInMonths", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'delai',
      justification: 'because',
      delayInMonths: 2,
    } as any)

    expect(modificationRequestResult.is_ok()).toBeTruthy()
  })

  it("should set the status to 'envoyée' by default", () => {
    const modificationRequestResult = makeModificationRequest({
      userId: '1',
      projectId: '1',
      type: 'abandon',
      justification: 'miaou',
    } as any)

    expect(modificationRequestResult.is_ok()).toBeTruthy()

    const modificationRequest = modificationRequestResult.unwrap()
    expect(modificationRequest.status).toEqual('envoyée')
  })
})
