import { Option } from '@potentiel-libraries/monads';

import {
  CorsePostalCodePrefixInString,
  outreMerPostalCodePrefixInString,
  RelevantOutreMer,
} from '../constant';

export const getOutreMer = (codePostal: string): Option.Type<RelevantOutreMer> => {
  return outreMerPostalCodePrefixInString[codePostal.slice(0, 3)] ?? Option.none;
};

export const isCorse = (codePostal: string): boolean =>
  codePostal.slice(0, 2) === CorsePostalCodePrefixInString;
