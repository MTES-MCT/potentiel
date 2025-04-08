import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
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
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
  apiAction(() =>
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

      const régionDreal = await getRégionUtilisateur(utilisateur);

      const garantieFinanciereEnMoisNumber =
        famille && famille?.soumisAuxGarantiesFinancieres === 'après candidature'
          ? famille.garantieFinanciereEnMois
          : appelOffres.soumisAuxGarantiesFinancieres === 'après candidature'
            ? appelOffres.garantieFinanciereEnMois
            : undefined;

      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type: 'mise-en-demeure',
        logo: régionDreal ?? 'none',
        data: {
          dreal: régionDreal ?? '!!! Région non disponible !!!',
          dateMiseEnDemeure: formatDateForDocument(DateTime.now().date),
          contactDreal: utilisateur.identifiantUtilisateur.email,
          referenceProjet: formatIdentifiantProjetForDocument(identifiantProjetValue),
          titreAppelOffre: `${période?.cahierDesCharges.référence ?? '!!! Cahier des charges non disponible !!!'} ${appelOffres.title}`,
          // Attention, launchDate est au format "Avril 2017"
          dateLancementAppelOffre: formatDateForDocument(new Date(appelOffres.launchDate)),
          nomProjet: candidature.nom,
          adresseCompleteProjet: `${candidature.localité.adresse} ${candidature.localité.codePostal} ${candidature.localité.commune}`,
          puissanceProjet: candidature.puissance.toString(),
          unitePuissance: appelOffres.unitePuissance,
          titrePeriode: période.title,
          dateNotification: formatDateForDocument(
            DateTime.convertirEnValueType(candidature.dateDésignation).date,
          ),
          paragrapheGF: appelOffres.renvoiRetraitDesignationGarantieFinancieres,
          garantieFinanciereEnMois: garantieFinanciereEnMoisNumber
            ? garantieFinanciereEnMoisNumber.toString()
            : '!!! garantieFinanciereEnMois non disponible !!!',
          dateFinGarantieFinanciere: garantieFinanciereEnMoisNumber
            ? formatDateForDocument(
                DateTime.convertirEnValueType(candidature.dateDésignation).ajouterNombreDeMois(
                  garantieFinanciereEnMoisNumber,
                ).date,
              )
            : '!!! dateFinGarantieFinanciere non disponible !!!',
          dateLimiteDepotGF: formatDateForDocument(
            Option.isSome(projetAvecGarantiesFinancièresEnAttente)
              ? projetAvecGarantiesFinancièresEnAttente.dateLimiteSoumission.date
              : undefined,
          ),
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
    }),
  );
