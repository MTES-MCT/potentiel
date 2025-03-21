import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  DemanderChangementReprésentantLégalForm,
  DemanderChangementReprésentantLégalFormProps,
} from './DemanderChangementReprésentantLégal.form';

export type DemanderChangementReprésentantLégalPageProps =
  DemanderChangementReprésentantLégalFormProps;

export const DemanderChangementReprésentantLégalPage: FC<
  DemanderChangementReprésentantLégalPageProps
> = ({ identifiantProjet }) => (
  <>
    <Heading1>Demander un changement de représentant légal</Heading1>
    <DemanderChangementReprésentantLégalForm identifiantProjet={identifiantProjet} />
  </>
);
