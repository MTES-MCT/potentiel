import { cache } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

import { getLauréatInfos, getGarantiesFinancières } from '../laureats/[identifiant]/_helpers';

import { getCahierDesCharges } from './getCahierDesCharges';

export const changementActionnaireNécessiteInstruction = cache(
  async (identifiantProjet: IdentifiantProjet.RawType, rôle: Role.RawType) => {
    if (!Role.convertirEnValueType(rôle).aLaPermission('actionnaire.demanderChangement')) {
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
