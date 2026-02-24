'use server';

import { mediator } from 'mediateur';

import { Accès, Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCandidature } from '@/app/_helpers';
import {
  modifierLauréatEtCandidatureSchéma,
  PartialModifierCandidatureNotifiéeFormEntries,
} from '@/utils/candidature';
import {
  getLauréatInfos,
  getPuissanceInfos,
  getReprésentantLégalInfos,
} from '@/app/laureats/[identifiant]/_helpers/getLauréat';

export type CorrigerCandidaturesState = FormState;

const schema = modifierLauréatEtCandidatureSchéma;

const action: FormAction<FormState, typeof schema> = async (_, body) =>
  withUtilisateur(async (utilisateur) => {
    const { identifiantProjet, candidature, laureat, doitRegenererAttestation } = body;
    console.log('🦺🦺🦺🦺🦺🦺🦺🦺🦺🦺🦺🦺🦺🦺🦺CANDIDATURE', candidature);
    const rawIdentifiantProjet =
      IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter();

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

      if (candidature.emailContact) {
        await mediator.send<Accès.RemplacerAccèsProjetUseCase>({
          type: 'Projet.Accès.UseCase.RemplacerAccèsProjet',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantUtilisateurValue: candidatureACorriger.dépôt.emailContact.formatter(),
            nouvelIdentifiantUtilisateurValue: candidature.emailContact,
            remplacéParValue: utilisateur.identifiantUtilisateur.formatter(),
            remplacéLeValue: new Date().toISOString(),
          },
        });
      }
    }

    if (laureat) {
      if (laureat.sociétéMère) {
        await mediator.send<Lauréat.Actionnaire.ActionnaireUseCase>({
          type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
            dateModificationValue: new Date().toISOString(),
            raisonValue: '',
            actionnaireValue: laureat.sociétéMère,
          },
        });
      }

      if (laureat.nomReprésentantLégal) {
        const représentantLégal = await getReprésentantLégalInfos(rawIdentifiantProjet);

        await mediator.send<Lauréat.ReprésentantLégal.ModifierReprésentantLégalUseCase>({
          type: 'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
            dateModificationValue: new Date().toISOString(),
            nomReprésentantLégalValue: laureat.nomReprésentantLégal,
            typeReprésentantLégalValue: représentantLégal.typeReprésentantLégal.formatter(),
            raisonValue: '',
          },
        });
      }

      if (laureat.puissance || laureat.puissanceDeSite) {
        const puissanceActuelle = await getPuissanceInfos(rawIdentifiantProjet);

        await mediator.send<Lauréat.Puissance.ModifierPuissanceUseCase>({
          type: 'Lauréat.Puissance.UseCase.ModifierPuissance',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
            dateModificationValue: new Date().toISOString(),
            puissanceValue: laureat.puissance ?? puissanceActuelle.puissance,
            puissanceDeSiteValue: laureat.puissanceDeSite ?? puissanceActuelle.puissanceDeSite,
            raisonValue: '',
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
            raisonValue: '',
          },
        });
      }

      if (laureat.evaluationCarboneSimplifiée) {
        await mediator.send<Lauréat.Fournisseur.ModifierÉvaluationCarboneUseCase>({
          type: 'Lauréat.Fournisseur.UseCase.ModifierÉvaluationCarbone',
          data: {
            identifiantProjetValue: identifiantProjet,
            évaluationCarboneSimplifiéeValue: laureat.evaluationCarboneSimplifiée,
            modifiéeLeValue: new Date().toISOString(),
            modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
          },
        });
      }

      const siteDeProductionModifié =
        laureat.adresse1 != undefined ||
        laureat.adresse2 != undefined ||
        laureat.codePostal != undefined ||
        laureat.commune != undefined ||
        laureat.département != undefined ||
        laureat.région != undefined;

      if (siteDeProductionModifié) {
        const lauréatAModifier = await getLauréatInfos(rawIdentifiantProjet);

        await mediator.send<Lauréat.ModifierSiteDeProductionUseCase>({
          type: 'Lauréat.UseCase.ModifierSiteDeProduction',
          data: {
            identifiantProjetValue: identifiantProjet,
            localitéValue: {
              adresse1: laureat.adresse1 ?? lauréatAModifier.localité.adresse1,
              adresse2: laureat.adresse2 ?? lauréatAModifier.localité.adresse2,
              codePostal: laureat.codePostal ?? lauréatAModifier.localité.codePostal,
              commune: laureat.commune ?? lauréatAModifier.localité.commune,
              département: laureat.département ?? lauréatAModifier.localité.département,
              région: laureat.région ?? lauréatAModifier.localité.région,
            },
            raisonValue: '',
            modifiéLeValue: DateTime.now().formatter(),
            modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),
          },
        });
      }

      if (laureat.nomProjet) {
        await mediator.send<Lauréat.ModifierNomProjetUseCase>({
          type: 'Lauréat.UseCase.ModifierNomProjet',
          data: {
            identifiantProjetValue: identifiantProjet,
            nomProjetValue: laureat.nomProjet,
            modifiéLeValue: DateTime.now().formatter(),
            modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),
          },
        });
      }
    }

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.tableauDeBord(identifiantProjet),
        message: 'Le projet lauréat a bien été modifié',
      },
    };
  });

