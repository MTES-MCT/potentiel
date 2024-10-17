import type { Meta, StoryObj } from '@storybook/react';

import {
  TransmettreDemandeComplèteRaccordementPage,
  TransmettreDemandeComplèteRaccordementPageProps,
} from './TransmettreDemandeComplèteRaccordement.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Transmettre/TransmettreDemandeComplèteRaccordement',
  component: TransmettreDemandeComplèteRaccordementPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TransmettreDemandeComplèteRaccordementPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    listeGestionnairesRéseau: [
      {
        identifiantGestionnaireRéseau: 'identifiantGestionnaireRéseau#1',
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere: 'expresion-régulière',
          format: 'Format',
          légende: 'Légende',
        },
        raisonSociale: 'Raison sociale',
      },
      {
        identifiantGestionnaireRéseau: 'identifiantGestionnaireRéseau#2',
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere: 'expresion-régulière',
          format: 'Format',
          légende: 'Légende',
        },
        raisonSociale: 'Raison sociale',
      },
      {
        identifiantGestionnaireRéseau: 'identifiantGestionnaireRéseau#3',
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere: 'expresion-régulière',
          format: 'Format',
          légende: 'Légende',
        },
        raisonSociale: 'Raison sociale',
      },
    ],
    identifiantGestionnaireRéseauActuel: 'identifiantGestionnaireRéseau#2',
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    delaiDemandeDeRaccordementEnMois: { texte: '3 mois', valeur: 3 },
    aDéjàTransmisUneDemandeComplèteDeRaccordement: false,
  },
};
