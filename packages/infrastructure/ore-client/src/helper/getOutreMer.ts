import { Option } from '@potentiel-libraries/monads';

import { outreMerPostalCodePrefix, RelevantOutreMer } from '../constant';

export const getOutreMer = (codePostal: string): Option.Type<RelevantOutreMer> => {
  return outreMerPostalCodePrefix[codePostal.slice(0, 3)] ?? Option.none;
};
