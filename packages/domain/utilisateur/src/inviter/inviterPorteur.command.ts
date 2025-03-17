import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadUtilisateurFactory } from '../utilisateur.aggregate';

export type InviterPorteurCommand = Message<
  'Utilisateur.Command.InviterPorteur',
  {
    identifiantsProjet: IdentifiantProjet.ValueType[];
    identifiantUtilisateur: Email.ValueType;
    invitéPar: Email.ValueType;
    invitéLe: DateTime.ValueType;
    inviteATousSesProjets: boolean;
  }
>;

export const registerInviterPorteurCommand = (loadAggregate: LoadAggregate) => {
  const loadUtilisateur = loadUtilisateurFactory(loadAggregate);
  const handler: MessageHandler<InviterPorteurCommand> = async ({
    identifiantsProjet,
    identifiantUtilisateur,
    invitéLe,
    invitéPar,
    inviteATousSesProjets,
  }) => {
    const utilisateur = await loadUtilisateur(identifiantUtilisateur, false);
    const utilisateurQuiInvite = await loadUtilisateur(invitéPar, false);
    const identifiantsProjetInvités = inviteATousSesProjets
      ? Array.from(utilisateurQuiInvite.projets).map(IdentifiantProjet.convertirEnValueType)
      : identifiantsProjet;

    await utilisateur.inviterPorteur({
      identifiantsProjet: identifiantsProjetInvités,
      identifiantUtilisateur,
      invitéLe,
      invitéPar,
    });
  };
  mediator.register('Utilisateur.Command.InviterPorteur', handler);
};
