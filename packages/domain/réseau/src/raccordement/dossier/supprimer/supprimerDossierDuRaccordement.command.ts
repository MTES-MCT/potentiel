import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { loadRaccordementAggregateFactory } from '../../raccordement.aggregate';

export type SupprimerDossierDuRaccordementCommand = Message<
  'Réseau.Raccordement.Command.SupprimerDossierDuRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    rôle: Role.ValueType;
  }
>;

export const registerSupprimerDossierDuRaccordementCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);

  const handler: MessageHandler<SupprimerDossierDuRaccordementCommand> = async ({
    identifiantProjet,
    référenceDossier,
    rôle,
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet);
    await raccordement.supprimerDossier({
      identifiantProjet,
      référenceDossier,
      rôle,
    });
  };

  mediator.register('Réseau.Raccordement.Command.SupprimerDossierDuRaccordement', handler);
};
