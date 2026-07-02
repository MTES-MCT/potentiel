import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../../index.js';
import { TypeDocumentsRaccordement } from '../../index.js';
import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import type { SupprimerDocumentRaccordementCommand } from './supprimerDocumentRaccordement.command.js';

export type SupprimerDocumentRaccordementUseCase = Message<
  'Lauréat.Raccordement.UseCase.SupprimerDocumentRaccordement',
  {
    identifiantProjetValue: string;
    référenceDossierRaccordementValue: string;
    typeValue: string;
    suppriméLeValue: string;
    suppriméParValue: string;
  }
>;

export const registerSupprimerDocumentRaccordementUseCase = () => {
  const runner: MessageHandler<SupprimerDocumentRaccordementUseCase> = async ({
    identifiantProjetValue,
    référenceDossierRaccordementValue,
    typeValue,
    suppriméLeValue,
    suppriméParValue,
  }) => {
    const typeDocument = TypeDocumentsRaccordement.convertirEnValueType(typeValue);

    // voir ce qu'on fait ici viovio
    // const documentRaccordement = DocumentRaccordement.documentRaccordement(typeDocument.type)({
    //   identifiantProjet: identifiantProjetValue,
    //   référenceDossierRaccordement: référenceDossierRaccordementValue,
    //   dateSignature: dateSignatureValue,
    //   document: { format },
    // });

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossierRaccordement = RéférenceDossierRaccordement.convertirEnValueType(
      référenceDossierRaccordementValue,
    );

    await mediator.send<SupprimerDocumentRaccordementCommand>({
      type: 'Lauréat.Raccordement.Command.SupprimerDocumentRaccordement',
      data: {
        identifiantProjet,
        référenceDossierRaccordement,
        suppriméLe: DateTime.convertirEnValueType(suppriméLeValue),
        suppriméPar: Email.convertirEnValueType(suppriméParValue),
        type: typeDocument,
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.SupprimerDocumentRaccordement', runner);
};
