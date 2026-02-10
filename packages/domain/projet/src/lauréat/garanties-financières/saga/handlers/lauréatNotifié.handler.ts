import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import {
  EnregistrerDocumentProjetCommand,
  DocumentProjet,
} from '../../../../document-projet/index.js';
import { GarantiesFinancières, TypeDocumentGarantiesFinancières } from '../../index.js';
import { Candidature, Éliminé } from '../../../../index.js';
import { LauréatNotifiéEvent } from '../../../notifier/lauréatNotifié.event.js';
import { ImporterGarantiesFinancièresCommand } from '../../actuelles/importer/importerGarantiesFinancières.command.js';
import { RécupererConstitutionGarantiesFinancièresPort } from '../../port/index.js';

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
