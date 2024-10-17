import type { Meta, StoryObj } from '@storybook/react';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { ProjectListItemHeading, ProjectListItemHeadingProps } from './ProjectListItemHeading';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Molecules/Projet/ProjectListItemHeading',
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
      'CRE4 - Autoconsommation métropole TEST#2#1#200-2',
    ),
    nomProjet: 'Boulodrome de Marseille',
    prefix: 'Abandon du projet',
    misÀJourLe: DateTime.now().formatter(),
  },
};
