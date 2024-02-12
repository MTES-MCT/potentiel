import type { Meta, StoryObj } from '@storybook/react';

import {
  ModifierGestionnaireRéseauPage,
  ModifierGestionnaireRéseauProps,
} from './ModifierGestionnaireRéseau.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Gestionnaire/Modifier/ModifierGestionnaireRéseauPage',
  component: ModifierGestionnaireRéseauPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierGestionnaireRéseauProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantGestionnaireRéseau: 'identifiantGestionnaireRéseau',
    raisonSociale: 'raisonSociale',
    format: 'format',
    légende: 'légende',
    expressionReguliere: 'expressionReguliere',
  },
};
