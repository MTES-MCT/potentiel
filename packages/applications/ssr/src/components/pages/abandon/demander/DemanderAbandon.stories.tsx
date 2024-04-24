import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { DemanderAbandonPage, DemanderAbandonPageProps } from './DemanderAbandon.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Abandon/Demander/DemanderAbandonPage',
  component: DemanderAbandonPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DemanderAbandonPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projet: {
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
    },
    showRecandidatureCheckBox: true,
  },
};
