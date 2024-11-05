import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

import { Abandon, Achèvement, GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { DateTime } from '@potentiel-domain/common';
import { ModèleRéponseSignée } from '@potentiel-applications/document-builder';

import { decodeParameter } from '@/utils/decodeParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjetValue = decodeParameter(identifiant);
    const estAccordée = request.nextUrl.searchParams.get('estAccordée') === 'true';

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

    const gf = await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
      data: {
        identifiantProjetValue,
      },
    });

    const mainlevée =
      await mediator.send<GarantiesFinancières.ConsulterDemandeMainlevéeGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
        data: {
          identifiantProjetValue,
        },
      });

    const achèvement = await mediator.send<Achèvement.ConsulterAttestationConformitéQuery>({
      type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
      data: {
        identifiantProjetValue,
      },
    });

    let abandon: Option.Type<Abandon.ConsulterAbandonReadModel> = Option.none;
    try {
      abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'Lauréat.Abandon.Query.ConsulterAbandon',
        data: {
          identifiantProjetValue,
        },
      });
    } catch {}

    const régionDreal = await getRégionUtilisateur(utilisateur);

    const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      type: 'mainlevée',
      logo: régionDreal ?? '',
      data: {
        dreal: régionDreal ?? '!!! Région non disponible !!!',
        contactDreal: utilisateur.identifiantUtilisateur.email,

        dateCourrier: DateTime.now().date.toLocaleDateString('fr-FR'),
        referenceProjet: formatIdentifiantProjetForDocument(identifiantProjetValue),

        titreAppelOffre: `${détailPériode?.cahierDesCharges.référence ?? '!!! Cahier des charges non disponible !!!'} ${appelOffres.title}`,
        titrePeriode: détailPériode?.title ?? '!!! Titre de période non disponible !!!',

        nomProjet: candidature.nom,
        nomRepresentantLegal: candidature.candidat.nom,
        adresseProjet: candidature.localité.adresse,
        codePostalProjet: candidature.localité.codePostal,
        communeProjet: candidature.localité.commune,
        emailProjet: candidature.candidat.contact,

        dateConstitutionGarantiesFinancières: Option.match(gf)
          .some((gf) =>
            gf.garantiesFinancières.dateConstitution
              ? gf.garantiesFinancières.dateConstitution.date.toLocaleDateString('fr-FR')
              : 'JJ/MM/AAAA',
          )
          .none(() => 'JJ/MM/AAAA'),

        estMotifAchèvement: Option.match(mainlevée)
          .some(({ motif }) => motif.estProjetAchevé())
          .none(() => false),
        dateTransmissionAuCocontractant: Option.match(achèvement)
          .some(({ dateTransmissionAuCocontractant }) =>
            dateTransmissionAuCocontractant.date.toLocaleDateString('fr-FR'),
          )
          .none(() => 'JJ/MM/AAAA'),

        estMotifAbandon: Option.match(mainlevée)
          .some(({ motif }) => motif.estProjetAbandonné())
          .none(() => false),
        dateAbandonAccordé: Option.match(abandon)
          .some(({ demande: { accord } }) =>
            accord ? accord.accordéLe.date.toLocaleDateString('fr-FR') : 'JJ/MM/AAAA',
          )
          .none(() => 'JJ/MM/AAAA'),

        estAccordée,
        dateMainlevée: Option.match(mainlevée)
          .some(({ demande: { demandéeLe } }) => demandéeLe.date.toLocaleDateString('fr-FR'))
          .none(() => '!!! Pas de statut pour la mainlevée !!!'),
      },
    });

    return new NextResponse(content, {
      headers: {
        'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    });
  });
