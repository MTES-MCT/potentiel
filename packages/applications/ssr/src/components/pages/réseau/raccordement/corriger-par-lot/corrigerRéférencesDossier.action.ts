'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { type Raccordement } from '@potentiel-domain/reseau';
import { DomainError } from '@potentiel-domain/core';
import { parseCsv } from '@potentiel-libraries/csv';
import { Option } from '@potentiel-libraries/monads';
import { Groupe, Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { ActionResult, FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document';

const schema = zod.object({
  fichierCorrections: singleDocument(),
});

export type CorrigerRéférencesDossierFormKeys = keyof zod.infer<typeof schema>;

const csvSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  referenceDossierCorrigee: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = (_, { fichierCorrections }) =>
  withUtilisateur(async (utilisateur) => {
    const { parsedData: lines } = await parseCsv(fichierCorrections.content, csvSchema, {
      // on conserve les espaces, car c'est potentiellement l'erreur à corriger
      ltrim: false,
      rtrim: false,
    });

    if (lines.length === 0) {
      return {
        status: 'validation-error',
        errors: { fichierCorrections: 'Fichier invalide' },
      };
    }

    let success: number = 0;
    const errors: ActionResult['errors'] = [];

    // l'identifiant dans le fichier est au format "lisible" et pas au format technique
    // on remplace les séparateurs de segments de "-" en "#"
    // Ex: CRE4 - Bâtiment-1-2-3 => CRE4 - Bâtiment#1#2#3
    const parseIdentifiantProjet = (identifiant: string) =>
      identifiant.replace(/(.*)-(\d*)-(.{0,3})-(.*)/, '$1#$2#$3#$4');

    for (const { identifiantProjet, referenceDossier, referenceDossierCorrigee } of lines) {
      try {
        const error = await vérifierAccèsGestionnaireRéseau(
          utilisateur,
          identifiantProjet,
          referenceDossier,
        );
        if (error) {
          errors.push({
            key: referenceDossier,
            reason: error,
          });
          continue;
        }

        await mediator.send<Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
          type: 'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
          data: {
            identifiantProjetValue: parseIdentifiantProjet(identifiantProjet),
            nouvelleRéférenceDossierRaccordementValue: referenceDossierCorrigee,
            référenceDossierRaccordementActuelleValue: referenceDossier,
            rôleValue: utilisateur.role.nom,
          },
        });
        success++;
      } catch (error) {
        if (error instanceof DomainError) {
          errors.push({
            key: referenceDossier,
            reason: error.message,
          });
          continue;
        }
        errors.push({
          key: identifiantProjet,
          reason:
            'Une erreur inconnue empêche la correction de la référence de dossier de raccordement',
        });
      }
    }

    if (errors.length === 0 && success > 0) {
      return {
        status: 'success',
        redirectUrl: Routes.Raccordement.lister,
      };
    }

    return {
      status: 'success',
      result: {
        successCount: success,
        errors,
      },
    };
  });

export const corrigerRéférencesDossierAction = formAction(action, schema);

async function vérifierAccèsGestionnaireRéseau(
  utilisateur: Utilisateur.ValueType,
  identifiantProjet: string,
  referenceDossier: string,
) {
  const dossier = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
    type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
    data: {
      identifiantProjetValue: identifiantProjet,
      référenceDossierRaccordementValue: referenceDossier,
    },
  });
  if (Option.isNone(dossier)) {
    return 'Aucun dossier de raccordement';
  }
  if (!utilisateur.role.estÉgaleÀ(Role.grd)) return;
  if (
    Option.isSome(utilisateur.groupe) &&
    utilisateur.groupe.estÉgaleÀ(
      Groupe.convertirEnValueType(
        `/GestionnairesRéseau/${dossier.identifiantGestionnaireRéseau.formatter()}`,
      ),
    )
  ) {
    return;
  }
  return `Le gestionnaire de réseau n'est pas attribué à ce dossier de raccordement`;
}
