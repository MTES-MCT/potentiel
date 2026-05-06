import { Lauréat } from '@potentiel-domain/projet';

import { DossierAccessor } from '../../graphql/index.js';

type GetNuméroIdentificationProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampsNuméroSIREN: keyof TDossier;
  nomChampsNuméroSIRET: keyof TDossier;
};

export const getNuméroIdentification = <TDossier extends Record<string, string>>({
  accessor,
  nomChampsNuméroSIREN,
  nomChampsNuméroSIRET,
}: GetNuméroIdentificationProps<TDossier>) => {
  const siren = accessor.getStringValue(nomChampsNuméroSIREN);
  const siret = accessor.getSIRETValue(nomChampsNuméroSIRET);

  if (!siren && !siret) return undefined;

  // VIOVIO: supprimer ici
  return Lauréat.Producteur.NuméroIdentification.bind({
    siret,
    siren,
  });
};
