import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  EnregistrerChangementNomProjetForm,
  EnregistrerChangementNomProjetFormProps,
} from './EnregistrerChangementNomProjet.form';

export type EnregistrerChangementNomProjetPageProps = EnregistrerChangementNomProjetFormProps;

export const EnregistrerChangementNomProjetPage: FC<EnregistrerChangementNomProjetPageProps> = ({
  identifiantProjet,
  nomProjet,
}) => (
  <>
    <Heading1>Changer le nom du projet</Heading1>
    <EnregistrerChangementNomProjetForm
      identifiantProjet={identifiantProjet}
      nomProjet={nomProjet}
    />
  </>
);
