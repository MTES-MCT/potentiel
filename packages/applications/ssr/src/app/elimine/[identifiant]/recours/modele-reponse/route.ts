import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Candidature } from '@potentiel-domain/candidature';
import { DateTime } from '@potentiel-domain/common';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const candidature = await mediator.send<Candidature.ConsulterProjetQuery>({
        type: 'Candidature.Query.ConsulterProjet',
        data: {
          identifiantProjet,
        },
      });

      if (Option.isNone(candidature)) {
        return notFound();
      }

      const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterRecours',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(recours)) {
        return notFound();
      }
      const { appelOffres, période } = await getPériodeAppelOffres(
        IdentifiantProjet.convertirEnValueType(identifiantProjet),
      );

      const type = 'recours';

      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type,
        data: {
          adresseCandidat: candidature.candidat.adressePostale,
          codePostalProjet: candidature.localité.codePostal,
          communeProjet: candidature.localité.commune,
          dateDemande: formatDateForDocument(recours.demande.demandéLe.date),
          dateNotification: formatDateForDocument(
            DateTime.convertirEnValueType(candidature.dateDésignation).date,
          ),
          dreal: candidature.localité.région,
          email: '',
          familles: candidature.famille ? 'yes' : '',
          justificationDemande: recours.demande.raison,
          nomCandidat: candidature.candidat.nom,
          nomProjet: candidature.nom,
          nomRepresentantLegal: candidature.candidat.représentantLégal,
          puissance: candidature.puissance.toString(),
          refPotentiel: formatIdentifiantProjetForDocument(identifiantProjet),
          status: recours.statut.value,
          suiviPar: utilisateur.nom,
          suiviParEmail: appelOffres.dossierSuiviPar,
          titreAppelOffre: appelOffres.title,
          titreFamille: candidature.famille || '',
          titrePeriode: période.title || '',
          unitePuissance: appelOffres.unitePuissance,

          affichageParagrapheECS: appelOffres.affichageParagrapheECS ? 'yes' : '',
          AOInnovation: appelOffres.typeAppelOffre === 'innovation' ? 'yes' : '',
          delaiRealisationTexte: appelOffres.delaiRealisationTexte,
          eolien: appelOffres.typeAppelOffre === 'eolien' ? 'yes' : '',
          isInvestissementParticipatif: candidature.isInvestissementParticipatif ? 'yes' : '',
          isEngagementParticipatif:
            candidature.isFinancementParticipatif || candidature.isInvestissementParticipatif
              ? 'yes'
              : '',
          isFinancementCollectif: candidature.actionnariat === 'financement-collectif' ? 'yes' : '',
          isFinancementParticipatif: candidature.isFinancementParticipatif ? 'yes' : '',
          isGouvernancePartagée: candidature.actionnariat === 'gouvernance-partagee' ? 'yes' : '',
          evaluationCarbone: candidature.evaluationCarbone.toString(),
          engagementFournitureDePuissanceAlaPointe:
            candidature.engagementFournitureDePuissanceAlaPointe ? 'yes' : '',
          motifsElimination: candidature.motifsElimination,
          nonInstruit: candidature.motifsElimination.toLowerCase().includes('non instruit')
            ? 'yes'
            : '',
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
            appelOffres.renvoiSoumisAuxGarantiesFinancieres ?? '',
          soumisGF:
            appelOffres.soumisAuxGarantiesFinancieres === 'à la candidature' ||
            appelOffres.soumisAuxGarantiesFinancieres === 'après candidature'
              ? 'yes'
              : '',
          tarifOuPrimeRetenue: appelOffres.tarifOuPrimeRetenue,
        },
      });

      return new Response(content, {
        headers: getDocxDocumentHeader({ identifiantProjet, nomProjet: candidature.nom, type }),
      });
    }),
  );
