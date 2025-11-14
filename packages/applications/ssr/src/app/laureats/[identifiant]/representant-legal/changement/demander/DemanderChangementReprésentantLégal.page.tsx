import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import { DemanderOuEnregistrerChangementReprésentantLégalForm } from '../components/DemanderOuEnregistrerChangementReprésentantLégal.form';

export type DemanderChangementReprésentantLégalPageProps = {
  identifiantProjet: string;
};

export const DemanderChangementReprésentantLégalPage: FC<
  DemanderChangementReprésentantLégalPageProps
> = ({ identifiantProjet }) => (
  <>
    <Heading1>Demander un changement de représentant légal</Heading1>
    <DemanderOuEnregistrerChangementReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      estUneDemande={true}
    />
  </>
);
