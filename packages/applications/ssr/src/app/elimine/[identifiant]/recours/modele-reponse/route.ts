import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Recours } from '@potentiel-domain/elimine';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { DateTime } from '@potentiel-domain/common';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { ModèleRéponseSignée } from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjet = decodeParameter(identifiant);

    const utilisateurDétails = await mediator.send<ConsulterUtilisateurQuery>({
      type: 'Utilisateur.Query.ConsulterUtilisateur',
      data: {
        identifiantUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    if (Option.isNone(utilisateurDétails)) {
      return notFound();
    }

    const { nomComplet } = utilisateurDétails;

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

    const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    if (Option.isNone(appelOffres)) {
      return notFound();
    }

    const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      type: 'recours',
      data: {
        adresseCandidat: candidature.candidat.adressePostale,
        codePostalProjet: candidature.localité.codePostal,
        communeProjet: candidature.localité.commune,
        dateDemande: recours.demande.demandéLe.date.toLocaleDateString('fr-FR'),
        dateNotification: DateTime.convertirEnValueType(
          candidature.dateDésignation,
        ).date.toLocaleDateString('fr-FR'),
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
        suiviPar: nomComplet || '',
        suiviParEmail: appelOffres.dossierSuiviPar,
        titreAppelOffre: appelOffres.title,
        titreFamille: candidature.famille || '',
        titrePeriode:
          appelOffres.periodes.find((période) => période.id === candidature.période)?.title || '',
        unitePuissance: appelOffres.unitePuissance,
      },
    });

    return new Response(content, {
      headers: {
        'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    });
  });
