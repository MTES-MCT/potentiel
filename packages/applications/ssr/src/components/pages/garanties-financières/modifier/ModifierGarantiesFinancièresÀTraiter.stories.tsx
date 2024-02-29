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

const typesGarantiesFinancières: ModifierGarantiesFinancièresÀTraiterProps['typesGarantiesFinancières'] =
  [
    {
      label: 'Consignation',
      value: 'consignation',
    },
    {
      label: "Avec date d'échéance",
      value: 'avec-date-échéance',
    },
    {
      label: 'Six mois après achèvement',
      value: 'six-mois-après-achèvement',
    },
  ];

export const EnTantQueDreal: Story = {
  args: {
    projet,
    statut: 'en-attente',
    garantiesFinancières: {
      type: 'consignation',
      dateConsitution: '2021-10-23',
      attestation: 'path/to/attestationConstitution',
    },
    actions: ['valider', 'rejeter'],
    typesGarantiesFinancières,
  },
};

export const EnTantQuePorteur: Story = {
  args: {
    projet,
    statut: 'à-traiter',
    garantiesFinancières: {
      type: 'avec-date-échéance',
      dateÉchéance: '2021-10-23',
      dateConsitution: '2021-10-23',
      attestation: 'path/to/attestationConstitution',
    },
    actions: ['supprimer'],
    showWarning: true,
    typesGarantiesFinancières,
  },
};
