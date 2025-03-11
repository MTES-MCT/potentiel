import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { RéclamerProjetCommand } from './réclamerProjet.command';

export type RéclamerProjetUseCase = Message<
  'Utilisateur.UseCase.RéclamerProjet',
  {
    identifiantProjet: string;
    identifiantUtilisateur: string;
    réclaméLe: string;
    prixRéférence?: number;
    numéroCRE?: string;
  }
>;

export const registerRéclamerProjetUseCase = () => {
  const handler: MessageHandler<RéclamerProjetUseCase> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    réclaméLe,
    prixRéférence,
    numéroCRE,
  }) => {
    await mediator.send<RéclamerProjetCommand>({
      type: 'Utilisateur.Command.RéclamerProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateur),
        réclaméLe: DateTime.convertirEnValueType(réclaméLe),
        prixRéférence: prixRéférence,
        numéroCRE: numéroCRE,
      },
    });
  };
  mediator.register('Utilisateur.UseCase.RéclamerProjet', handler);
};
