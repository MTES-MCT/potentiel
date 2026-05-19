import { mediator } from 'mediateur';
import { type NextRequest, NextResponse } from 'next/server';

import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getPériodeAppelOffres } from '@/app/_helpers';
import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getLauréat } from '../../../_helpers/getLauréat';

export const GET = async (
  _: NextRequest,
  ctx: RouteContext<'/laureats/[identifiant]/garanties-financieres/mainlevee/modele-mise-en-demeure'>,
) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const { identifiant } = await ctx.params;
      const identifiantProjetValue = decodeParameter(identifiant);

      const { lauréat, puissance, représentantLégal } = await getLauréat(
        IdentifiantProjet.convertirEnValueType(identifiantProjetValue).formatter(),
      );

      const { appelOffres, période, famille } = await getPériodeAppelOffres(
        IdentifiantProjet.convertirEnValueType(identifiantProjetValue).formatter(),
      );

      const garantiesFinancières =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: {
            identifiantProjetValue,
          },
        });

      const garantieFinanciereEnMoisNumber =
        famille &&
        famille?.garantiesFinancières.soumisAuxGarantiesFinancieres === 'après candidature'
          ? famille.garantiesFinancières.garantieFinanciereEnMois
          : appelOffres.garantiesFinancières.soumisAuxGarantiesFinancieres === 'après candidature'
            ? appelOffres.garantiesFinancières.garantieFinanciereEnMois
            : undefined;

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
      const type = 'mise-en-demeure';
      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type,
        logo,
        data: {
          ...data,
          cahierDesChargesReference: période.cahierDesCharges.référence,
          dateMiseEnDemeure: formatDateForDocument(DateTime.now().date),
          contactDreal: utilisateur.identifiantUtilisateur.email,
          referenceProjet: data.refPotentiel,
          // Attention, launchDate est au format "Avril 2017"
          dateLancementAppelOffre: formatDateForDocument(new Date(appelOffres.launchDate)),

          adresseCompleteProjet: data.adresseCandidat,
          puissanceProjet: data.puissance,
          paragrapheGF:
            appelOffres.garantiesFinancières.renvoiRetraitDesignationGarantieFinancieres,
          garantieFinanciereEnMois: garantieFinanciereEnMoisNumber
            ? garantieFinanciereEnMoisNumber.toString()
            : '!!! garantieFinanciereEnMois non disponible !!!',
          dateFinGarantieFinanciere: garantieFinanciereEnMoisNumber
            ? formatDateForDocument(
                lauréat.notifiéLe.ajouterNombreDeMois(garantieFinanciereEnMoisNumber).date,
              )
            : '!!! dateFinGarantieFinanciere non disponible !!!',
          dateLimiteDepotGF: formatDateForDocument(
            Option.isSome(garantiesFinancières) && garantiesFinancières.dateLimiteSoumission
              ? garantiesFinancières.dateLimiteSoumission.date
              : undefined,
          ),
          // TODO vérifer
          adresseProjet: data.adresseCandidat,
          emailProjet: data.email,
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
