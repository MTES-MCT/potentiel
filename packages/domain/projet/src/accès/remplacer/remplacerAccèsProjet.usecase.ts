import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../index.js';

import { RemplacerAccèsProjetCommand } from './remplacerAccèsProjet.command.js';

export type RemplacerAccèsProjetUseCase = Message<
  'Projet.Accès.UseCase.RemplacerAccèsProjet',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    nouvelIdentifiantUtilisateurValue: string;
    remplacéLeValue: string;
    remplacéParValue: string;
  }
>;

export const registerRemplacerAccèsProjetUseCase = () => {
  const runner: MessageHandler<RemplacerAccèsProjetUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    nouvelIdentifiantUtilisateurValue,
    remplacéLeValue,
    remplacéParValue,
  }) => {
    await mediator.send<RemplacerAccèsProjetCommand>({
      type: 'Projet.Accès.Command.RemplacerAccèsProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        nouvelIdentifiantUtilisateur: Email.convertirEnValueType(nouvelIdentifiantUtilisateurValue),
        remplacéLe: DateTime.convertirEnValueType(remplacéLeValue),
        remplacéPar: Email.convertirEnValueType(remplacéParValue),
      },
    });
  };
  mediator.register('Projet.Accès.UseCase.RemplacerAccèsProjet', runner);
};
