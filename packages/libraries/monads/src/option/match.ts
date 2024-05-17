import { none } from './none';
import { Option } from './option';
import { isSome } from './some';

type OnNone<TReturn> = () => TReturn;
type OnSome<TType, TReturn> = (value: TType) => TReturn;

export const match = <TType>(option: Option<TType>) => {
  const some = <TReturn>(onSome: OnSome<TType, TReturn>) => {
    if (isSome(option)) {
      return {
        none: (): Option<TReturn> => {
          return onSome(option);
        },
      };
    }

    return {
      none: (onNone?: OnNone<TReturn>): Option<TReturn> => {
        if (onNone) {
          return onNone();
        }

        return none;
      },
    };
  };

  return {
    some,
  };
};
