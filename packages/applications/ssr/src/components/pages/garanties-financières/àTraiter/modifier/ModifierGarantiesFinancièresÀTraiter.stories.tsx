import type { Meta, StoryObj } from '@storybook/react';

import {
  ModifierGarantiesFinancièresÀTraiter,
  ModifierGarantiesFinancièresÀTraiterProps,
} from './ModifierGarantiesFinancièresÀTraiter.page';

const meta = {
  title: 'Pages/Garanties-financières/À traiter/Modifier',
  component: ModifierGarantiesFinancièresÀTraiter,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierGarantiesFinancièresÀTraiterProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: ModifierGarantiesFinancièresÀTraiterProps['projet'] = {
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
    actions: ['supprimer'],
    showWarning: true,
  },
};
