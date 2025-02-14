import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/candidature';

import { TypeDocumentGarantiesFinancières } from '../..';
import { AjouterTâchesGarantiesFinancièresCommand } from '../../tâches-planifiées/ajouter/ajouter.command';

import { ModifierGarantiesFinancièresCommand } from './modifierGarantiesFinancières.command';

export type ModifierGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières',
  {
    identifiantProjetValue: string;
    typeValue: string;
    dateÉchéanceValue?: string;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    dateConstitutionValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
  }
>;

export const registerModifierGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ModifierGarantiesFinancièresUseCase> = async ({
    attestationValue,
    dateConstitutionValue,
    identifiantProjetValue,
    modifiéLeValue,
    typeValue,
    dateÉchéanceValue,
    modifiéParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const type = Candidature.TypeGarantiesFinancières.convertirEnValueType(typeValue);
    const dateÉchéance = dateÉchéanceValue
      ? DateTime.convertirEnValueType(dateÉchéanceValue)
      : undefined;
    const dateConstitution = DateTime.convertirEnValueType(dateConstitutionValue);
    const modifiéLe = DateTime.convertirEnValueType(modifiéLeValue);
    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
      dateConstitutionValue,
      attestationValue.format,
    );
    const modifiéPar = IdentifiantUtilisateur.convertirEnValueType(modifiéParValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<ModifierGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières',
      data: {
        attestation,
        dateConstitution,
        identifiantProjet,
        type,
        dateÉchéance,
        modifiéLe,
        modifiéPar,
      },
    });

    await mediator.send<AjouterTâchesGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.AjouterTâchesPlanifiées',
      data: {
        identifiantProjet,
        dateÉchéance,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières', runner);
};
