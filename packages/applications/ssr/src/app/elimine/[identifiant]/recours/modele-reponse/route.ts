import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Recours } from '@potentiel-domain/elimine';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { DateTime } from '@potentiel-domain/common';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
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

    const recours = await mediator.send<Recours.ConsulterRecoursQuery>({
      type: 'Éliminé.Recours.Query.ConsulterRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    if (Option.isNone(recours)) {
      return notFound();
    }

    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    if (Option.isNone(appelOffre)) {
      return notFound();
    }

    const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      type: 'recours',
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
        suiviParEmail: appelOffre.dossierSuiviPar,
        titreAppelOffre: appelOffre.title,
        titreFamille: candidature.famille || '',
        titrePeriode:
          appelOffre.periodes.find((période) => période.id === candidature.période)?.title || '',
        unitePuissance: appelOffre.unitePuissance,

        affichageParagrapheECS: appelOffre.affichageParagrapheECS ? 'yes' : '',
        AOInnovation: appelOffre.typeAppelOffre === 'innovation' ? 'yes' : '',
        delaiRealisationTexte: appelOffre.delaiRealisationTexte,
        eolien: appelOffre.typeAppelOffre === 'eolien' ? 'yes' : '',
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
        paragrapheAttestationConformite: appelOffre.paragrapheAttestationConformite,
        paragrapheDelaiDerogatoire: appelOffre.paragrapheDelaiDerogatoire,
        paragrapheEngagementIPFPGPFC: appelOffre.paragrapheEngagementIPFPGPFC,
        paragraphePrixReference: appelOffre.paragraphePrixReference,
        prixReference: candidature.prixReference.toString(),
        renvoiDemandeCompleteRaccordement: appelOffre.renvoiDemandeCompleteRaccordement,
        renvoiModification: appelOffre.renvoiModification,
        renvoiRetraitDesignationGarantieFinancieres:
          appelOffre.renvoiRetraitDesignationGarantieFinancieres,
        renvoiSoumisAuxGarantiesFinancieres: appelOffre.renvoiSoumisAuxGarantiesFinancieres ?? '',
        soumisGF:
          appelOffre.soumisAuxGarantiesFinancieres === 'à la candidature' ||
          appelOffre.soumisAuxGarantiesFinancieres === 'après candidature'
            ? 'yes'
            : '',
        tarifOuPrimeRetenue: appelOffre.tarifOuPrimeRetenue,
      },
    });

    return new Response(content, {
      headers: {
        'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    });
  });
