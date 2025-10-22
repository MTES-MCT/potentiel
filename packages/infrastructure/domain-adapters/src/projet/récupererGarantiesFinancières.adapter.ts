import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { getAttestationGarantiesFinancières } from '@potentiel-infrastructure/ds-api-client';
import { DocumentProjet } from '@potentiel-domain/document';
import { getLogger } from '@potentiel-libraries/monitoring';

import { loadAppelOffreAggregateAdapter } from '../appel-offre/loadAppelOffreAggregate.adapter';

import { getProjetAggregateRootAdapter } from './getProjetAggregateRoot.adapter';

export const récupererGarantiesFinancièresAdapter: Lauréat.GarantiesFinancières.RécupérerGarantiesFinancièresPort =
  async (identifiantProjet) => {
    const ao = await loadAppelOffreAggregateAdapter(identifiantProjet.appelOffre);
    const logger = getLogger('récupererGarantiesFinancièresAdapter');

    if (Option.isNone(ao)) {
      throw new Error("Appel d'offre introuvable");
    }

    const périodeCible = ao.periodes.find((p) => p.id === identifiantProjet.période);

    if (!périodeCible) {
      throw new Error('Période introuvable');
    }

    const projet = await getProjetAggregateRootAdapter(identifiantProjet, true);
    await projet.initCandidature();

    const garantiesFinancières = projet.candidature.dépôt.garantiesFinancières;

    if (!garantiesFinancières) {
      return undefined;
    }

    // Pour les périodes importées via CSV, on a uniquement le type de GF, dans la candidatures
    if (!périodeCible.numéroDémarche) {
      return { garantiesFinancières, attestation: undefined };
    }

    const attestationEtDateConstitution = await getAttestationGarantiesFinancières(
      Number(identifiantProjet.numéroCRE),
    );

    if (Option.isNone(attestationEtDateConstitution)) {
      logger.warn('Aucune garantie financière trouvée pour ce projet');
      return;
    }

    return {
      garantiesFinancières: Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
        type: garantiesFinancières.type.type,
        dateÉchéance: garantiesFinancières.estAvecDateÉchéance()
          ? garantiesFinancières.dateÉchéance.formatter()
          : undefined,
        attestation: attestationEtDateConstitution.attestation,
        dateConstitution: attestationEtDateConstitution.dateConstitution,
      }),
      attestation: {
        key: DocumentProjet.bind({
          dateCréation: projet.candidature.notifiéeLe.formatter(),
          format: attestationEtDateConstitution.attestation.format,
          identifiantProjet: identifiantProjet.formatter(),
          typeDocument:
            Lauréat.GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
        }),
        content: attestationEtDateConstitution.attestation.content,
      },
    };
  };
