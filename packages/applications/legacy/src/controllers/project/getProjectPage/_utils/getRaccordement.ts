import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement as RaccordementLauréat } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';

import { Role } from '@potentiel-domain/utilisateur';
import { Raccordement } from '@potentiel-domain/projet';

type GetRaccordementProps = {
  role: Role.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};
export const getRaccordement = async ({ role, identifiantProjet }: GetRaccordementProps) => {
  if (!role.aLaPermission('raccordement.consulter')) {
    return Option.none;
  }

  const raccordement = await mediator.send<RaccordementLauréat.ConsulterRaccordementQuery>({
    type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });
  if (
    Option.isNone(raccordement) ||
    raccordement.dossiers.length === 0 ||
    raccordement.dossiers[0].référence.estÉgaleÀ(
      Raccordement.RéférenceDossierRaccordement.référenceNonTransmise,
    )
  ) {
    return Option.none;
  }
  return raccordement;
};
