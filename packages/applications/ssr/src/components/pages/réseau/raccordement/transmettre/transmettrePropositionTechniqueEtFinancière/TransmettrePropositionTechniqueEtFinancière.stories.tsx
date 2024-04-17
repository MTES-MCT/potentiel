import type { Meta, StoryObj } from '@storybook/react';

import {
  TransmettrePropositionTechniqueEtFinancièrePage,
  TransmettrePropositionTechniqueEtFinancièreProps,
} from './TransmettrePropositionTechniqueEtFinancière.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Transmettre/TransmettrePropositionTechniqueEtFinancière',
  component: TransmettrePropositionTechniqueEtFinancièrePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TransmettrePropositionTechniqueEtFinancièreProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    referenceDossierRaccordement: 'dossierRaccordement#1',
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
