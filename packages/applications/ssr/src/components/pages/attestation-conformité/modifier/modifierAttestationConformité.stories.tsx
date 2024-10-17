import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import {
  ModifierAttestationConformitéPage,
  ModifierAttestationConformitéPageProps,
} from './modifierAttestationConformité.page';

const meta = {
  title: 'Pages/Achèvement/Attestation-conformité/Modifier',
  component: ModifierAttestationConformitéPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierAttestationConformitéPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: ModifierAttestationConformitéPageProps['projet'] = {
  identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
};

export const Default: Story = {
  args: {
    projet,
    attestationConformitéActuelle: {
      attestation: 'xxx',
      dateTransmissionAuCocontractant: new Date().toISOString() as Iso8601DateTime,
      preuveTransmissionAuCocontractant: 'xxx',
    },
  },
};
