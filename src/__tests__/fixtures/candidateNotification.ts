export default function makeFakeCandidateNotification(overrides?) {
  const defaultObj = {
    projectId: '1',
    template: 'laureat',
    projectAdmissionKey: 'this-is-a-fake-key',
    data: {
      param: 'value'
    }
  }

  return {
    ...defaultObj,
    ...overrides
  }
}
