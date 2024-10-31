import type { Meta, StoryObj } from '@storybook/react';

import {
  TransmettreAttestationConformitéPage,
  TransmettreAttestationConformitéPageProps,
} from './transmettreAttestationConformité.page';

const meta = {
  title: 'Pages/Achèvement/Attestation-conformité/Transmettre',
  component: TransmettreAttestationConformitéPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TransmettreAttestationConformitéPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    peutDemanderMainlevée: false,
    peutVoirMainlevée: true,
  },
};
