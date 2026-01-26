import type { Metadata } from 'next';

import { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ExportPage, ExportPageProps } from './export.page';

export const metadata: Metadata = {
  title: 'Export de données - Potentiel',
  description: `Page d'export des données au format CSV`,
};

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      return <ExportPage actions={mapToAction(utilisateur)} />;
    }),
  );
}

type MapToAction = (utilisateur: PotentielUtilisateur) => ExportPageProps['actions'];

const mapToAction: MapToAction = (utilisateur) => {
  const actions: ExportPageProps['actions'] = [];

  if (utilisateur.rôle.aLaPermission('raccordement.listerDossierRaccordement')) {
    actions.push('exporter-raccordement');
  }

  if (utilisateur.rôle.aLaPermission('lauréat.listerLauréatEnrichi')) {
    actions.push('lister-lauréat-enrichi');
  }

  return actions;
};
