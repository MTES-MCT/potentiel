'use server';

import { mediator } from 'mediateur';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCandidature } from '@/app/_helpers';
import {
  modifierLauréatEtCandidatureSchéma,
  PartialModifierCandidatureNotifiéeFormEntries,
  PartialModifierLauréatValueFormEntries,
} from '@/utils/candidature';
import {
  getLauréatInfos,
  getReprésentantLégalInfos,
} from '@/app/laureats/[identifiant]/_helpers/getLauréat';

export type CorrigerCandidaturesState = FormState;

const schema = modifierLauréatEtCandidatureSchéma;

const action: FormAction<FormState, typeof schema> = async (_, body) =>
  withUtilisateur(async (utilisateur) => {
    const { identifiantProjet, candidature, laureat, doitRegenererAttestation } = body;

    if (candidature) {
      const candidatureACorriger = await getCandidature(identifiantProjet);

      await mediator.send<Candidature.CorrigerCandidatureUseCase>({
        type: 'Candidature.UseCase.CorrigerCandidature',
        data: {
          ...mapBodyToCandidatureUsecaseData(
            identifiantProjet,
            candidature,
            candidatureACorriger,
            doitRegenererAttestation,
          ),
          corrigéLe: DateTime.now().formatter(),
          corrigéPar: utilisateur.identifiantUtilisateur.formatter(),
        },
      });
    }

    if (laureat) {
      if (laureat.actionnaire) {
        await mediator.send<Lauréat.Actionnaire.ActionnaireUseCase>({
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
        const représentantLégal = await getReprésentantLégalInfos({ identifiantProjet });

        await mediator.send<Lauréat.ReprésentantLégal.ModifierReprésentantLégalUseCase>({
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

      if (laureat.puissanceProductionAnnuelle) {
        await mediator.send<Lauréat.Puissance.ModifierPuissanceUseCase>({
          type: 'Lauréat.Puissance.UseCase.ModifierPuissance',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
            dateModificationValue: new Date().toISOString(),
            puissanceValue: laureat.puissanceProductionAnnuelle,
          },
        });
      }

      if (laureat.nomCandidat) {
        await mediator.send<Lauréat.Producteur.ModifierProducteurUseCase>({
          type: 'Lauréat.Producteur.UseCase.ModifierProducteur',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
            dateModificationValue: new Date().toISOString(),
            producteurValue: laureat.nomCandidat,
          },
        });
      }

      if (laureat.evaluationCarboneSimplifiee) {
        await mediator.send<Lauréat.Fournisseur.ModifierÉvaluationCarboneUseCase>({
          type: 'Lauréat.Fournisseur.UseCase.ModifierÉvaluationCarbone',
          data: {
            identifiantProjetValue: identifiantProjet,
            évaluationCarboneSimplifiéeValue: laureat.evaluationCarboneSimplifiee,
            modifiéeLeValue: new Date().toISOString(),
            modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
          },
        });
      }

      if (laureat.installateur) {
        await mediator.send<Lauréat.Installateur.ModifierInstallateurUseCase>({
          type: 'Lauréat.Installateur.UseCase.ModifierInstallateur',
          data: {
            identifiantProjetValue: identifiantProjet,
            installateurValue: laureat.installateur,
            dateModificationValue: new Date().toISOString(),
            identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
          },
        });
      }
      if (laureat.installationAvecDispositifDeStockage !== undefined) {
        await mediator.send<Lauréat.InstallationAvecDispositifDeStockage.ModifierInstallationAvecDispositifDeStockageUseCase>(
          {
            type: 'Lauréat.InstallationAvecDispositifDeStockage.UseCase.ModifierInstallationAvecDispositifDeStockage',
            data: {
              identifiantProjetValue: identifiantProjet,
              installationAvecDispositifDeStockageValue:
                laureat.installationAvecDispositifDeStockage,
              modifiéeLeValue: new Date().toISOString(),
              modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
            },
          },
        );
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
        const lauréatAModifier = await getLauréatInfos({ identifiantProjet });

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
  { dépôt: previous, instruction }: Candidature.ConsulterCandidatureReadModel,
  doitRegenererAttestation?: boolean,
): Omit<Candidature.CorrigerCandidatureUseCase['data'], 'corrigéLe' | 'corrigéPar'> => {
  const localitéValue = {
    adresse1: data.adresse1 ?? previous.localité.adresse1,
    adresse2: data.adresse2 ?? previous.localité.adresse2,
    codePostal: data.codePostal ?? previous.localité.codePostal,
    commune: data.commune ?? previous.localité.commune,
    département: data.departement ?? previous.localité.département,
    région: data.region ?? previous.localité.région,
  };

  return {
    identifiantProjetValue: identifiantProjet,
    instructionValue: {
      motifÉlimination: instruction.motifÉlimination,
      statut: instruction.statut.formatter(),
      noteTotale: data.noteTotale ?? instruction.noteTotale,
    },
    dépôtValue: {
      nomProjet: data.nomProjet ?? previous.nomProjet,
      sociétéMère: data.actionnaire ?? previous.sociétéMère,
      nomReprésentantLégal: data.nomRepresentantLegal ?? previous.nomReprésentantLégal,
      technologie: data.technologie ?? previous.technologie.formatter(),
      nomCandidat: data.nomCandidat ?? previous.nomCandidat,
      puissanceProductionAnnuelle:
        data.puissanceProductionAnnuelle ?? previous.puissanceProductionAnnuelle,
      prixReference: data.prixReference ?? previous.prixReference,
      emailContact: data.emailContact ?? previous.emailContact.formatter(),
      localité: localitéValue,
      puissanceALaPointe: data.puissanceALaPointe ?? previous.puissanceALaPointe,
      evaluationCarboneSimplifiée:
        data.evaluationCarboneSimplifiee ?? previous.evaluationCarboneSimplifiée,
      actionnariat: data.actionnariat ?? previous.actionnariat?.formatter(),
      coefficientKChoisi: data.coefficientKChoisi ?? previous.coefficientKChoisi,
      puissanceDeSite: data.puissanceDeSite ?? previous.puissanceDeSite,
      autorisationDUrbanisme: previous.autorisationDUrbanisme
        ? {
            numéro: data.numeroDAutorisationDUrbanisme ?? previous.autorisationDUrbanisme.numéro,
            date:
              data.dateDAutorisationDUrbanisme ??
              DateTime.convertirEnValueType(previous.autorisationDUrbanisme.date.date).formatter(),
          }
        : undefined,
      installateur: data.installateur ?? previous.installateur,
      installationAvecDispositifDeStockage:
        data.installationAvecDispositifDeStockage ?? previous.installationAvecDispositifDeStockage,

      // non-editable fields
      typeGarantiesFinancières: previous.garantiesFinancières?.type.type,
      dateÉchéanceGf: previous.garantiesFinancières?.estAvecDateÉchéance()
        ? previous.garantiesFinancières.dateÉchéance?.formatter()
        : undefined,
      dateDélibérationGf: previous.garantiesFinancières?.estExemption()
        ? previous.garantiesFinancières.dateDélibération.formatter()
        : undefined,
      territoireProjet: previous.territoireProjet,
      historiqueAbandon: previous.historiqueAbandon.formatter(),
      fournisseurs: previous.fournisseurs.map((fournisseur) => fournisseur.formatter()),
      obligationDeSolarisation: previous.obligationDeSolarisation,
      typologieInstallation: previous.typologieInstallation.map((t) => t.formatter()),
    },
    doitRégénérerAttestation: doitRegenererAttestation ? true : undefined,
    détailsValue: undefined,
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
