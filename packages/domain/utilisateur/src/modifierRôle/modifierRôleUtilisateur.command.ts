import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { Utilisateur } from '../index.js';
import { UtilisateurAggregate } from '../utilisateur.aggregate.js';

export type ModifierRôleUtilisateurCommand = Message<
  'Utilisateur.Command.ModifierRôleUtilisateur',
  {
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    nouvelUtilisateur: Utilisateur.ValueType;
  }
>;

export const registerModifierRôleCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<ModifierRôleUtilisateurCommand> = async ({
    nouvelUtilisateur,
    modifiéLe,
    modifiéPar,
  }) => {
    const utilisateur = await loadAggregate(
      UtilisateurAggregate,
      `utilisateur|${nouvelUtilisateur.identifiantUtilisateur.formatter()}`,
      undefined,
    );

    await utilisateur.modifierRôle({
      nouvelUtilisateur,
      modifiéLe,
      modifiéPar,
    });
  };
  mediator.register('Utilisateur.Command.ModifierRôleUtilisateur', handler);
};
