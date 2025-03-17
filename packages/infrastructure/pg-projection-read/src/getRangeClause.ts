import format from 'pg-format';

import { RangeOptions } from '@potentiel-domain/entity';

export const getRangeClause = ({ endPosition, startPosition }: RangeOptions) => {
  if (startPosition < 0) {
    throw new NegativeStartPositionError();
  }

  if (endPosition < 0) {
    throw new NegativeEndPositionError();
  }

  if (startPosition > endPosition) {
    throw new StartPositionGreaterThanEndPositionError();
  }

  if (startPosition === endPosition) {
    throw new StartPositionEqualToEndPositionError();
  }

  const limit = endPosition - startPosition + 1;
  const offset = startPosition;
  return format('limit %s offset %s', limit, offset);
};

export class NegativeStartPositionError extends Error {
  constructor() {
    super('Start position must be a positive value');
  }
}

export class NegativeEndPositionError extends Error {
  constructor() {
    super('End position must be a positive value');
  }
}

export class StartPositionGreaterThanEndPositionError extends Error {
  constructor() {
    super('Start position must be greater than end position value');
  }
}

export class StartPositionEqualToEndPositionError extends Error {
  constructor() {
    super('Start and end position values can not be the same');
  }
}
