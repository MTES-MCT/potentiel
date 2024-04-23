import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@/utils/formatDate';

import {
  ModifierGestionnaireRéseauRaccordementPage,
  ModifierGestionnaireRéseauRaccordementPageProps,
} from './ModifierGestionnaireRéseauRaccordement.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Modifier/ModifierGestionnaireRéseauRaccordementPage',
  component: ModifierGestionnaireRéseauRaccordementPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierGestionnaireRéseauRaccordementPageProps>;

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
  },
};