export const modifierLauréatAction = formAction(action, schema);

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
    département: data.département ?? previous.localité.département,
    région: data.région ?? previous.localité.région,
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
      sociétéMère: data.sociétéMère ?? previous.sociétéMère,
      nomReprésentantLégal: data.nomReprésentantLégal ?? previous.nomReprésentantLégal,
      technologie: data.technologie ?? previous.technologie.formatter(),
      nomCandidat: data.nomCandidat ?? previous.nomCandidat,
      puissance: data.puissance ?? previous.puissance,
      prixReference: data.prixReference ?? previous.prixReference,
      emailContact: data.emailContact ?? previous.emailContact.formatter(),
      localité: localitéValue,
      puissanceALaPointe: data.puissanceALaPointe ?? previous.puissanceALaPointe,
      evaluationCarboneSimplifiée:
        data.evaluationCarboneSimplifiée ?? previous.evaluationCarboneSimplifiée,
      actionnariat:
        data.actionnariat === ''
          ? undefined
          : (data.actionnariat ?? previous.actionnariat?.formatter()),
      coefficientKChoisi: data.coefficientKChoisi ?? previous.coefficientKChoisi,
      puissanceDeSite: data.puissanceDeSite ?? previous.puissanceDeSite,
      autorisationDUrbanisme: previous.autorisationDUrbanisme
        ? {
            numéro: data.numéroDAutorisationDUrbanisme ?? previous.autorisationDUrbanisme.numéro,
            date:
              data.dateDAutorisationDUrbanisme ??
              DateTime.convertirEnValueType(previous.autorisationDUrbanisme.date.date).formatter(),
          }
        : undefined,
      autorisationEnvironnementale: previous.autorisationEnvironnementale
        ? {
            numéro:
              data.numéroDAutorisationEnvironnementale ??
              previous.autorisationEnvironnementale.numéro,
            date:
              data.dateDAutorisationEnvironnementale ??
              DateTime.convertirEnValueType(
                previous.autorisationEnvironnementale.date.date,
              ).formatter(),
          }
        : undefined,
      installateur: data.installateur ?? previous.installateur,

      // champs non éditables
      // soit parce qu'ils ne peuvent changer après la candidature
      // soit parce qu'ils peuvent être modifier au cas par cas mais pas dans ce formulaire pour ne pas l'alourdir
      typeGarantiesFinancières: previous.garantiesFinancières?.type.type,
      dateÉchéanceGf: previous.garantiesFinancières?.estAvecDateÉchéance()
        ? previous.garantiesFinancières.dateÉchéance?.formatter()
        : undefined,
      dateConstitutionGf: previous.garantiesFinancières?.constitution?.date?.formatter(),
      attestationConstitutionGf: previous.garantiesFinancières?.constitution?.attestation,
      territoireProjet: previous.territoireProjet,
      historiqueAbandon: previous.historiqueAbandon.formatter(),
      fournisseurs: previous.fournisseurs.map((fournisseur) => fournisseur.formatter()),
      obligationDeSolarisation: previous.obligationDeSolarisation,
      typologieInstallation: previous.typologieInstallation.map((t) => t.formatter()),
      dispositifDeStockage: previous.dispositifDeStockage,
      natureDeLExploitation: previous.natureDeLExploitation
        ? {
            typeNatureDeLExploitation:
              previous.natureDeLExploitation.typeNatureDeLExploitation.formatter(),
            tauxPrévisionnelACI: previous.natureDeLExploitation.tauxPrévisionnelACI,
          }
        : undefined,
      puissanceProjetInitial: previous.puissanceProjetInitial,
    },
    doitRégénérerAttestation: doitRegenererAttestation ? true : undefined,
    détailsValue: undefined,
  };
};
