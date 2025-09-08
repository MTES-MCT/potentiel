import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getPériodeAppelOffres } from '@/app/_helpers';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';

import { getLauréat } from '../../../_helpers/getLauréat';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjetValue = decodeParameter(identifiant);
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
      const estAccordée = request.nextUrl.searchParams.get('estAccordée') === 'true';

      const { lauréat, puissance, représentantLégal } = await getLauréat({
        identifiantProjet: identifiantProjetValue,
      });

      const { appelOffres, période, famille } = await getPériodeAppelOffres(identifiantProjet);

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

      const achèvement =
        await mediator.send<Lauréat.Achèvement.AttestationConformité.ConsulterAttestationConformitéQuery>(
          {
            type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
            data: {
              identifiantProjetValue,
            },
          },
        );

      let abandon: Option.Type<Lauréat.Abandon.ConsulterAbandonReadModel> = Option.none;

      try {
        abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
          type: 'Lauréat.Abandon.Query.ConsulterAbandon',
          data: {
            identifiantProjetValue,
          },
        });
      } catch {}

      const { logo, data } = mapLauréatToModèleRéponsePayload({
        identifiantProjet: identifiantProjetValue,
        lauréat,
        puissance,
        représentantLégal,
        appelOffres,
        période,
        famille,
        utilisateur,
      });

      const type = 'mainlevée';

      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type,
        logo,
        data: {
          ...data,
          cahierDesChargesReference: période.cahierDesCharges.référence,
          contactDreal: utilisateur.identifiantUtilisateur.email,

          dateCourrier: formatDateForDocument(DateTime.now().date),
          referenceProjet: data.refPotentiel,
          adresseProjet: data.adresseCandidat,
          emailProjet: data.email,

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
          nomProjet: lauréat.nomProjet,
          type,
        }),
      });
    }),
  );
