import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';

import { Abandon, Achèvement, GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { buildDocxDocument } from '@potentiel-applications/document-builder';
import { récupérerRégionDrealAdapter } from '@potentiel-infrastructure/domain-adapters';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjetValue = decodeParameter(identifiant);

    const régionDreal = await récupérerRégionDrealAdapter(
      utilisateur.identifiantUtilisateur.formatter(),
    );

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet: identifiantProjetValue,
      },
    });

    const appelOffres = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

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

    const content = await buildDocxDocument({
      type: 'mainlevée',
      logo: Option.match(régionDreal)
        .some(({ région }) => région)
        .none(() => ''),
      data: {
        dreal: Option.match(régionDreal)
          .some(({ région }) => région)
          .none(() => '!!! Région non disponible !!!'),
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
              ? gf.garantiesFinancières.dateConstitution.date.toLocaleDateString()
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
          .some(({ accord }) =>
            accord ? accord.accordéLe.date.toLocaleDateString('fr-FR') : 'JJ/MM/AAAA',
          )
          .none(() => 'JJ/MM/AAAA'),

        statutMainlevée: Option.match(mainlevée)
          .some(({ statut }) => statut.statut.toString())
          .none(() => '!!! Pas de statut pour la mainlevée !!!'),
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
