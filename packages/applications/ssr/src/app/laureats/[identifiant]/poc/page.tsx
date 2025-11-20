import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { LauréatDétailsPage, LauréatDétailsPageActions } from './LauréatDétails.page';
import { notFound } from 'next/navigation';

type PageProps = IdentifiantParameter;

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const actif =
        process.env.FEATURES?.split(',')
          .map((s) => s.trim())
          .includes('page-projet') ?? false;

      if (!actif) {
        return notFound();
      }

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const lauréat = { nomProjet: 'Projet exemple' };

      // data par tabs

      return (
        <LauréatDétailsPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          lauréat={mapToPlainObject(lauréat)}
          actions={mapToActions({
            rôle: utilisateur.rôle,
          })}
        />
      );
    }),
  );
}

type MapToActions = (args: { rôle: Role.ValueType }) => Array<LauréatDétailsPageActions>;

const mapToActions: MapToActions = ({ rôle }) => {
  const actions: Array<LauréatDétailsPageActions> = [];

  // actions par tabs
  actions.push('imprimer-page');

  if (rôle.aLaPermission('lauréat.modifier')) {
    actions.push('modifier-lauréat');
  }

  return actions;
};
