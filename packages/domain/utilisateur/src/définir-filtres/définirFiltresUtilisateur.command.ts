import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';

import { UtilisateurAggregate } from '../utilisateur.aggregate.js';
import type { Filters } from '../utilisateur.valueType.js';

export type DéfinirFiltresUtilisateurCommand = Message<
  'Utilisateur.Command.DéfinirFiltresUtilisateur',
  {
    identifiantUtilisateur: Email.ValueType;
    définiLe: DateTime.ValueType;
    filtres: Filters;
  }
>;

export const registerDéfinirFiltresCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<DéfinirFiltresUtilisateurCommand> = async ({
    identifiantUtilisateur,
    filtres,
    définiLe,
  }) => {
    const utilisateur = await loadAggregate(
      UtilisateurAggregate,
      `utilisateur|${identifiantUtilisateur.formatter()}`,
      undefined,
    );

    await utilisateur.définirFiltres({
      filtres,
      définiLe,
    });
  };
  mediator.register('Utilisateur.Command.DéfinirFiltresUtilisateur', handler);
};
