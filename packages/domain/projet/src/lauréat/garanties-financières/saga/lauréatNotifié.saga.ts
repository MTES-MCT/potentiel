import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { EnregistrerDocumentProjetCommand, DocumentProjet } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';

import { GarantiesFinancières, TypeDocumentGarantiesFinancières } from '..';
import { Candidature, Éliminé } from '../../..';
import { LauréatNotifiéEvent } from '../../notifier/lauréatNotifié.event';
import { ImporterGarantiesFinancièresCommand } from '../actuelles/importer/importerGarantiesFinancières.command';
import { RécupererConstitutionGarantiesFinancièresPort } from '../port';

export const handleLauréatNotifié = async (
  { payload: { identifiantProjet, notifiéLe } }: LauréatNotifiéEvent,
  récupererConstitutionGarantiesFinancières: RécupererConstitutionGarantiesFinancièresPort,
) => {
  const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
    type: 'Éliminé.Recours.Query.ConsulterRecours',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  if (Option.isSome(recours)) {
    return;
  }

  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(candidature)) {
    throw new Error(`Candidature non trouvée`);
  }

  const constitutionGarantiesFinancières = await récupererConstitutionGarantiesFinancières(
    candidature.identifiantProjet,
  );

  if (!candidature.dépôt.garantiesFinancières) {
    return;
  }
  const garantiesFinancières = GarantiesFinancières.convertirEnValueType({
    type: candidature.dépôt.garantiesFinancières.type.type,
    dateÉchéance: candidature.dépôt.garantiesFinancières.estAvecDateÉchéance()
      ? candidature.dépôt.garantiesFinancières.dateÉchéance.formatter()
      : undefined,
    attestation: constitutionGarantiesFinancières
      ? { format: constitutionGarantiesFinancières.attestation.format }
      : undefined,
    dateConstitution: constitutionGarantiesFinancières?.dateConstitution,
  });

  if (constitutionGarantiesFinancières?.attestation) {
    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        documentProjet: DocumentProjet.bind({
          dateCréation: constitutionGarantiesFinancières.dateConstitution,
          format: constitutionGarantiesFinancières.attestation.format,
          identifiantProjet,
          typeDocument:
            TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
        }),
        content: constitutionGarantiesFinancières.attestation.content,
      },
    });
  }

  await mediator.send<ImporterGarantiesFinancièresCommand>({
    type: 'Lauréat.GarantiesFinancières.Command.Importer',
    data: {
      identifiantProjet: candidature.identifiantProjet,
      garantiesFinancières,
      importéLe: DateTime.convertirEnValueType(notifiéLe),
    },
  });
};
