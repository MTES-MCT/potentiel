import type { Meta, StoryObj } from '@storybook/react';

import { CorrigerRéférenceDossierPage } from './CorrigerRéférenceDossier.page';

const meta = {
  title: 'Pages/Réseau/Raccordement/CorrigerRéférenceDossierPage',
  component: CorrigerRéférenceDossierPage,
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
