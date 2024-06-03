import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/utils/garanties-financières/typesGarantiesFinancièresPourFormulaire';

import {
  ModifierDépôtEnCoursGarantiesFinancièresPage,
  ModifierDépôtEnCoursGarantiesFinancièresProps,
} from './ModifierDépôtEnCoursGarantiesFinancières.page';

const meta = {
  title: 'Pages/Garanties-financières/Dépôt/Modifier',
  component: ModifierDépôtEnCoursGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierDépôtEnCoursGarantiesFinancièresProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: ModifierDépôtEnCoursGarantiesFinancièresProps['projet'] = {
  identifiantProjet: 'identifiantProjet#1',
  appelOffre: 'Appel offre',
  période: 'Période',
  famille: 'Famille',
  nom: 'Nom du projet',
  dateDésignation: new Date('2021-10-23').toISOString() as Iso8601DateTime,
  localité: {
    codePostal: 'XXXXX',
    commune: 'Commune',
    département: 'Département',
    région: 'Région',
  },
  statut: 'classé',
};

const typesGarantiesFinancières: ModifierDépôtEnCoursGarantiesFinancièresProps['typesGarantiesFinancières'] =
  typesGarantiesFinancièresSansInconnuPourFormulaire;

export const EnTantQueDreal: Story = {
  args: {
    projet,
    dépôtEnCours: {
      typeGarantiesFinancières: 'consignation',
      dateConstitution: new Date('2021-10-23').toISOString() as Iso8601DateTime,
      attestation: 'path/to/attestationConstitution',
    },
    typesGarantiesFinancières,
  },
};

export const EnTantQuePorteur: Story = {
  args: {
    projet,
    dépôtEnCours: {
      dateÉchéance: new Date('2023-10-23').toISOString() as Iso8601DateTime,
      dateConstitution: new Date('2021-10-23').toISOString() as Iso8601DateTime,
      attestation: 'path/to/attestationConstitution',
    },
    showWarning: true,
    typesGarantiesFinancières,
  },
};
