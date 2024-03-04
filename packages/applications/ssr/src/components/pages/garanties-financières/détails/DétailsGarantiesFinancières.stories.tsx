import type { Meta, StoryObj } from '@storybook/react';

import {
  DétailsGarantiesFinancièresPage,
  DétailsGarantiesFinancièresProps,
} from './DétailsGarantiesFinancières.page';

const meta = {
  title: 'Pages/Garanties-financières/Détail/V1',
  component: DétailsGarantiesFinancièresPage,
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
        type: 'avec-date-échéance',
        dateÉchéance: '2025-01-01',
        dateConstitution: '2023-11-01',
        validéLe: '2024-01-01',
        attestation: 'path/to/attestationConstitution',
        soumisLe: '2023-12-14',
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
        dateLimiteSoumission: '2024-03-31',
        demandéLe: '2022-12-23',
        actions: ['enregistrer'],
      },
    },
  },
};

export const ValidéesAvecATraiter: Story = {
  args: {
    projet,
    statut: 'à-traiter',
    garantiesFinancières: {
      validées: {
        type: 'consignation',
        dateConstitution: '2021-10-23',
        validéLe: '2021-10-23',
        attestation: 'path/to/attestationConstitution',
        actions: ['modifier'],
      },
      àTraiter: {
        type: 'six-mois-après-achèvement',
        dateConstitution: '2021-10-23',
        validéLe: '2021-10-23',
        attestation: 'path/to/attestationConstitution',
        actions: ['modifier'],
      },
    },
  },
};
