import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPériodeAppelOffres, getCandidature } from '@/app/_helpers';
import { formatBoolean } from '@/utils/modèle-document/formatBoolean';
import { mapCandidatureToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjetValue = decodeParameter(identifiant);
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const candidature = await getCandidature(identifiantProjetValue);

      const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterRecours',
        data: {
          identifiantProjetValue,
        },
      });

      if (Option.isNone(recours)) {
        return notFound();
      }
      const { appelOffres, période, famille } = await getPériodeAppelOffres(identifiantProjet);

      const { logo, data } = mapCandidatureToModèleRéponsePayload({
        identifiantProjet: identifiantProjetValue,
        candidature,
        appelOffres,
        période,
        famille,
        utilisateur,
      });

      const type = 'recours';

      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type,
        logo,
        data: {
          ...data,

          dateDemande: formatDateForDocument(recours.demande.demandéLe.date),
          justificationDemande: recours.demande.raison,
          status: recours.statut.value,

          affichageParagrapheECS: formatBoolean(appelOffres.affichageParagrapheECS),
          AOInnovation: formatBoolean(appelOffres.typeAppelOffre === 'innovation'),
          delaiRealisationTexte: appelOffres.delaiRealisationTexte,
          eolien: formatBoolean(appelOffres.typeAppelOffre === 'eolien'),
          isInvestissementParticipatif: formatBoolean(
            candidature.actionnariat?.estInvestissementParticipatif(),
          ),
          isEngagementParticipatif: formatBoolean(
            candidature.actionnariat?.estFinancementParticipatif() ||
              candidature.actionnariat?.estInvestissementParticipatif(),
          ),
          isFinancementCollectif: formatBoolean(
            candidature.actionnariat?.estFinancementCollectif(),
          ),
          isFinancementParticipatif: formatBoolean(
            candidature.actionnariat?.estFinancementParticipatif(),
          ),
          isGouvernancePartagée: formatBoolean(candidature.actionnariat?.estGouvernancePartagée()),
          evaluationCarbone: candidature.evaluationCarboneSimplifiée.toString(),
          engagementFournitureDePuissanceAlaPointe: formatBoolean(candidature.puissanceALaPointe),
          motifsElimination: candidature.motifÉlimination ?? '',
          nonInstruit: formatBoolean(
            candidature.motifÉlimination?.toLowerCase().includes('non instruit'),
          ),
          paragrapheAttestationConformite: appelOffres.paragrapheAttestationConformite,
          paragrapheDelaiDerogatoire: appelOffres.paragrapheDelaiDerogatoire,
          paragrapheEngagementIPFPGPFC:
            période.paragrapheEngagementIPFPGPFC ?? appelOffres.paragrapheEngagementIPFPGPFC,
          paragraphePrixReference: appelOffres.paragraphePrixReference,
          prixReference: candidature.prixReference.toString(),
          renvoiDemandeCompleteRaccordement: appelOffres.renvoiDemandeCompleteRaccordement,
          renvoiModification: appelOffres.renvoiModification,
          renvoiRetraitDesignationGarantieFinancieres:
            appelOffres.renvoiRetraitDesignationGarantieFinancieres,
          renvoiSoumisAuxGarantiesFinancieres:
            appelOffres.garenvoiSoumisAuxGarantiesFinancieres ?? '',
          soumisGF: formatBoolean(
            GarantiesFinancières.appelOffreSoumisAuxGarantiesFinancières({
              appelOffre: appelOffres,
              période: identifiantProjet.appelOffre,
            }),
          ),
          tarifOuPrimeRetenue: appelOffres.tarifOuPrimeRetenue,
        },
      });

      return new Response(content, {
        headers: getDocxDocumentHeader({
          identifiantProjet: identifiantProjetValue,
          nomProjet: candidature.nomProjet,
          type,
        }),
      });
    }),
  );
