import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import {
  ModifierRôleUtilisateurUseCase,
  Région,
  Zone,
  ConsulterUtilisateurQuery,
} from '@potentiel-domain/utilisateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Email } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { decodeParameter } from '@/utils/decodeParameter';

import { getZoneLabel } from '../../_helpers/getZoneLabel';

import { ModifierRôleUtilisateurPage } from './ModifierRôleUtilisateur.page';

export const metadata: Metadata = {
  title: 'Modifier le rôle - Potentiel',
  description: "Modifier le rôle d'un utilisateur",
};

export default async function Page({
  params: { identifiant },
}: {
  params: { identifiant: string };
}) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.role.peutExécuterMessage<ModifierRôleUtilisateurUseCase>(
        'Utilisateur.UseCase.ModifierRôleUtilisateur',
      );

      const identifiantUtilisateur = Email.convertirEnValueType(decodeParameter(identifiant));

      const utilisateurÀModifier = await mediator.send<ConsulterUtilisateurQuery>({
        type: 'Utilisateur.Query.ConsulterUtilisateur',
        data: {
          identifiantUtilisateur: identifiantUtilisateur.formatter(),
        },
      });

      if (Option.isNone(utilisateurÀModifier)) {
        notFound();
      }

      const gestionnairesRéseau =
        await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
          data: {},
        });

      return (
        <ModifierRôleUtilisateurPage
          utilisateur={mapToPlainObject(utilisateurÀModifier)}
          régions={Région.régions
            .map((nom) => ({ label: nom, value: nom }))
            .sort((a, b) => a.label.localeCompare(b.label))}
          gestionnairesRéseau={gestionnairesRéseau.items.map(
            ({ raisonSociale, identifiantGestionnaireRéseau: { codeEIC } }) => ({
              label: raisonSociale,
              value: codeEIC,
            }),
          )}
          zones={Zone.zones.map((nom) => ({ label: getZoneLabel(nom), value: nom }))}
        />
      );
    }),
  );
}
