import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { TypeDocumentGarantiesFinancières } from '..';
import { ValiderGarantiesFinancièresCommand } from './validerGarantiesFinancières.command';
import { DocumentProjetCommand, DossierProjet } from '@potentiel-domain/document';

export type ValiderGarantiesFinancièresUseCase = Message<
  'VALIDER_GARANTIES_FINANCIÈRES_USECASE',
  {
    identifiantProjetValue: string;
    validéLeValue: string;
    validéParValue: string;
  }
>;

export const registerValiderGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ValiderGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    validéLeValue,
    validéParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const validéLe = DateTime.convertirEnValueType(validéLeValue);
    const validéPar = IdentifiantUtilisateur.convertirEnValueType(validéParValue);

    await mediator.send<DocumentProjetCommand>({
      type: 'DÉPLACER_DOCUMENT_PROJET_COMMAND',
      data: {
        dossierProjetSource: DossierProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentGarantiesFinancières.convertirEnGarantiesFinancièresSoumisesValueType.formatter(),
        ),
        dossierProjetTarget: DossierProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentGarantiesFinancières.convertirEnGarantiesFinancièresValidéesValueType.formatter(),
        ),
      },
    });

    await mediator.send<ValiderGarantiesFinancièresCommand>({
      type: 'VALIDER_GARANTIES_FINANCIÈRES_COMMAND',
      data: {
        identifiantProjet,
        validéLe,
        validéPar,
      },
    });
  };

  mediator.register('VALIDER_GARANTIES_FINANCIÈRES_USECASE', runner);
};
