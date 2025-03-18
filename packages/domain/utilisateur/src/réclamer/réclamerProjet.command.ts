import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';

import { loadUtilisateurFactory } from '../utilisateur.aggregate';

export type RéclamerProjetCommand = Message<
  'Utilisateur.Command.RéclamerProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    réclaméLe: DateTime.ValueType;

    prixRéférence?: number;
    numéroCRE?: string;
  }
>;

export const registerRéclamerProjetCommand = (loadAggregate: LoadAggregate) => {
  const loadUtilisateur = loadUtilisateurFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<RéclamerProjetCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    réclaméLe,
    prixRéférence,
    numéroCRE,
  }) => {
    const utilisateur = await loadUtilisateur(identifiantUtilisateur, false);
    const candidature = await loadCandidature(identifiantProjet);

    await utilisateur.réclamer({
      identifiantProjet,
      identifiantUtilisateur,
      réclaméLe,
      aLeMêmeEmailQueLaCandidature: candidature.emailContact.estÉgaleÀ(identifiantUtilisateur),
      connaîtLePrixEtNuméroCRE:
        prixRéférence !== undefined && numéroCRE !== undefined
          ? candidature.prixRéférence === prixRéférence && identifiantProjet.numéroCRE === numéroCRE
          : undefined,
    });
  };
  mediator.register('Utilisateur.Command.RéclamerProjet', handler);
};
