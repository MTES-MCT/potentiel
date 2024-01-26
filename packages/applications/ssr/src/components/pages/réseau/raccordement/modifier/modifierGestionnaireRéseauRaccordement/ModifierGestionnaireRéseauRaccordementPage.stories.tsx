import type { Meta, StoryObj } from '@storybook/react';

import { ModifierGestionnaireRéseauRaccordementPage } from './ModifierGestionnaireRéseauRaccordementPage';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Modifier/ModifierGestionnaireRéseauRaccordementPage',
  component: ModifierGestionnaireRéseauRaccordementPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ModifierGestionnaireRéseauRaccordementPage>;

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
      dateDésignation: '2021-10-23',
      localité: {
        codePostal: 'XXXXX',
        commune: 'Commune',
        département: 'Département',
        région: 'Région',
      },
      statut: 'classé',
    },
    listeGestionnairesRéseau: [
      {
        identifiantGestionnaireRéseau: 'identifiantGestionnaireRéseau#1',
        codeEIC: 'Code EIC-1',
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere: 'expresion-régulière',
          format: 'Format',
          légende: 'Légende',
        },
        raisonSociale: 'Raison sociale',
      },
      {
        identifiantGestionnaireRéseau: 'identifiantGestionnaireRéseau#2',
        codeEIC: 'Code EIC-2',
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere: 'expresion-régulière',
          format: 'Format',
          légende: 'Légende',
        },
        raisonSociale: 'Raison sociale',
      },
      {
        identifiantGestionnaireRéseau: 'identifiantGestionnaireRéseau#3',
        codeEIC: 'Code EIC-3',
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere: 'expresion-régulière',
          format: 'Format',
          légende: 'Légende',
        },
        raisonSociale: 'Raison sociale',
      },
    ],
    identifiantGestionnaireRéseauActuel: 'identifiantGestionnaireRéseau#2',
  },
};
