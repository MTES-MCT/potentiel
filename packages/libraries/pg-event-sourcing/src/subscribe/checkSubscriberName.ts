import { WrongSubscriberNameError } from './errors/wrongSubscriberName.error';

export const checkSubscriberName = (name: string) => {
  const isValid = /^[a-z]+(?:_[a-z]+)*$/.test(name);

  if (!isValid) throw new WrongSubscriberNameError();
};
