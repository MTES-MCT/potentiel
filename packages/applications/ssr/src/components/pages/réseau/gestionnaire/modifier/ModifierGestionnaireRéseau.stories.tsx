import type { Meta, StoryObj } from '@storybook/react';

import {
  ModifierGestionnaireRéseauPage,
  ModifierGestionnaireRéseauPageProps,
} from './ModifierGestionnaireRéseau.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Gestionnaire/Modifier/ModifierGestionnaireRéseauPage',
  component: ModifierGestionnaireRéseauPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierGestionnaireRéseauPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantGestionnaireRéseau: {
      codeEIC: 'identifiantGestionnaireRéseau',
    },
    raisonSociale: 'Réseau de Gestionnaires',
    aideSaisieRéférenceDossierRaccordement: {
      format: 'format',
      légende: 'légende',
      expressionReguliere: { expression: 'expressionReguliere' },
    },
    contactEmail: { email: 'contactEmail@test.test' },
  },
};
