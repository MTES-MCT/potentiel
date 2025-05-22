import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { RetirerAccèsProjetCommand } from './retirerAccèsProjet.command';

export type RetirerAccèsProjetUseCase = Message<
  'Projet.Accès.UseCase.RetirerAccèsProjet',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    retiréLeValue: string;
    retiréParValue: string;
    cause?: 'changement-producteur';
  }
>;

export const registerRetirerAccèsProjetUseCase = () => {
  const runner: MessageHandler<RetirerAccèsProjetUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    retiréLeValue,
    retiréParValue,
    cause,
  }) => {
    await mediator.send<RetirerAccèsProjetCommand>({
      type: 'Projet.Accès.Command.RetirerAccèsProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        retiréLe: DateTime.convertirEnValueType(retiréLeValue),
        retiréPar: Email.convertirEnValueType(retiréParValue),
        cause,
      },
    });
  };
  mediator.register('Projet.Accès.UseCase.RetirerAccèsProjet', runner);
};
