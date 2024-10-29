import type { Meta, StoryObj } from '@storybook/react';

import { CorrigerRéférencesDossierPage } from './CorrigerRéférencesDossier.page';

const meta = {
  title: 'Pages/Réseau/Raccordement/Corriger/CorrigerRéférencesDossierPage',
  component: CorrigerRéférencesDossierPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    csvErrors: [],
    résultatImport: [],
  },
};
