import { none } from './none.js';
import { Option } from './option.js';
import { isSome } from './some.js';

type OnNone<TReturn> = () => TReturn;
type OnSome<TType, TReturn> = (value: TType) => TReturn;

export const match = <TType>(option: Option<TType>) => {
  const some = <TReturn>(onSome: OnSome<TType, TReturn>) => {
    if (isSome(option)) {
      return {
        none: (): TReturn => {
          return onSome(option);
        },
      };
    }

    return {
      none: handleNone<TReturn>,
    };
  };

  return {
    some,
  };
};

function handleNone<TReturn>(): Option<TReturn>;
function handleNone<TReturn>(onNone: OnNone<TReturn>): TReturn;
function handleNone<TReturn>(onNone?: OnNone<TReturn>) {
  if (onNone) {
    return onNone();
  }

  return none;
}
