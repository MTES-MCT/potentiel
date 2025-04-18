import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import {
  ModèleRéponseSignée,
  formatDateForDocument,
} from '@potentiel-applications/document-builder';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
import { mapToModelePayload } from '@/utils/modèle-document/mapToModelePayload';

import { getLauréat } from '../../_helpers/getLauréat';

export const GET = async (_: NextRequest, { params: { identifiant } }: IdentifiantParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjetValue = decodeParameter(identifiant);

      const { lauréat, puissance, représentantLégal } = await getLauréat({
        identifiantProjet: identifiantProjetValue,
      });
      const candidature = await getCandidature(identifiantProjetValue);

      const { appelOffres, période, famille } = await getPériodeAppelOffres(
        IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
      );

      const projetAvecGarantiesFinancièresEnAttente =
        await mediator.send<GarantiesFinancières.ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
            data: { identifiantProjetValue },
          },
        );

      const garantieFinanciereEnMoisNumber =
        famille && famille?.soumisAuxGarantiesFinancieres === 'après candidature'
          ? famille.garantieFinanciereEnMois
          : appelOffres.soumisAuxGarantiesFinancieres === 'après candidature'
            ? appelOffres.garantieFinanciereEnMois
            : undefined;

      const { logo, data } = mapToModelePayload({
        identifiantProjet: identifiantProjetValue,
        lauréat,
        puissance,
        représentantLégal,
        candidature,
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
          dateMiseEnDemeure: formatDateForDocument(DateTime.now().date),
          contactDreal: utilisateur.identifiantUtilisateur.email,
          referenceProjet: data.refPotentiel,
          // Attention, launchDate est au format "Avril 2017"
          dateLancementAppelOffre: formatDateForDocument(new Date(appelOffres.launchDate)),

          adresseCompleteProjet: data.adresseCandidat,
          puissanceProjet: data.puissance,
          paragrapheGF: appelOffres.renvoiRetraitDesignationGarantieFinancieres,
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
