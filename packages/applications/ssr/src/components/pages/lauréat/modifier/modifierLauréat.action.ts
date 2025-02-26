'use server';

import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Actionnaire, Lauréat, ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
import {
  modifierLauréatEtCandidatureSchéma,
  PartialModifierCandidatureNotifiéeFormEntries,
  PartialModifierLauréatValueFormEntries,
} from '@/utils/zod/candidature';

export type CorrigerCandidaturesState = FormState;

const schema = modifierLauréatEtCandidatureSchéma;

const action: FormAction<FormState, typeof schema> = async (_, body) =>
  withUtilisateur(async (utilisateur) => {
    const { identifiantProjet, candidature, laureat } = body;

    // astuce pour tout bloquer si le formulaire ne contient pas de modification
    if (!candidature && !laureat) {
      return {
        status: 'domain-error',
        message: 'Le formulaire ne contient pas de modification',
      };
    }

    if (candidature) {
      const candidatureACorriger = await getCandidature(identifiantProjet);

      await mediator.send<Candidature.CorrigerCandidatureUseCase>({
        type: 'Candidature.UseCase.CorrigerCandidature',
        data: {
          ...mapBodyToCandidatureUsecaseData(identifiantProjet, candidature, candidatureACorriger),
          corrigéLe: DateTime.now().formatter(),
          corrigéPar: utilisateur.identifiantUtilisateur.formatter(),
        },
      });
    }

    if (laureat) {
      if (laureat.actionnaire) {
        await mediator.send<Actionnaire.ActionnaireUseCase>({
          type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
            dateModificationValue: new Date().toISOString(),
            raisonValue: '',
            actionnaireValue: laureat.actionnaire,
          },
        });
      }

      if (laureat.nomRepresentantLegal) {
        const représentantLégal =
          await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
            type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
            data: {
              identifiantProjet: identifiantProjet,
            },
          });
        if (Option.isNone(représentantLégal)) {
          getLogger().error("Aucun représentant légal n'a été trouvé pour le lauréat", {
            identifiantProjet,
          });
          return notFound();
        }
        await mediator.send<ReprésentantLégal.ModifierReprésentantLégalUseCase>({
          type: 'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
            dateModificationValue: new Date().toISOString(),
            nomReprésentantLégalValue: laureat.nomRepresentantLegal,
            typeReprésentantLégalValue: représentantLégal.typeReprésentantLégal.formatter(),
          },
        });
      }

      const lauréatAEtéModifié =
        laureat.adresse1 != undefined ||
        laureat.adresse2 != undefined ||
        laureat.nomProjet != undefined ||
        laureat.codePostal != undefined ||
        laureat.commune != undefined ||
        laureat.departement != undefined ||
        laureat.region != undefined;

      if (lauréatAEtéModifié) {
        const lauréatAModifier = await mediator.send<Lauréat.ConsulterLauréatQuery>({
          type: 'Lauréat.Query.ConsulterLauréat',
          data: {
            identifiantProjet,
          },
        });

        if (Option.isNone(lauréatAModifier)) {
          getLogger().error("Aucun lauréat n'a été trouvé", {
            identifiantProjet,
          });
          return notFound();
        }

        await mediator.send<Lauréat.ModifierLauréatUseCase>({
          type: 'Lauréat.UseCase.ModifierLauréat',
          data: {
            ...mapBodyToLauréatUsecaseData(identifiantProjet, laureat, lauréatAModifier),
            modifiéLeValue: DateTime.now().formatter(),
            modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),
          },
        });
      }
    }

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: 'Le projet lauréat a bien été modifié',
      },
    };
  });

export const modifierLauréatAction = formAction(action, modifierLauréatEtCandidatureSchéma);

const mapBodyToCandidatureUsecaseData = (
  identifiantProjet: string,
  data: PartialModifierCandidatureNotifiéeFormEntries,
  previous: Candidature.ConsulterCandidatureReadModel,
): Omit<Candidature.CorrigerCandidatureUseCase['data'], 'corrigéLe' | 'corrigéPar'> => {
  const { appelOffre, période, famille, numéroCRE } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  const localitéValue = {
    adresse1: data.adresse1 ?? previous.localité.adresse1,
    adresse2: data.adresse2 ?? previous.localité.adresse2,
    codePostal: data.codePostal ?? previous.localité.codePostal,
    commune: data.commune ?? previous.localité.commune,
    département: data.departement ?? previous.localité.département,
    région: data.region ?? previous.localité.région,
  };

  return {
    appelOffreValue: appelOffre,
    périodeValue: période,
    familleValue: famille,
    numéroCREValue: numéroCRE,
    nomProjetValue: data.nomProjet ?? previous.nomProjet,
    sociétéMèreValue: data.actionnaire ?? previous.sociétéMère,
    nomReprésentantLégalValue: data.nomRepresentantLegal ?? previous.nomReprésentantLégal,
    technologieValue: data.technologie ?? previous.technologie.formatter(),
    nomCandidatValue: data.nomCandidat ?? previous.nomCandidat,
    puissanceProductionAnnuelleValue:
      data.puissanceProductionAnnuelle ?? previous.puissanceProductionAnnuelle,
    prixReferenceValue: data.prixReference ?? previous.prixReference,
    noteTotaleValue: data.noteTotale ?? previous.noteTotale,
    emailContactValue: data.emailContact ?? previous.emailContact.formatter(),
    localitéValue,
    puissanceALaPointeValue: data.puissanceALaPointe ?? previous.puissanceALaPointe,
    evaluationCarboneSimplifiéeValue:
      data.evaluationCarboneSimplifiee ?? previous.evaluationCarboneSimplifiée,
    actionnariatValue: data.actionnariat ?? previous.actionnariat?.formatter(),
    // non-editable fields
    motifÉliminationValue: previous.motifÉlimination,
    statutValue: previous.statut.formatter(),
    typeGarantiesFinancièresValue: previous.typeGarantiesFinancières?.type,
    dateÉchéanceGfValue: previous.dateÉchéanceGf?.formatter(),
    territoireProjetValue: previous.territoireProjet,
    historiqueAbandonValue: previous.historiqueAbandon.formatter(),
  };
};

const mapBodyToLauréatUsecaseData = (
  identifiantProjet: string,
  data: PartialModifierLauréatValueFormEntries,
  previous: Lauréat.ConsulterLauréatReadModel,
): Omit<Lauréat.ModifierLauréatUseCase['data'], 'modifiéLeValue' | 'modifiéParValue'> => {
  return {
    identifiantProjetValue: identifiantProjet,
    nomProjetValue: data.nomProjet ?? previous.nomProjet,
    localitéValue: {
      adresse1: data.adresse1 ?? previous.localité.adresse1,
      adresse2: data.adresse2 ?? previous.localité.adresse2,
      codePostal: data.codePostal ?? previous.localité.codePostal,
      commune: data.commune ?? previous.localité.commune,
      département: data.departement ?? previous.localité.département,
      région: data.region ?? previous.localité.région,
    },
  };
};
