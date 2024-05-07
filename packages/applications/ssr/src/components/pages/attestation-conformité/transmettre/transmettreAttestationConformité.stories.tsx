import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

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

export const Default: Story = {
  args: {
    projet,
  },
};
