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
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
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
      référence: {
        value: 'référence#1',
        canEdit: true,
      },
      demandeComplèteRaccordement: {
        canEdit: true,
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
