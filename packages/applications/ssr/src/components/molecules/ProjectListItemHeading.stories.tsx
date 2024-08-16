import type { Meta, StoryObj } from '@storybook/react';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjectListItemHeading, ProjectListItemHeadingProps } from './ProjectListItemHeading';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Molecules/ProjectListItemHeading',
  component: ProjectListItemHeading,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<ProjectListItemHeadingProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(
      'CRE4 - Autoconsommation métropole TEST#2##200-2',
    ),
    nomProjet: 'Boulodrome de Marseille',
    prefix: 'Abandon du projet',
  },
};
