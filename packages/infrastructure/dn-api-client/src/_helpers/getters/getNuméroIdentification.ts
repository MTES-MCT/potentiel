import { InvalidOperationError } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import type { DossierAccessor } from '../../graphql/index.js';

type GetNuméroIdentificationProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampsNuméroSIREN: keyof TDossier;
  nomChampsNuméroSIRET: keyof TDossier;
  nomProjet?: string;
};

export const getNuméroIdentification = <TDossier extends Record<string, string>>({
  accessor,
  nomChampsNuméroSIREN,
  nomChampsNuméroSIRET,
  nomProjet,
}: GetNuméroIdentificationProps<TDossier>) => {
  const siren = accessor.getStringValue(nomChampsNuméroSIREN);
  const siret = accessor.getSIRETValue(nomChampsNuméroSIRET);

  if (!siren && !siret) return undefined;

  // permet une vérification supplémentaire impossible dans DN
  // on importe pas les siren / siret invalides
  try {
    const numéroIdentificationVT = Lauréat.Producteur.NuméroIdentification.bind({
      siret,
      siren,
    });
    return numéroIdentificationVT;
  } catch (error) {
    if (error instanceof InvalidOperationError) {
      const logger = getLogger();
      logger.warn(`${error.message}, la valeur numéroIdentification ne sera pas importée`, {
        nomProjet,
        siren,
        siret,
      });
      return undefined;
    } else {
      throw error;
    }
  }
};
