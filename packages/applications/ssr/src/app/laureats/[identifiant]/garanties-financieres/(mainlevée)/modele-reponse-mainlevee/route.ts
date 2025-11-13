import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';

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
import { récuperérerGarantiesFinancièresActuelles } from '../../_helpers/récupérerGarantiesFinancièresActuelles';

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

      const gf = await récuperérerGarantiesFinancièresActuelles(identifiantProjet);

      const mainlevéeEnCours =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterMainlevéeEnCours',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const achèvement =
        await mediator.send<Lauréat.Achèvement.ConsulterAttestationConformitéQuery>({
          type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
          data: {
            identifiantProjetValue,
          },
        });

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
            Option.isSome(gf) ? gf.garantiesFinancières.constitution?.date.date : undefined,
          ),
          estMotifAchèvement: Option.match(mainlevéeEnCours)
            .some(({ motif }) => motif.estProjetAchevé())
            .none(() => false),
          dateTransmissionAuCocontractant: formatDateForDocument(
            Option.isSome(achèvement) ? achèvement.dateTransmissionAuCocontractant.date : undefined,
          ),
          estMotifAbandon: Option.match(mainlevéeEnCours)
            .some(({ motif }) => motif.estProjetAbandonné())
            .none(() => false),
          dateAbandonAccordé: formatDateForDocument(
            Option.isSome(abandon) ? abandon.demande.accord?.accordéLe.date : undefined,
          ),
          estAccordée,
          dateMainlevée: Option.match(mainlevéeEnCours)
            .some(({ demande }) => formatDateForDocument(demande.demandéeLe.date))
            .none(() => formatDateForDocument(undefined)),
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
