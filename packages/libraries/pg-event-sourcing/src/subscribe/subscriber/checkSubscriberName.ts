export class WrongSubscriberNameError extends Error {
  constructor() {
    super('Subscriber name must be in kebab-case');
  }
}

export const checkSubscriberName = (name: string) => {
  const isValid = /^[a-z]+(?:-[a-z]+)*$/.test(name);

  if (!isValid) throw new WrongSubscriberNameError();
};
