import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { buildCertificate } from '@potentiel-applications/document-builder';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const GET = (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  withUtilisateur(async (utilisateur) => {
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

    const famille = période.familles.find((x) => x.id === candidature.identifiantProjet.famille);
    const content = await buildCertificate({
      template: période.certificateTemplate,
      validateur: utilisateur.role.estÉgaleÀ(Role.dgecValidateur)
        ? {
            fullName: utilisateur.nom,
            fonction: 'TODO', // TODO
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
        adresseProjet: candidature.adresse1, // TODO adresse 2 ?
        codePostalProjet: candidature.codePostal,
        communeProjet: candidature.commune,

        nomCandidat: candidature.nomCandidat,
        nomRepresentantLegal: candidature.nomReprésentantLégal,
        email: candidature.emailContact,

        evaluationCarbone: candidature.valeurÉvaluationCarbone ?? 0, //  TODO evaluationCarboneSimplifiée??
        prixReference: candidature.prixReference,
        puissance: candidature.puissanceProductionAnnuelle,
        technologie: candidature.technologie.type,
        engagementFournitureDePuissanceAlaPointe: candidature.puissanceALaPointe,
        isFinancementParticipatif: candidature.financementParticipatif,
        isInvestissementParticipatif: false, // TODO

        motifsElimination: candidature.motifÉlimination,
        note: candidature.noteTotale,
        territoireProjet: 'N/A', // TODO
        notifiedOn: 0, // TODO
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
