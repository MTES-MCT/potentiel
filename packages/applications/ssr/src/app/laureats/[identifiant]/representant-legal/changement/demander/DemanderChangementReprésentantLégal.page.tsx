import type { FC } from 'react';

import type { AppelOffre } from '@potentiel-domain/appel-offre';

import { Heading1 } from '@/components/atoms/headings';
import { DemanderOuEnregistrerChangementReprésentantLégalForm } from '../components/DemanderOuEnregistrerChangementReprésentantLégal.form';

export type DemanderChangementReprésentantLégalPageProps = {
  identifiantProjet: string;
  règlesInstructionAutomatique?: AppelOffre.RègleInstructionAutomatique;
  nomReprésentantLégal: string;
};

export const DemanderChangementReprésentantLégalPage: FC<
  DemanderChangementReprésentantLégalPageProps
> = ({ identifiantProjet, règlesInstructionAutomatique, nomReprésentantLégal }) => (
  <>
    <Heading1>Demander un changement de représentant légal</Heading1>
    <DemanderOuEnregistrerChangementReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      estUneDemande={true}
      règlesInstructionAutomatique={règlesInstructionAutomatique}
      nomReprésentantLégal={nomReprésentantLégal}
    />
  </>
);
