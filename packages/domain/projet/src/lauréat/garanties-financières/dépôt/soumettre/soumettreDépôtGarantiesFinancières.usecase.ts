import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { GarantiesFinancières, TypeDocumentGarantiesFinancières } from '../..';

import { SoumettreDépôtGarantiesFinancièresCommand } from './soumettreDépôtGarantiesFinancières.command';

export type SoumettreDépôtGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
  {
    identifiantProjetValue: string;
    garantiesFinancièresValue: {
      type: string;
      dateÉchéance: string | undefined;
      dateDélibération: string | undefined;
    };
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
    attestationValue,
    dateConstitutionValue,
    identifiantProjetValue,
    soumisLeValue,
    garantiesFinancièresValue,
    soumisParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const garantiesFinancières =
      GarantiesFinancières.convertirEnValueType(garantiesFinancièresValue);

    const soumisLe = DateTime.convertirEnValueType(soumisLeValue);
    const dateConstitution = DateTime.convertirEnValueType(dateConstitutionValue);
    const soumisPar = IdentifiantUtilisateur.convertirEnValueType(soumisParValue);

    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
      dateConstitutionValue,
      attestationValue.format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<SoumettreDépôtGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.SoumettreDépôtGarantiesFinancières',
      data: {
        attestation,
        dateConstitution,
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
