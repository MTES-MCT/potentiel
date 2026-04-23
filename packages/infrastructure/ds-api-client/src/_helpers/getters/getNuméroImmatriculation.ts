import { Lauréat } from '@potentiel-domain/projet';

import { DossierAccessor } from '../../graphql/index.js';

type GetNuméroImmatriculationProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampsNuméroSIREN: keyof TDossier;
  nomChampsNuméroSIRET: keyof TDossier;
};

export const getNuméroImmatriculation = <TDossier extends Record<string, string>>({
  accessor,
  nomChampsNuméroSIREN,
  nomChampsNuméroSIRET,
}: GetNuméroImmatriculationProps<TDossier>) => {
  const siren = accessor.getStringValue(nomChampsNuméroSIREN);
  const siret = accessor.getStringValue(nomChampsNuméroSIRET);

  if (!siren && !siret) return undefined;

  return Lauréat.Producteur.NuméroImmatriculation.convertirEnValueType({
    siret,
    siren,
  });
};
