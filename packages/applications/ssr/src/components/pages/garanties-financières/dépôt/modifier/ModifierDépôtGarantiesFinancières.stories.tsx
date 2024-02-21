import type { Meta, StoryObj } from '@storybook/react';

import { ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import {
  ModifierDépôtGarantiesFinancières,
  ModifierDépôtGarantiesFinancièresProps,
} from './ModifierDépôtGarantiesFinancières.page';

const meta = {
  title: 'Pages/Garanties-financières/Dépôt/Modifier',
  component: ModifierDépôtGarantiesFinancières,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierDépôtGarantiesFinancièresProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: ProjetBannerProps = {
  identifiantProjet: 'identifiantProjet#1',
  appelOffre: 'Appel offre',
  période: 'Période',
  famille: 'Famille',
  nom: 'Nom du projet',
  dateDésignation: '2021-10-23',
  localité: {
    codePostal: 'XXXXX',
    commune: 'Commune',
    département: 'Département',
    région: 'Région',
  },
  statut: 'classé',
};

export const EnTantQueDreal: Story = {
  args: {
    projet,
    garantiesFinancieres: {
      type: 'consignation',
      dateConsitution: '2021-10-23',
      attestationConstitution: 'path/to/attestationConstitution',
    },
    actions: ['valider', 'rejeter'],
  },
};

export const EnTantQuePorteur: Story = {
  args: {
    projet,
    garantiesFinancieres: {
      type: 'avec date d’échéance',
      dateÉchéance: '2021-10-23',
      dateConsitution: '2021-10-23',
      attestationConstitution: 'path/to/attestationConstitution',
    },
    actions: ['annuler'],
    showWarning: true,
  },
};
