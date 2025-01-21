import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Actionnaire } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Historique } from '@potentiel-domain/historique';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  DétailsActionnairePage,
  DétailsActionnairePageProps,
} from '@/components/pages/actionnaire/changement/détails/DétailsActionnaire.page';

export const metadata: Metadata = {
  title: "Détails de la demande de changement d'actionnaire du projet - Potentiel",
  description: "Détails de la demande de changement d'actionnaire d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const demandeDeChangement =
        await mediator.send<Actionnaire.ConsulterChangementActionnaireQuery>({
          type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const historique = await mediator.send<Historique.ListerHistoriqueProjetQuery>({
        type: 'Historique.Query.ListerHistoriqueProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          category: 'actionnaire',
        },
      });

      if (Option.isNone(demandeDeChangement) && historique.items.length === 0) {
        return notFound();
      }

      const actions = Option.isSome(demandeDeChangement)
        ? mapToActions({ utilisateur, demandeDeChangement })
        : [];

      return (
        <DétailsActionnairePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          actionnaire={
            Option.isSome(demandeDeChangement)
              ? mapToPlainObject(demandeDeChangement.actionnaire)
              : undefined
          }
          demande={
            Option.isSome(demandeDeChangement)
              ? mapToPlainObject(demandeDeChangement.demande)
              : undefined
          }
          actions={actions}
          historique={mapToPlainObject(historique)}
        />
      );
    }),
  );
}

const mapToActions = ({
  utilisateur,
  demandeDeChangement,
}: {
  utilisateur: Utilisateur.ValueType;
  demandeDeChangement: Actionnaire.ConsulterChangementActionnaireReadModel;
}): DétailsActionnairePageProps['actions'] => {
  const actions: DétailsActionnairePageProps['actions'] = [];

  if (
    utilisateur.role.aLaPermission('actionnaire.annulerChangement') &&
    demandeDeChangement.demande.statut.estDemandé()
  ) {
    actions.push('annuler');
  }

  if (
    utilisateur.role.aLaPermission('actionnaire.accorderChangement') &&
    demandeDeChangement.demande.statut.estDemandé()
  ) {
    actions.push('accorder');
  }

  if (
    utilisateur.role.aLaPermission('actionnaire.rejeterChangement') &&
    demandeDeChangement.demande.statut.estDemandé()
  ) {
    actions.push('rejeter');
  }

  if (
    utilisateur.role.aLaPermission('actionnaire.demanderChangement') &&
    !demandeDeChangement.demande.statut.estDemandé()
  ) {
    actions.push('demander');
  }

  return actions;
};
