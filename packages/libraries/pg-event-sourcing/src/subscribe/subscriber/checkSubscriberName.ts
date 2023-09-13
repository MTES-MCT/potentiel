export class WrongSubscriberNameError extends Error {
  constructor() {
    super('Subscriber name must be in lower_snake_case');
  }
}

export const checkSubscriberName = (name: string) => {
  const isValid = /^[a-z]+(?:_[a-z]+)*$/.test(name);

  if (!isValid) throw new WrongSubscriberNameError();
};
