import { Option } from '@potentiel-libraries/monads';

import { DOMTOMPostalCodeRanges, RelevantDOMTOM, relevantDOMTOM } from '../constant';

export const getDOMTOM = (codePostal: number): Option.Type<RelevantDOMTOM> => {
  for (const DOMTOM of relevantDOMTOM) {
    const range = DOMTOMPostalCodeRanges[DOMTOM];
    if (codePostal >= range.min && codePostal <= range.max) {
      return DOMTOM;
    }
  }
  return Option.none;
};
