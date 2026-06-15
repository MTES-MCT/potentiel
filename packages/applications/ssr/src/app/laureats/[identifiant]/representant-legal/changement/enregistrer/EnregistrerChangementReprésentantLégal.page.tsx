import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { DemanderOuEnregistrerChangementReprésentantLégalForm } from '../components/DemanderOuEnregistrerChangementReprésentantLégal.form';

export type EnregistrerChangementReprésentantLégalPageProps = {
  identifiantProjet: string;
  nomReprésentantLégal: string;
};

export const EnregistrerChangementReprésentantLégalPage: FC<
  EnregistrerChangementReprésentantLégalPageProps
> = ({ identifiantProjet, nomReprésentantLégal }) => (
  <>
    <Heading1>Déclarer un changement de représentant légal</Heading1>
    <DemanderOuEnregistrerChangementReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      estUneDemande={false}
      nomReprésentantLégal={nomReprésentantLégal}
    />
  </>
);
