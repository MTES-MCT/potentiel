import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../index.js';

import { RetirerAccèsProjetCommand } from './retirerAccèsProjet.command.js';

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
