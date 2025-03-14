import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { RetirerAccèsProjetCommand } from './retirerAccèsProjet.command';
export type RetirerAccèsProjetUseCase = Message<
  'Utilisateur.UseCase.RetirerAccèsProjet',
  {
    identifiantProjet: string;
    identifiantUtilisateur: string;
    retiréLe: string;
    retiréPar: string;
    cause?: 'changement-producteur';
  }
>;

export const registerRetirerAccèsProjetUseCase = () => {
  const handler: MessageHandler<RetirerAccèsProjetUseCase> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    retiréLe,
    retiréPar,
    cause,
  }) => {
    await mediator.send<RetirerAccèsProjetCommand>({
      type: 'Utilisateur.Command.RetirerAccèsProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateur),
        retiréLe: DateTime.convertirEnValueType(retiréLe),
        retiréPar: Email.convertirEnValueType(retiréPar),
        cause,
      },
    });
  };
  mediator.register('Utilisateur.UseCase.RetirerAccèsProjet', handler);
};
