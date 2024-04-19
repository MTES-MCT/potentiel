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
      min: '01/09/2022',
      max: '31/12/2024',
    },
    invervalleDateMiseEnService: {
      min: new Date('2024-01-01').toISOString(),
      max: new Date('2024-06-01').toISOString(),
    },
    projet: {
      identifiantProjet: 'identifiantProjet#1',
      appelOffre: 'Appel offre',
      période: 'Période',
      famille: 'Famille',
      nom: 'Nom du projet',
      dateDésignation: '23/10/2021',
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
