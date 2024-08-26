import type { Meta, StoryObj } from '@storybook/react';
import MainNavigation from '@codegouvfr/react-dsfr/MainNavigation';
import DsfrHeader from '@codegouvfr/react-dsfr/Header';

import { Role } from '@potentiel-domain/utilisateur';

import { getNavigationItemsBasedOnRole } from './UserBasedRoleNavigation';

const Navigation = ({ role }: { role: Role.RawType | undefined }) => {
  const navigationItems = role
    ? getNavigationItemsBasedOnRole({ role: Role.convertirEnValueType(role) })
    : [];

  return (
    <DsfrHeader
      navigation={<MainNavigation items={navigationItems} />}
      brandTop={
        <>
          République
          <br />
          Française
        </>
      }
      homeLinkProps={{ href: '/', title: "Retour à l'accueil" }}
    />
  );
};

const meta = {
  title: 'Molecules/UserBasedRoleNavigation',
  component: Navigation,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: {
        type: 'select',
        labels: Role.roles,
      },
    },
  },
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { role: undefined },
};

export const Admin: Story = {
  args: { role: 'admin' },
};

export const Porteur: Story = {
  args: { role: 'porteur-projet' },
};

export const Dreal: Story = {
  args: { role: 'dreal' },
};

export const AcheteurObligé: Story = {
  args: { role: 'acheteur-obligé' },
};

export const Ademe: Story = {
  args: { role: 'ademe' },
};

export const DgecValidateur: Story = {
  args: { role: 'dgec-validateur' },
};

export const CaisseDesDépôt: Story = {
  args: { role: 'caisse-des-dépôts' },
};

export const CRE: Story = {
  args: { role: 'cre' },
};
