export class WrongSubscriberNameError extends Error {
  constructor() {
    super('Subscriber name must be in lower_snake_case');
  }
}
