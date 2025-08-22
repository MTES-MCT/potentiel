import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { TypeReprésentantLégal } from '../..';
import type { SupprimerDocumentProjetSensibleCommand } from '../supprimerDocumentSensible/supprimerDocumentProjetSensible.command';
import type { AccorderChangementReprésentantLégalCommand } from './accorderChangementReprésentantLégal.command';

export type AccorderChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAccordValue: string;
  } & (
    | {
        nomReprésentantLégalValue: string;
        typeReprésentantLégalValue: string;
        accordAutomatiqueValue: false;
      }
    | {
        accordAutomatiqueValue: true;
      }
  )
>;

export const registerAccorderChangementReprésentantLégalUseCase = () => {
  const runner: MessageHandler<AccorderChangementReprésentantLégalUseCase> = async (options) => {
    const { identifiantProjetValue, dateAccordValue, identifiantUtilisateurValue } = options;

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAccord = DateTime.convertirEnValueType(dateAccordValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    const data: AccorderChangementReprésentantLégalCommand['data'] = match(options)
      .with({ accordAutomatiqueValue: false }, (options) => ({
        dateAccord,
        identifiantUtilisateur,
        identifiantProjet,
        nomReprésentantLégal: options.nomReprésentantLégalValue,
        typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(
          options.typeReprésentantLégalValue,
        ),
        accordAutomatique: false as const,
      }))
      .with({ accordAutomatiqueValue: true }, () => ({
        dateAccord,
        identifiantUtilisateur,
        identifiantProjet,
        accordAutomatique: true as const,
      }))
      .exhaustive();

    await mediator.send<AccorderChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
      data,
    });

    await mediator.send<SupprimerDocumentProjetSensibleCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
      data: {
        identifiantProjet,
        raison: 'Pièce justificative supprimée automatiquement après accord',
      },
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
    runner,
  );
};
