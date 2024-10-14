import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/utils/garanties-financières/typesGarantiesFinancièresPourFormulaire';

import {
  ModifierDépôtEnCoursGarantiesFinancièresPage,
  ModifierDépôtEnCoursGarantiesFinancièresPageProps,
} from './ModifierDépôtEnCoursGarantiesFinancières.page';

// ne marche pas

const meta = {
  title: 'Pages/Garanties-financières/Dépôt/Modifier',
  component: ModifierDépôtEnCoursGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierDépôtEnCoursGarantiesFinancièresPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const typesGarantiesFinancières: ModifierDépôtEnCoursGarantiesFinancièresPageProps['typesGarantiesFinancières'] =
  typesGarantiesFinancièresSansInconnuPourFormulaire;

export const EnTantQueDreal: Story = {
  args: {
    identifiantProjet: 'identifiantProjet#1',
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
    identifiantProjet: 'identifiantProjet#1',
    dépôtEnCours: {
      dateÉchéance: new Date('2023-10-23').toISOString() as Iso8601DateTime,
      dateConstitution: new Date('2021-10-23').toISOString() as Iso8601DateTime,
      attestation: 'path/to/attestationConstitution',
    },
    showWarning: true,
    typesGarantiesFinancières,
  },
};
