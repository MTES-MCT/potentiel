import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../../../document-projet';
import { GarantiesFinancières, TypeDocumentGarantiesFinancières } from '../..';
import { IdentifiantProjet } from '../../../..';

import { SoumettreDépôtGarantiesFinancièresCommand } from './soumettreDépôtGarantiesFinancières.command';

export type SoumettreDépôtGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
  {
    identifiantProjetValue: string;
    typeValue: string;
    dateÉchéanceValue: string | undefined;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    dateConstitutionValue: string;
    soumisLeValue: string;
    soumisParValue: string;
  }
>;

export const registerSoumettreDépôtGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<SoumettreDépôtGarantiesFinancièresUseCase> = async ({
    typeValue,
    dateÉchéanceValue,
    attestationValue,
    dateConstitutionValue,
    identifiantProjetValue,
    soumisLeValue,
    soumisParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const garantiesFinancières = GarantiesFinancières.convertirEnValueType({
      type: typeValue,
      dateÉchéance:
        dateÉchéanceValue && DateTime.convertirEnValueType(dateÉchéanceValue).formatter(),
      attestation: { format: attestationValue.format },
      dateConstitution: DateTime.convertirEnValueType(dateConstitutionValue).formatter(),
    });

    const documentProjet = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
      dateConstitutionValue,
      attestationValue.format,
    );

    const soumisLe = DateTime.convertirEnValueType(soumisLeValue);
    const soumisPar = Email.convertirEnValueType(soumisParValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet,
      },
    });

    await mediator.send<SoumettreDépôtGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.SoumettreDépôtGarantiesFinancières',
      data: {
        identifiantProjet,
        soumisLe,
        soumisPar,
        garantiesFinancières,
      },
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
    runner,
  );
};
