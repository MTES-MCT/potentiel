import type { Meta, StoryObj } from '@storybook/react';

import { ModifierDemandeComplèteRaccordementPage } from './ModifierDemandeComplèteRaccordementPage';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/ModifierDemandeComplèteRaccordementPage',
  component: ModifierDemandeComplèteRaccordementPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ModifierDemandeComplèteRaccordementPage>;

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
    gestionnaireRéseauActuel: {
      identifiantGestionnaireRéseau: 'identifiantGestionnaireRéseau#1',
      codeEIC: 'Code EIC-1',
      aideSaisieRéférenceDossierRaccordement: {
        expressionReguliere: 'expresion-régulière',
        format: 'Format',
        légende: 'Légende',
      },
      raisonSociale: 'Raison sociale',
    },
    raccordement: {
      référence: 'référence#1',
      canEditRéférence: true,
      demandeComplèteRaccordement: {
        accuséRéception: 'référence#1/accuséRéception',
        dateQualification: '2024-01-18',
      },
    },
    delaiDemandeDeRaccordementEnMois: {
      texte: 'Texte délai de raccordement en mois',
      valeur: 99,
    },
  },
};
