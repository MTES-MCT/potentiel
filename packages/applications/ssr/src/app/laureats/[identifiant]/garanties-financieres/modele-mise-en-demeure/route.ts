import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { DateTime } from '@potentiel-domain/common';
import { ModèleRéponseSignée } from '@potentiel-applications/document-builder';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjetValue = decodeParameter(identifiant);

    const candidature = await mediator.send<Candidature.ConsulterProjetQuery>({
      type: 'Candidature.Query.ConsulterProjet',
      data: {
        identifiantProjet: identifiantProjetValue,
      },
    });

    if (Option.isNone(candidature)) {
      return notFound();
    }

    const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    if (Option.isNone(appelOffres)) {
      return notFound();
    }

    const détailPériode = appelOffres.periodes.find(
      (période) => période.id === candidature.période,
    );

    const détailFamille = détailPériode?.familles.find((f) => f.id === candidature.famille);

    const projetAvecGarantiesFinancièresEnAttente =
      await mediator.send<GarantiesFinancières.ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery>(
        {
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
          data: { identifiantProjetValue },
        },
      );

    const régionDreal = await getRégionUtilisateur(utilisateur);

    const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      type: 'mise-en-demeure',
      logo: régionDreal ?? 'none',
      data: {
        dreal: régionDreal ?? '!!! Région non disponible !!!',
        dateMiseEnDemeure: DateTime.now().date.toLocaleDateString('fr-FR'),
        contactDreal: utilisateur.identifiantUtilisateur.email,
        referenceProjet: formatIdentifiantProjetForDocument(identifiantProjetValue),
        titreAppelOffre: `${détailPériode?.cahierDesCharges.référence ?? '!!! Cahier des charges non disponible !!!'} ${appelOffres.title}`,
        // Attention, launchDate est au format "Avril 2017"
        dateLancementAppelOffre: new Date(appelOffres.launchDate).toLocaleDateString('fr-FR'),
        nomProjet: candidature.nom,
        adresseCompleteProjet: `${candidature.localité.adresse} ${candidature.localité.codePostal} ${candidature.localité.commune}`,
        puissanceProjet: candidature.puissance.toString(),
        unitePuissance: appelOffres.unitePuissance,
        titrePeriode: détailPériode?.title ?? '!!! Titre de période non disponible !!!',
        dateNotification: DateTime.convertirEnValueType(
          candidature.dateDésignation,
        ).date.toLocaleDateString('fr-FR'),
        paragrapheGF: appelOffres.renvoiRetraitDesignationGarantieFinancieres,
        garantieFinanciereEnMois:
          détailFamille && détailFamille?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? détailFamille.garantieFinanciereEnMois.toString()
            : appelOffres.soumisAuxGarantiesFinancieres === 'après candidature'
              ? appelOffres.garantieFinanciereEnMois.toString()
              : '!!! garantieFinanciereEnMois non disponible !!!',
        dateFinGarantieFinanciere:
          détailFamille && détailFamille?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? DateTime.convertirEnValueType(candidature.dateDésignation)
                .ajouterNombreDeMois(détailFamille.garantieFinanciereEnMois)
                .date.toLocaleDateString('fr-FR')
            : appelOffres.soumisAuxGarantiesFinancieres === 'après candidature'
              ? DateTime.convertirEnValueType(candidature.dateDésignation)
                  .ajouterNombreDeMois(appelOffres.garantieFinanciereEnMois)
                  .date.toLocaleDateString('fr-FR')
              : 'JJ/MM/AAAA',
        dateLimiteDepotGF: Option.isSome(projetAvecGarantiesFinancièresEnAttente)
          ? projetAvecGarantiesFinancièresEnAttente.dateLimiteSoumission.date.toLocaleDateString(
              'fr-FR',
            )
          : 'JJ/MM/AAAA',
        nomRepresentantLegal: candidature.candidat.nom,
        adresseProjet: candidature.candidat.adressePostale,
        codePostalProjet: candidature.localité.codePostal,
        communeProjet: candidature.localité.commune,
        emailProjet: candidature.candidat.contact,
      },
    });

    return new NextResponse(content, {
      headers: {
        'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    });
  });
