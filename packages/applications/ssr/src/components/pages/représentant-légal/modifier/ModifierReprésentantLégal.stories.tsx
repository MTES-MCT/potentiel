import type { Meta, StoryObj } from '@storybook/react';

import { IdentifiantProjet } from '@potentiel-domain/common';

import {
  ModifierReprésentantLégalPage,
  ModifierReprésentantLégalPageProps,
} from './ModifierReprésentantLégal.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/ReprésentantLégal/Modifier',
  component: ModifierReprésentantLégalPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierReprésentantLégalPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Bâtiment#4#1#id-cre-738'),
    nomReprésentantLégal: 'Jean Dupont',
    typeReprésentantLégal: {
      type: 'personne-physique',
    },
  },
};
