import type { Meta, StoryObj } from '@storybook/react';

import {
  DétailsGarantiesFinancières,
  DétailsGarantiesFinancièresProps,
} from './DétailsGarantiesFinancières.page';

const meta = {
  title: 'Pages/Garanties-financières/Détail',
  component: DétailsGarantiesFinancières,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DétailsGarantiesFinancièresProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: DétailsGarantiesFinancièresProps['projet'] = {
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

export const Validées: Story = {
  args: {
    projet,
    statut: 'validé',
    garantiesFinancières: {
      validées: {
        type: 'consignation',
        dateConstitution: '2021-10-23',
        validéLe: '2021-10-23',
        attestation: 'path/to/attestationConstitution',
        actions: ['modifier', 'ajouter'],
      },
    },
  },
};

export const ATraiter: Story = {
  args: {
    projet,
    statut: 'à-traiter',
    garantiesFinancières: {
      àTraiter: {
        type: 'consignation',
        dateConstitution: '2021-10-23',
        validéLe: '2021-10-23',
        attestation: 'path/to/attestationConstitution',
        actions: ['modifier'],
      },
    },
  },
};

export const EnAttente: Story = {
  args: {
    projet,
    statut: 'en-attente',
    garantiesFinancières: {
      enAttente: {
        dateLimiteSoumission: '2021-10-23',
        demandéLe: '2021-10-23',
        actions: ['enregistrer'],
      },
    },
  },
};

export const ValidéesAvecATraiter: Story = {
  args: {
    projet,
    statut: 'validé',
    garantiesFinancières: {
      validées: {
        type: 'consignation',
        dateConstitution: '2021-10-23',
        validéLe: '2021-10-23',
        attestation: 'path/to/attestationConstitution',
        actions: ['modifier'],
      },
      àTraiter: {
        type: 'consignation',
        dateConstitution: '2021-10-23',
        validéLe: '2021-10-23',
        attestation: 'path/to/attestationConstitution',
        actions: ['modifier'],
      },
    },
  },
};
