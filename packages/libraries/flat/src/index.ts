import * as flat from 'flat';

export const flatten = <T, R>(target: T): R =>
  flat.flatten(target, {
    safe: true,
  });

export const unflatten = <T, R>(target: T): R => flat.unflatten(target);
