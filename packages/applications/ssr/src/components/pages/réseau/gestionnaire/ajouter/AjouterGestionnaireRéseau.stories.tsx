import type { Meta, StoryObj } from '@storybook/react';

import { AjouterGestionnaireRéseauPage } from './AjouterGestionnaireRéseau.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Gestionnaire/Ajouter/AjouterGestionnaireRéseauPage',
  component: AjouterGestionnaireRéseauPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
