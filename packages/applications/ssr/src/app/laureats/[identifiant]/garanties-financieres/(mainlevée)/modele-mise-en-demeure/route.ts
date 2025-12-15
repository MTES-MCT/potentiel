import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';

import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import {
  ModèleRéponseSignée,
  formatDateForDocument,
} from '@potentiel-applications/document-builder';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPériodeAppelOffres } from '@/app/_helpers';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';

import { getLauréat } from '../../../_helpers/getLauréat';

export const GET = async (_: NextRequest, { params: { identifiant } }: IdentifiantParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjetValue = decodeParameter(identifiant);

      const { lauréat, puissance, représentantLégal } = await getLauréat(
        IdentifiantProjet.convertirEnValueType(identifiantProjetValue).formatter(),
      );

      const { appelOffres, période, famille } = await getPériodeAppelOffres(
        IdentifiantProjet.convertirEnValueType(identifiantProjetValue).formatter(),
      );

      const projetAvecGarantiesFinancièresEnAttente =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresEnAttenteQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresEnAttente',
            data: { identifiantProjetValue },
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
            Option.isSome(projetAvecGarantiesFinancièresEnAttente)
              ? projetAvecGarantiesFinancièresEnAttente.dateLimiteSoumission.date
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
