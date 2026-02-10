import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../index.js';

import { RéclamerAccèsProjetCommand } from './réclamerAccèsProjet.command.js';

export type RéclamerAccèsProjetUseCase = Message<
  'Projet.Accès.UseCase.RéclamerAccèsProjet',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateRéclamationValue: string;
  } & (
    | {
        type: 'avec-prix-numéro-cre';
        numéroCRE: string;
        prix: number;
      }
    | {
        type: 'même-email-candidature';
      }
  )
>;

export const registerRéclamerAccèsProjetUseCase = () => {
  const runner: MessageHandler<RéclamerAccèsProjetUseCase> = async (payload) => {
    const { identifiantProjetValue, identifiantUtilisateurValue, dateRéclamationValue, type } =
      payload;

    await mediator.send<RéclamerAccèsProjetCommand>({
      type: 'Projet.Accès.Command.RéclamerAccèsProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        dateRéclamation: DateTime.convertirEnValueType(dateRéclamationValue),
        ...(type === 'avec-prix-numéro-cre'
          ? { type, numéroCRE: payload.numéroCRE, prix: payload.prix }
          : { type }),
      },
    });
  };
  mediator.register('Projet.Accès.UseCase.RéclamerAccèsProjet', runner);
};
