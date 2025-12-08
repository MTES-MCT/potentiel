import { RangeOptions } from '@potentiel-domain/entity';

export const defaultNbItems = 50;

export const mapToRangeOptions = (after: number | undefined): RangeOptions => {
  if (!!after && after < 0) {
    throw new Error(`Invalid "after" value`);
  }

  const startPosition = after ? after + 1 : 0;
  return {
    startPosition,
    endPosition: startPosition + defaultNbItems - 1,
  };
};
