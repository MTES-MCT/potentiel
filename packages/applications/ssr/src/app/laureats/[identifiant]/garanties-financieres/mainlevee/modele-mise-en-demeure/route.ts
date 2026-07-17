import { mediator } from 'mediateur';
import { type NextRequest, NextResponse } from 'next/server';

import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getLauréatInfos, getPériodeAppelOffres } from '@/app/_helpers';
import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPuissanceInfos, getReprésentantLégalInfos } from '../../../_helpers/getLauréat';

export const GET = async (
  _: NextRequest,
  ctx: RouteContext<'/laureats/[identifiant]/garanties-financieres/mainlevee/modele-mise-en-demeure'>,
) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      if (
        !utilisateur.rôle.aLaPermission('garantiesFinancières.mainlevée.générerModèleMiseEnDemeure')
      ) {
        throw new AccèsFonctionnalitéRefuséError(
          'garantiesFinancières.mainlevée.générerModèleMiseEnDemeure',
          utilisateur.rôle.nom,
        );
      }

      const { identifiant } = await ctx.params;
      const identifiantProjet = decodeParameter(identifiant);

      const lauréat = await getLauréatInfos(identifiantProjet);
      const représentantLégal = await getReprésentantLégalInfos(identifiantProjet);
      const puissance = await getPuissanceInfos(identifiantProjet);

      const { appelOffres, période, famille } = await getPériodeAppelOffres(identifiantProjet);

      const garantiesFinancièresEnAttente =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresEnAttenteQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresEnAttente',
            data: {
              identifiantProjetValue: identifiantProjet,
            },
          },
        );

      const garantieFinanciereEnMoisNumber =
        famille &&
        famille?.garantiesFinancières.soumisAuxGarantiesFinancieres === 'après candidature'
          ? famille.garantiesFinancières.garantieFinanciereEnMois
          : appelOffres.garantiesFinancières.soumisAuxGarantiesFinancieres === 'après candidature'
            ? appelOffres.garantiesFinancières.garantieFinanciereEnMois
            : undefined;

      const { logo, data } = mapLauréatToModèleRéponsePayload({
        identifiantProjet,
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
            Option.isSome(garantiesFinancièresEnAttente) &&
              garantiesFinancièresEnAttente.dateLimiteSoumission
              ? garantiesFinancièresEnAttente.dateLimiteSoumission.date
              : undefined,
          ),
          // TODO vérifer
          adresseProjet: data.adresseCandidat,
          emailProjet: data.email,
        },
      });

      return new NextResponse(content, {
        headers: getDocxDocumentHeader({
          identifiantProjet,
          nomProjet: lauréat.nomProjet,
          type,
        }),
      });
    }),
  );
