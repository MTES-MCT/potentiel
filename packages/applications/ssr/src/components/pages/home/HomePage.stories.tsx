import type { Meta, StoryObj } from '@storybook/react';

import { IdentifiantUtilisateur, Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { HomePage, HomePageProps } from './HomePage.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/HomePage',
  component: HomePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<HomePageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NonConnecté: Story = {
  args: {},
};

export const ConnectéEnPorteur: Story = {
  args: {
    utilisateur: Utilisateur.bind({
      identifiantUtilisateur: IdentifiantUtilisateur.convertirEnValueType('test@test.test'),
      nom: 'Test',
      role: Role.porteur,
      groupe: Option.none,
    }),
  },
};

export const ConnectéEnGRD: Story = {
  args: {
    utilisateur: Utilisateur.bind({
      identifiantUtilisateur: IdentifiantUtilisateur.convertirEnValueType('test@test.test'),
      nom: 'Test',
      role: Role.grd,
      groupe: Option.none,
    }),
  },
};

export const ConnectéEnAdmin: Story = {
  args: {
    utilisateur: Utilisateur.bind({
      identifiantUtilisateur: IdentifiantUtilisateur.convertirEnValueType('test@test.test'),
      nom: 'Test',
      role: Role.admin,
      groupe: Option.none,
    }),
  },
};
