// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { SupprimerDocumentProjetSensibleCommand } from '@potentiel-domain/document';

import { loadReprésentantLégalFactory, TypeReprésentantLégal } from '../..';

import { AccorderChangementReprésentantLégalCommand } from './accorderChangementReprésentantLégal.command';

export type AccorderChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    nomReprésentantLégalValue: string;
    typeReprésentantLégalValue: string;
    dateAccordValue: string;
    accordAutomatiqueValue: boolean;
  }
>;

export const registerAccorderChangementReprésentantLégalUseCase = (
  loadAggregate: LoadAggregate,
) => {
  const load = loadReprésentantLégalFactory(loadAggregate);

  const runner: MessageHandler<AccorderChangementReprésentantLégalUseCase> = async ({
    identifiantUtilisateurValue,
    dateAccordValue,
    identifiantProjetValue,
    nomReprésentantLégalValue,
    typeReprésentantLégalValue,
    accordAutomatiqueValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAccord = DateTime.convertirEnValueType(dateAccordValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    const représentantLégal = await load(identifiantProjet);

    await mediator.send<AccorderChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
      data: {
        nomReprésentantLégal: nomReprésentantLégalValue,
        typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(
          typeReprésentantLégalValue,
        ),
        dateAccord,
        identifiantUtilisateur,
        identifiantProjet,
        accordAutomatique: accordAutomatiqueValue,
      },
    });

    if (représentantLégal.demande) {
      await mediator.send<SupprimerDocumentProjetSensibleCommand>({
        type: 'Document.Command.SupprimerDocumentProjetSensible',
        data: {
          documentProjet: représentantLégal.demande.pièceJustificative,
          raison: 'Pièce justificative supprimée automatiquement après annulation',
        },
      });
    }
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
    runner,
  );
};
