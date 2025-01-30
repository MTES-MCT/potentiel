import type { Meta, StoryObj } from '@storybook/react';

import { IdentifiantProjet } from '@potentiel-domain/common';

import {
  EnregistrerChangementActionnairePage,
  EnregistrerChangementActionnairePageProps,
} from './EnregistrerChangementActionnaire.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Actionnaire/Modifier',
  component: EnregistrerChangementActionnairePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<EnregistrerChangementActionnairePageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Bâtiment#4#1#id-cre-738'),
    actionnaire: 'CAC40 boy',
  },
};

export const Porteur: Story = {
  args: {
    identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Bâtiment#4#1#id-cre-738'),
    actionnaire: 'CAC40 boy',
  },
};
