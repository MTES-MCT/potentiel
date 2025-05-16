import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

import { AutoriserAccèsProjetCommand } from './autoriserAccèsProjet.command';

export type AutoriserAccèsProjetUseCase = Message<
  'Projet.Accès.UseCase.AutoriserAccèsProjet',
  {
    identifiantProjetValues: Array<string>;
    identifiantUtilisateurValue: string;
    autoriséLeValue: string;
    autoriséParValue: string;
    raison: 'invitation' | 'notification' | 'réclamation';
  }
>;

export const registerAutoriserAccèsProjetUseCase = () => {
  const runner: MessageHandler<AutoriserAccèsProjetUseCase> = async ({
    identifiantProjetValues,
    identifiantUtilisateurValue,
    autoriséLeValue,
    autoriséParValue,
    raison,
  }) => {
    await mediator.send<AutoriserAccèsProjetCommand>({
      type: 'Projet.Accès.Command.AutoriserAccèsProjet',
      data: {
        identifiantProjets: identifiantProjetValues.map((identifiantProjetValue) =>
          IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        ),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        autoriséLe: DateTime.convertirEnValueType(autoriséLeValue),
        autoriséPar: Email.convertirEnValueType(autoriséParValue),
        raison,
      },
    });
  };
  mediator.register('Projet.Accès.UseCase.AutoriserAccèsProjet', runner);
};
