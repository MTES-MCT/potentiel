import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { RéclamerAccèsProjetCommand } from './réclamerAccèsProjet.command';

export type RéclamerAccèsProjetUseCase = Message<
  'Projet.Accès.UseCase.RéclamerAccèsProjet',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    numéroCRE: string;
    prix: number;
    réclaméLeValue: string;
    réclaméParValue: string;
  }
>;

export const registerRéclamerAccèsProjetUseCase = () => {
  const runner: MessageHandler<RéclamerAccèsProjetUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    numéroCRE,
    prix,
    réclaméLeValue,
    réclaméParValue,
  }) => {
    await mediator.send<RéclamerAccèsProjetCommand>({
      type: 'Projet.Accès.Command.RéclamerAccèsProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        numéroCRE,
        prix,
        réclaméLe: DateTime.convertirEnValueType(réclaméLeValue),
        réclaméPar: Email.convertirEnValueType(réclaméParValue),
      },
    });
  };
  mediator.register('Projet.Accès.UseCase.RéclamerAccèsProjet', runner);
};
