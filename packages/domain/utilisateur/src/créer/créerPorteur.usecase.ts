import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { CréerPorteurCommand } from './créerPorteur.command';

/**
 * Similaire au use case Inviter Porteur,
 * mais utilisé dans le contexte d'un utilisateur qui s'inscrit et réclame un projet
 **/
export type CréerPorteurUseCase = Message<
  'Utilisateur.UseCase.CréerPorteur',
  {
    identifiantUtilisateurValue: string;
  }
>;

export const registerCréerPorteurUseCase = () => {
  const runner: MessageHandler<CréerPorteurUseCase> = async ({ identifiantUtilisateurValue }) => {
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<CréerPorteurCommand>({
      type: 'Utilisateur.Command.CréerPorteur',
      data: {
        identifiantUtilisateur,
        crééLe: DateTime.now(),
      },
    });
  };

  mediator.register('Utilisateur.UseCase.CréerPorteur', runner);
};
