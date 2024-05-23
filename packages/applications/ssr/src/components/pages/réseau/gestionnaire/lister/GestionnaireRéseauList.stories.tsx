import type { Meta, StoryObj } from '@storybook/react';

import {
  GestionnaireRéseauListPage,
  GestionnaireRéseauListPageProps,
} from './GestionnaireRéseauList.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Gestionnaire/Lister/GestionnaireRéseauListPage',
  component: GestionnaireRéseauListPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<GestionnaireRéseauListPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const itemsLength = 10;
export const Default: Story = {
  args: {
    items: Array.from({ length: itemsLength }, (_, i) => ({
      identifiantGestionnaireRéseau: {
        codeEIC: `identifiantGestionnaireRéseau${i}`,
      },
      raisonSociale: `Gestionnaire#${(i += 1)}`,
      aideSaisieRéférenceDossierRaccordement: {
        format: 'format',
        légende: 'légende',
        expressionReguliere: { expression: 'expressionReguliere' },
      },
      contactEmail: { email: 'contactEmail' },
    })),
    range: {
      startPosition: 0,
      endPosition: 9,
    },
    total: itemsLength,
  },
};
