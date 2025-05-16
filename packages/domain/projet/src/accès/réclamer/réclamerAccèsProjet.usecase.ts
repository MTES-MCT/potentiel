import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

import { RéclamerAccèsProjetCommand } from './réclamerAccèsProjet.command';

export type RéclamerAccèsProjetUseCase = Message<
  'Projet.Accès.UseCase.RéclamerAccèsProjet',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateRéclamationValue: string;
    numéroCRE: string;
    prix: number;
  }
>;

export const registerRéclamerAccèsProjetUseCase = () => {
  const runner: MessageHandler<RéclamerAccèsProjetUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    numéroCRE,
    prix,
    dateRéclamationValue,
  }) => {
    await mediator.send<RéclamerAccèsProjetCommand>({
      type: 'Projet.Accès.Command.RéclamerAccèsProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        numéroCRE,
        prix,
        réclaméLe: DateTime.convertirEnValueType(dateRéclamationValue),
        réclaméPar: Email.convertirEnValueType(identifiantUtilisateurValue),
      },
    });
  };
  mediator.register('Projet.Accès.UseCase.RéclamerAccèsProjet', runner);
};
