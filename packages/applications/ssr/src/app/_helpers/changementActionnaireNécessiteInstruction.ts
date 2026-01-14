import { cache } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getLauréatInfos, getGarantiesFinancières } from '../laureats/[identifiant]/_helpers';

import { getCahierDesCharges } from './getCahierDesCharges';

export const changementActionnaireNécessiteInstruction = cache(
  async (
    identifiantProjet: IdentifiantProjet.RawType,
    peutDemanderChangementActionnaire: boolean,
  ) => {
    if (!peutDemanderChangementActionnaire) {
      return undefined;
    }

    const lauréat = await getLauréatInfos(identifiantProjet);
    const { actuelles, dépôt } = await getGarantiesFinancières(identifiantProjet);
    const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

    const instructionChangementActionnaire =
      Lauréat.Actionnaire.InstructionChangementActionnaire.bind({
        aDesGarantiesFinancièresConstituées: !!actuelles,
        aUnDépotEnCours: !!dépôt,
        typeActionnariat: lauréat.actionnariat,
      });

    return (
      !!cahierDesCharges.getRèglesChangements('actionnaire').demande &&
      instructionChangementActionnaire.estRequise()
    );
  },
);
