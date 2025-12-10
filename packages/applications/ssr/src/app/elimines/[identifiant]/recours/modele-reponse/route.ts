import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, Lauréat, Éliminé } from '@potentiel-domain/projet';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPériodeAppelOffres, getCandidature } from '@/app/_helpers';
import { formatBoolean } from '@/utils/modèle-document/formatBoolean';
import { mapCandidatureToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';

export const GET = async (
  _: Request,
  {
    params: { identifiant, date },
  }: {
    params: {
      identifiant: string;
      date: string;
    };
  },
) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
      const dateDemande = DateTime.convertirEnValueType(decodeParameter(date)).formatter();

      const candidature = await getCandidature(identifiantProjet.formatter());

      const recours = await mediator.send<Éliminé.Recours.ConsulterDemandeRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterDemandeRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateDemandeValue: dateDemande,
        },
      });

      if (Option.isNone(recours)) {
        return notFound();
      }
      const { appelOffres, période, famille } = await getPériodeAppelOffres(identifiantProjet);

      const { logo, data } = mapCandidatureToModèleRéponsePayload({
        identifiantProjet: identifiantProjet.formatter(),
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
            candidature.dépôt.actionnariat?.estInvestissementParticipatif(),
          ),
          isEngagementParticipatif: formatBoolean(
            candidature.dépôt.actionnariat?.estFinancementParticipatif() ||
              candidature.dépôt.actionnariat?.estInvestissementParticipatif(),
          ),
          isFinancementCollectif: formatBoolean(
            candidature.dépôt.actionnariat?.estFinancementCollectif(),
          ),
          isFinancementParticipatif: formatBoolean(
            candidature.dépôt.actionnariat?.estFinancementParticipatif(),
          ),
          isGouvernancePartagée: formatBoolean(
            candidature.dépôt.actionnariat?.estGouvernancePartagée(),
          ),
          evaluationCarbone: candidature.dépôt.evaluationCarboneSimplifiée.toString(),
          engagementFournitureDePuissanceAlaPointe: formatBoolean(
            candidature.dépôt.puissanceALaPointe,
          ),
          motifsElimination: candidature.instruction.motifÉlimination ?? '',
          nonInstruit: formatBoolean(
            candidature.instruction.motifÉlimination?.toLowerCase().includes('non instruit'),
          ),
          paragrapheAttestationConformite: appelOffres.paragrapheAttestationConformite,
          paragrapheDelaiDerogatoire: appelOffres.paragrapheDelaiDerogatoire,
          paragrapheEngagementIPFPGPFC:
            période.paragrapheEngagementIPFPGPFC ?? appelOffres.paragrapheEngagementIPFPGPFC,
          paragraphePrixReference: appelOffres.paragraphePrixReference,
          prixReference: candidature.dépôt.prixReference.toString(),
          renvoiDemandeCompleteRaccordement: appelOffres.renvoiDemandeCompleteRaccordement,
          renvoiModification: appelOffres.renvoiModification,
          renvoiRetraitDesignationGarantieFinancieres:
            appelOffres.garantiesFinancières.renvoiRetraitDesignationGarantieFinancieres,
          renvoiSoumisAuxGarantiesFinancieres:
            appelOffres.garantiesFinancières.renvoiSoumisAuxGarantiesFinancieres ?? '',
          soumisGF: formatBoolean(
            Lauréat.GarantiesFinancières.appelOffreSoumisAuxGarantiesFinancières({
              appelOffre: appelOffres,
              période: identifiantProjet.appelOffre,
            }),
          ),
          tarifOuPrimeRetenue: appelOffres.tarifOuPrimeRetenue,
        },
      });

      return new Response(content, {
        headers: getDocxDocumentHeader({
          identifiantProjet: identifiantProjet.formatter(),
          nomProjet: candidature.dépôt.nomProjet,
          type,
        }),
      });
    }),
  );
