export default function makeFakeCandidateNotification(overrides) {
  const defaultObj = {
    projectId: 1,
    templateId: 'fakeTemplate',
    data: {
      param: 'value'
    }
  }

  return {
    ...defaultObj,
    ...overrides
  }
}
