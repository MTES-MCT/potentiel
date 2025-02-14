import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/candidature';

import { TypeDocumentGarantiesFinancières } from '../..';
import { AjouterTâchesGarantiesFinancièresCommand } from '../../tâches-planifiées/ajouter/ajouter.command';

import { EnregistrerGarantiesFinancièresCommand } from './enregistrerGarantiesFinancières.command';

export type EnregistrerGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
  {
    identifiantProjetValue: string;
    typeValue: string;
    dateÉchéanceValue?: string;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    dateConstitutionValue: string;
    enregistréLeValue: string;
    enregistréParValue: string;
  }
>;

export const registerEnregistrerGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<EnregistrerGarantiesFinancièresUseCase> = async ({
    attestationValue,
    dateConstitutionValue,
    identifiantProjetValue,
    enregistréLeValue,
    typeValue,
    dateÉchéanceValue,
    enregistréParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const type = Candidature.TypeGarantiesFinancières.convertirEnValueType(typeValue);
    const dateÉchéance = dateÉchéanceValue
      ? DateTime.convertirEnValueType(dateÉchéanceValue)
      : undefined;
    const dateConstitution = DateTime.convertirEnValueType(dateConstitutionValue);
    const enregistréLe = DateTime.convertirEnValueType(enregistréLeValue);
    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
      dateConstitutionValue,
      attestationValue.format,
    );
    const enregistréPar = IdentifiantUtilisateur.convertirEnValueType(enregistréParValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<EnregistrerGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.EnregistrerGarantiesFinancières',
      data: {
        attestation,
        dateConstitution,
        identifiantProjet,
        type,
        dateÉchéance,
        enregistréLe: enregistréLe,
        enregistréPar: enregistréPar,
      },
    });

    await mediator.send<AjouterTâchesGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.AjouterTâchesPlanifiées',
      data: {
        identifiantProjet,
        dateÉchéance: dateÉchéanceValue
          ? DateTime.convertirEnValueType(dateÉchéanceValue)
          : undefined,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières', runner);
};
