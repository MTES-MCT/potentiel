import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { Role, Région, Zone } from '..';
import { UtilisateurAggregate } from '../utilisateur.aggregate';

export type ModifierRôleUtilisateurCommand = Message<
  'Utilisateur.Command.ModifierRôleUtilisateur',
  {
    identifiantUtilisateur: Email.ValueType;
    nouveauRôle: Role.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    fonction?: string;
    nomComplet?: string;
    région?: Région.ValueType;
    identifiantGestionnaireRéseau?: string;
    zone?: Zone.ValueType;
  }
>;

export const registerModifierRôleCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<ModifierRôleUtilisateurCommand> = async ({
    identifiantUtilisateur,
    nouveauRôle,
    modifiéLe,
    modifiéPar,
    fonction,
    nomComplet,
    région,
    identifiantGestionnaireRéseau,
    zone,
  }) => {
    const utilisateur = await loadAggregate(
      UtilisateurAggregate,
      `utilisateur|${identifiantUtilisateur.formatter()}`,
      undefined,
    );

    await utilisateur.modifierRôle({
      rôle: nouveauRôle,
      modifiéLe,
      modifiéPar,
      fonction,
      nomComplet,
      région,
      identifiantGestionnaireRéseau,
      zone,
    });
  };
  mediator.register('Utilisateur.Command.ModifierRôleUtilisateur', handler);
};
