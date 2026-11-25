import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { Type } from '../filters.types.js';
import type { DéfinirFiltresUtilisateurCommand } from './définirFiltresUtilisateur.command.js';

export type DéfinirFiltresUtilisateurUseCase = Message<
  'Utilisateur.UseCase.DéfinirFiltresUtilisateur',
  {
    identifiantUtilisateurValue: string;
    filtresValue: Type;
    définisLeValue: string;
  }
>;

export const registerDéfinirFiltresUseCase = () => {
  const runner: MessageHandler<DéfinirFiltresUtilisateurUseCase> = async ({
    identifiantUtilisateurValue,
    filtresValue,
    définisLeValue,
  }) => {
    const définisLe = DateTime.convertirEnValueType(définisLeValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<DéfinirFiltresUtilisateurCommand>({
      type: 'Utilisateur.Command.DéfinirFiltresUtilisateur',
      data: {
        identifiantUtilisateur,
        filtres: filtresValue,
        définisLe,
      },
    });
  };

  mediator.register('Utilisateur.UseCase.DéfinirFiltresUtilisateur', runner);
};
