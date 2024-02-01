import type { Meta, StoryObj } from '@storybook/react';

import {
  TransmettreDemandeComplèteRaccordementPage,
  TransmettreDemandeComplèteRaccordementProps,
} from './TransmettreDemandeComplèteRaccordement.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Transmettre/TransmettreDemandeComplèteRaccordement',
  component: TransmettreDemandeComplèteRaccordementPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TransmettreDemandeComplèteRaccordementProps>;

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
    delaiDemandeDeRaccordementEnMois: { texte: '3 mois', valeur: 3 },
  },
};
