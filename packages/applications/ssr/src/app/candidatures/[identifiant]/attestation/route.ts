import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { buildCertificate } from '@potentiel-applications/document-builder';
import { ConsulterUtilisateurQuery, Role } from '@potentiel-domain/utilisateur';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

// TODO supprimer cette route, cette action doit être faite lors de la désignation
export const GET = (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  withUtilisateur(async ({ identifiantUtilisateur, role }) => {
    const identifiantProjet = decodeParameter(identifiant);
    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

    if (Option.isNone(candidature)) {
      return notFound();
    }

    const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.identifiantProjet.appelOffre },
    });

    if (Option.isNone(appelOffres)) {
      return notFound();
    }

    const période = appelOffres.periodes.find(
      (x) => x.id === candidature.identifiantProjet.période,
    );
    if (!période) {
      return notFound();
    }
    if (période?.type !== 'notified') {
      return notFound();
    }

    const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
      type: 'Utilisateur.Query.ConsulterUtilisateur',
      data: {
        identifiantUtilisateur: identifiantUtilisateur.email,
      },
    });
    if (Option.isNone(utilisateur)) {
      return notFound();
    }

    const famille = période.familles.find((x) => x.id === candidature.identifiantProjet.famille);
    const content = await buildCertificate({
      template: période.certificateTemplate,
      validateur: role.estÉgaleÀ(Role.dgecValidateur)
        ? {
            fullName: utilisateur.nomComplet,
            fonction: utilisateur.fonction,
          }
        : {
            fullName: '[Nom du signataire]',
            fonction: '[Intitulé de la fonction du signataire]',
          },
      data: {
        appelOffre: appelOffres,
        période,
        famille,

        isClasse: candidature.statut.estClassé(),
        potentielId: candidature.identifiantProjet.formatter().replaceAll('#', '-'),

        nomProjet: candidature.nomProjet,
        adresseProjet: [candidature.localité.adresse1, candidature.localité.adresse2]
          .filter(Boolean)
          .join('\n'),
        codePostalProjet: candidature.localité.codePostal,
        communeProjet: candidature.localité.commune,

        nomCandidat: candidature.nomCandidat,
        nomRepresentantLegal: candidature.nomReprésentantLégal,
        email: candidature.emailContact,

        evaluationCarbone: candidature.evaluationCarboneSimplifiée,
        prixReference: candidature.prixReference,
        puissance: candidature.puissanceProductionAnnuelle,
        technologie: candidature.technologie.type,
        engagementFournitureDePuissanceAlaPointe: candidature.puissanceALaPointe,
        isFinancementParticipatif: candidature.financementParticipatif,

        motifsElimination: candidature.motifÉlimination,
        note: candidature.noteTotale,

        notifiedOn: 0, // TODO
        isInvestissementParticipatif: false, // TODO
        territoireProjet: 'N/A', // TODO
        // actionnariat:
        // désignationCatégorie
      },
    });

    return new Response(content, {
      headers: {
        'content-type': 'application/pdf',
      },
    });
  });
