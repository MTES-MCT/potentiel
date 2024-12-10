import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Actionnaire } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  DétailsDemandeChangementActionnairePage,
  DétailsDemandeChangementActionnairePageProps,
} from '@/components/pages/actionnaire/changement/détails/DétailsDemandeChangementActionnaire.page';

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
        await mediator.send<Actionnaire.ConsulterDemandeChangementActionnaireQuery>({
          type: 'Lauréat.Actionnaire.Query.ConsulterDemandeChangementActionnaire',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      if (Option.isNone(demandeDeChangement)) {
        return notFound();
      }

      const actions = mapToActions({ utilisateur, demandeDeChangement });

      return (
        <DétailsDemandeChangementActionnairePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          actionnaire={mapToPlainObject(demandeDeChangement.actionnaire)}
          demande={mapToPlainObject(demandeDeChangement.demande)}
          actions={actions}
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
  demandeDeChangement: Actionnaire.ConsulterDemandeChangementActionnaireReadModel;
}): DétailsDemandeChangementActionnairePageProps['actions'] => {
  const actions: DétailsDemandeChangementActionnairePageProps['actions'] = [];

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
