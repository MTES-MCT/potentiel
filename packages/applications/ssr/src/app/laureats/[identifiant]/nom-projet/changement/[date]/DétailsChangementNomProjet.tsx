import { FC } from 'react';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';

import { DétailsNomProjetPageProps } from './DétailsChangementNomProjet.page';

export type DétailsChangementNomProjetProps = {
  changement: DétailsNomProjetPageProps['changement'];
};

export const DétailsChangementNomProjet: FC<DétailsChangementNomProjetProps> = ({ changement }) => {
  return (
    <DétailsChangement
      title="Changement de nom"
      changement={changement}
      valeurs={<DétailsValeursNomProjet changement={changement} />}
      statut="information-enregistrée"
    />
  );
};

type DétailsValeursNomProjetProps = {
  changement: DétailsNomProjetPageProps['changement'];
};

const DétailsValeursNomProjet: FC<DétailsValeursNomProjetProps> = ({ changement }) => (
  <div>
    <span className="font-medium">Nouveau nom du projet</span>: {changement.nomProjet}
  </div>
);
