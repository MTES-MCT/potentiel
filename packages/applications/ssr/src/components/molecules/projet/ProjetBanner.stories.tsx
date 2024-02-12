import type { Meta, StoryObj } from '@storybook/react';

import { ProjetBanner, ProjetBannerProps } from './ProjetBanner';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Molecules/Projet/ProjetBanner',
  component: ProjetBanner,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ProjetBannerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantProjet: '#identifiantProjet',
    appelOffre: 'Appel offre',
    période: 'Période',
    famille: 'Famille',
    nom: 'Le projet',
    statut: 'classé',
    localité: {
      commune: 'Commune',
      codePostal: 'XXXXX',
      département: 'Département',
      région: 'Région',
    },
    dateDésignation: '2021-10-22',
  },
};
