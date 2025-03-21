import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  EnregistrerChangementActionnaireForm,
  EnregistrerChangementActionnaireFormProps,
} from './EnregistrerChangementActionnaire.form';

export type EnregistrerChangementActionnairePageProps = EnregistrerChangementActionnaireFormProps;

export const EnregistrerChangementActionnairePage: FC<
  EnregistrerChangementActionnairePageProps
> = ({ identifiantProjet, actionnaire }) => (
  <>
    <Heading1>Changer d'actionnaire(s)</Heading1>
    <EnregistrerChangementActionnaireForm
      identifiantProjet={identifiantProjet}
      actionnaire={actionnaire}
    />
  </>
);
