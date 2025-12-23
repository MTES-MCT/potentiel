import { DétailCandidature, DétailCandidatureRaw } from '../détailCandidature.type';

export const cleanDétails = (détails: DétailCandidatureRaw) =>
  Object.entries(détails).reduce((détail, [key, value]) => {
    if (key !== '' && value !== '' && value !== undefined) {
      détail[key] = value;
    }
    return détail;
  }, {} as DétailCandidature);
