import type { Meta, StoryObj } from '@storybook/react';

import { GestionnaireRéseauListPage } from './GestionnaireRéseauList.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Gestionnaire/Lister/GestionnaireRéseauListPage',
  component: GestionnaireRéseauListPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof GestionnaireRéseauListPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const itemsLength = 10;
export const Default: Story = {
  args: {
    list: {
      items: Array.from({ length: itemsLength }, (_, i) => ({
        identifiantGestionnaireRéseau: `identifiantGestionnaireRéseau${i}`,
        raisonSociale: `Gestionnaire#${(i += 1)}`,
      })),
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: itemsLength,
    },
  },
};
