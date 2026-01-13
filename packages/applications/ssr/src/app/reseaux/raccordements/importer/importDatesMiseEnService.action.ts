'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { DomainError } from '@potentiel-domain/core';
import { ImportCSV } from '@potentiel-libraries/csv';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ActionResult, FormAction, FormState, formAction } from '@/utils/formAction';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantGestionnaireReseau: zod.string(),
  fichierDatesMiseEnService: singleDocument({ acceptedFileTypes: ['text/csv'] }),
});

export type ImporterDatesMiseEnServiceFormKeys = keyof zod.infer<typeof schema>;

const csvSchema = zod.object({
  identifiantProjet: zod.string().optional(),
  referenceDossier: zod.string().min(1, {
    message: 'La référence du dossier ne peut pas être vide',
  }),
  dateMiseEnService: zod
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "Le format de la date n'est pas respecté (format attendu : JJ/MM/AAAA)",
    })
    .optional()
    .or(zod.literal('')),
});

const convertDateToCommonFormat = (date: string) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
};

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantGestionnaireReseau, fichierDatesMiseEnService },
) => {
  const identifiantGestionnaireRéseauSélectionné =
    GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireReseau,
    );
  const { parsedData: lines } = await ImportCSV.parseCsv(
    fichierDatesMiseEnService.content,
    csvSchema,
  );

  if (lines.length === 0) {
    return {
      status: 'validation-error',
      errors: { fichierDatesMiseEnService: 'Fichier invalide' },
    };
  }

  let success: number = 0;
  const errors: ActionResult['errors'] = [];

  for (const { identifiantProjet, referenceDossier, dateMiseEnService } of lines) {
    if (!dateMiseEnService) {
      continue;
    }

    if (identifiantProjet) {
      const dossier = await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
          référenceDossierRaccordementValue: referenceDossier,
        },
      });

      if (Option.isNone(dossier)) {
        errors.push({
          key: referenceDossier,
          reason: 'Aucun dossier de raccordement',
        });
        continue;
      }

      const errorAttribution = await vérifierAttributionGestionnaireRéseau(
        dossier.identifiantGestionnaireRéseau,
        identifiantGestionnaireRéseauSélectionné,
        referenceDossier,
      );

      if (!errorAttribution) {
        const errorTransmission = await transmettreDateDeMiseEnService(
          identifiantProjet,
          referenceDossier,
          dateMiseEnService,
        );
        if (errorTransmission) {
          errors.push(errorTransmission);
        }
      } else {
        errors.push(errorAttribution);
      }
    } else {
      const dossiers = await mediator.send<Lauréat.Raccordement.RechercherDossierRaccordementQuery>(
        {
          type: 'Lauréat.Raccordement.Query.RechercherDossierRaccordement',
          data: {
            référenceDossierRaccordement: referenceDossier,
          },
        },
      );

      if (dossiers.length === 0) {
        errors.push({
          key: referenceDossier,
          reason: 'Aucun dossier correspondant',
        });

        continue;
      }

      for (const dossier of dossiers) {
        const errorAttribution = await vérifierAttributionGestionnaireRéseau(
          dossier.identifiantGestionnaireRéseau,
          identifiantGestionnaireRéseauSélectionné,
          referenceDossier,
        );

        if (!errorAttribution) {
          const errorTransmission = await transmettreDateDeMiseEnService(
            dossier.identifiantProjet.formatter(),
            referenceDossier,
            dateMiseEnService,
          );
          if (errorTransmission) {
            errors.push(errorTransmission);
          }
        } else {
          errors.push(errorAttribution);
        }
      }
    }
    success++;
  }

  return {
    status: 'success',
    result: {
      successMessage:
        success === 0
          ? ''
          : success === 1
            ? `${success} date de mise en service transmise`
            : `${success} dates de mise en service transmises`,
      errors,
    },
  };
};

const transmettreDateDeMiseEnService = async (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
  dateMiseEnService: string,
): Promise<ActionResult['errors'][number] | undefined> =>
  withUtilisateur(async (utilisateur) => {
    try {
      await mediator.send<Lauréat.Raccordement.TransmettreDateMiseEnServiceUseCase>({
        type: 'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
        data: {
          identifiantProjetValue: identifiantProjet,
          référenceDossierValue: référenceDossierRaccordement,
          dateMiseEnServiceValue: new Date(
            convertDateToCommonFormat(dateMiseEnService),
          ).toISOString(),
          transmiseLeValue: DateTime.now().formatter(),
          transmiseParValue: utilisateur.identifiantUtilisateur.formatter(),
        },
      });
    } catch (error) {
      if (error instanceof DomainError) {
        return {
          key: référenceDossierRaccordement,
          reason: error.message,
        };
      }
      return {
        key: référenceDossierRaccordement,
        reason: 'Une erreur inconnue empêche la transmission de la date de mise en service',
      };
    }
  });

export const importerDatesMiseEnServiceAction = formAction(action, schema);
async function vérifierAttributionGestionnaireRéseau(
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType,
  identifiantGestionnaireRéseauSélectionné: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType,
  referenceDossier: string,
): Promise<ActionResult['errors'][number] | undefined> {
  if (!identifiantGestionnaireRéseau.estÉgaleÀ(identifiantGestionnaireRéseauSélectionné)) {
    const gestionnaireRéseau =
      await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
        },
      });

    return {
      key: referenceDossier,
      reason: `Le dossier est actuellement attribué au gestionnaire de réseau - ${Option.match(
        gestionnaireRéseau,
      )
        .some(({ raisonSociale }) => raisonSociale)
        .none(() => 'Inconnu')}`,
    };
  }
}
