import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

import { Abandon, Achèvement, GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/projet';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjetValue = decodeParameter(identifiant);
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
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

      const { appelOffres, période } = await getPériodeAppelOffres(identifiantProjet);

      const gf = await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: {
          identifiantProjetValue,
        },
      });

      const mainlevéeEnCours = (
        await mediator.send<GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            estEnCours: true,
          },
        })
      ).items[0];

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
      const type = 'mainlevée';

      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type,
        logo: régionDreal ?? '',
        data: {
          dreal: régionDreal ?? '!!! Région non disponible !!!',
          contactDreal: utilisateur.identifiantUtilisateur.email,

          dateCourrier: formatDateForDocument(DateTime.now().date),
          referenceProjet: formatIdentifiantProjetForDocument(identifiantProjetValue),

          titreAppelOffre: `${période.cahierDesCharges.référence ?? '!!! Cahier des charges non disponible !!!'} ${appelOffres.title}`,
          titrePeriode: période.title,

          nomProjet: candidature.nom,
          nomRepresentantLegal: candidature.candidat.nom,
          adresseProjet: candidature.localité.adresse,
          codePostalProjet: candidature.localité.codePostal,
          communeProjet: candidature.localité.commune,
          emailProjet: candidature.candidat.contact,

          dateConstitutionGarantiesFinancières: formatDateForDocument(
            Option.isSome(gf) ? gf.garantiesFinancières.dateConstitution?.date : undefined,
          ),
          estMotifAchèvement: mainlevéeEnCours ? mainlevéeEnCours.motif.estProjetAchevé() : false,
          dateTransmissionAuCocontractant: formatDateForDocument(
            Option.isSome(achèvement) ? achèvement.dateTransmissionAuCocontractant.date : undefined,
          ),
          estMotifAbandon: mainlevéeEnCours ? mainlevéeEnCours.motif.estProjetAbandonné() : false,
          dateAbandonAccordé: formatDateForDocument(
            Option.isSome(abandon) ? abandon.demande.accord?.accordéLe.date : undefined,
          ),
          estAccordée,
          dateMainlevée: formatDateForDocument(
            mainlevéeEnCours ? mainlevéeEnCours.demande.demandéeLe.date : undefined,
          ),
        },
      });

      return new NextResponse(content, {
        headers: getDocxDocumentHeader({
          identifiantProjet: identifiantProjetValue,
          nomProjet: candidature.nom,
          type,
        }),
      });
    }),
  );
