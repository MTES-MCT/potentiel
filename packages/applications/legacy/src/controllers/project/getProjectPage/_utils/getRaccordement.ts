import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import { Role } from '@potentiel-domain/utilisateur';

type GetRaccordementProps = {
  role: Role.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};
export const getRaccordement = async ({ role, identifiantProjet }: GetRaccordementProps) => {
  if (!role.aLaPermission('réseau.raccordement.consulter')) {
    return Option.none;
  }

  const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
    type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
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
