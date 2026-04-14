import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  TransmettreDateAchèvementForm,
  TransmettreDateAchèvementFormProps,
} from './TransmettreDateAchèvement.form';

export type TransmettreDateAchèvementPageProps = TransmettreDateAchèvementFormProps;

export const TransmettreDateAchèvementPage: FC<TransmettreDateAchèvementPageProps> = ({
  identifiantProjet,
  lauréatNotifiéLe: notifiéLe,
}) => (
  <>
    <Heading1>Transmettre la date d'achèvement du projet</Heading1>

    <TransmettreDateAchèvementForm
      identifiantProjet={identifiantProjet}
      lauréatNotifiéLe={notifiéLe}
    />
  </>
);
