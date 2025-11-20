import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import { DemanderOuEnregistrerChangementReprésentantLégalForm } from '../components/DemanderOuEnregistrerChangementReprésentantLégal.form';

export type EnregistrerChangementReprésentantLégalPageProps = {
  identifiantProjet: string;
};

export const EnregistrerChangementReprésentantLégalPage: FC<
  EnregistrerChangementReprésentantLégalPageProps
> = ({ identifiantProjet }) => (
  <>
    <Heading1>Déclarer un changement de représentant légal</Heading1>
    <DemanderOuEnregistrerChangementReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      estUneDemande={false}
    />
  </>
);
