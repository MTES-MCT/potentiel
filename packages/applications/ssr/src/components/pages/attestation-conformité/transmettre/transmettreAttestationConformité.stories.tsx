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

const projet: TransmettreAttestationConformitéPageProps['projet'] = {
  identifiantProjet: 'identifiantProjet#1',
};

export const Default: Story = {
  args: {
    projet,
    peutDemanderMainlevée: false,
    peutVoirMainlevée: true,
  },
};
