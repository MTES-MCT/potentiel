import type { Meta, StoryObj } from '@storybook/react';

import {
  TransmettreDateMiseEnServicePage,
  TransmettreDateMiseEnServiceProps,
} from './TransmettreDateMiseEnService.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Transmettre/TransmettreDateMiseEnServicePage',
  component: TransmettreDateMiseEnServicePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TransmettreDateMiseEnServiceProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dossierRaccordement: {
      référence: 'Référence',
    },
    intervalleDatesMeSDélaiCDC2022: {
      min: new Date('2022-09-01').toISOString(),
      max: new Date('2024-12-31').toISOString(),
    },
    projet: {
      identifiantProjet: 'identifiantProjet#1',
      appelOffre: 'Appel offre',
      période: 'Période',
      famille: 'Famille',
      nom: 'Nom du projet',
      dateDésignation: '2021-10-23',
      localité: {
        codePostal: 'XXXXX',
        commune: 'Commune',
        département: 'Département',
        région: 'Région',
      },
      statut: 'classé',
    },
  },
};
