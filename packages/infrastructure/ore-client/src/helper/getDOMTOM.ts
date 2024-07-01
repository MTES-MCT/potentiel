import { DOMTOMPostalCodeRanges, RelevantDOMTOM, relevantDOMTOM } from '../constant';

export const getDOMTOM = (codePostal: number): RelevantDOMTOM | undefined => {
  for (const DOMTOM of relevantDOMTOM) {
    const range = DOMTOMPostalCodeRanges[DOMTOM];
    if (codePostal >= range.min && codePostal <= range.max) {
      return DOMTOM;
    }
  }
};
