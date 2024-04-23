import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import {
  ModifierDemandeComplèteRaccordementPage,
  ModifierDemandeComplèteRaccordementPageProps,
} from './ModifierDemandeComplèteRaccordement.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Modifier/ModifierDemandeComplèteRaccordementPage',
  component: ModifierDemandeComplèteRaccordementPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierDemandeComplèteRaccordementPageProps>;

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
    gestionnaireRéseauActuel: {
      identifiantGestionnaireRéseau: 'identifiantGestionnaireRéseau#1',
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
        dateQualification: new Date('2024-01-18').toISOString() as Iso8601DateTime,
      },
    },
    delaiDemandeDeRaccordementEnMois: {
      texte: 'Texte délai de raccordement en mois',
      valeur: 99,
    },
  },
};
