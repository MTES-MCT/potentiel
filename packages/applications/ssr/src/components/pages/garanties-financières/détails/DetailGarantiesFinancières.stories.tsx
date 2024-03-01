import type { Meta, StoryObj } from '@storybook/react';

import { getGarantiesFinancièresTypeLabel } from '../getGarantiesFinancièresTypeLabel';

import {
  DetailGarantiesFinancièresPage,
  DetailGarantiesFinancièresPageProps,
} from './DetailGarantiesFinancières.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières/Détail/DetailGarantiesFinancièresPage',
  component: DetailGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DetailGarantiesFinancièresPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: DetailGarantiesFinancièresPageProps['projet'] = {
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

export const GarantiesFinancieresValidées: Story = {
  args: {
    projet,
    misÀJourLe: '2021-10-23',
    statut: 'validé',
    actuelles: {
      type: 'avec-date-échéance',
      typeLabel: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
      dateConstitution: '2021-09-23',
      attestation: 'path/to/attestation.pdf',
    },
    dépôts: [
      {
        type: 'avec-date-échéance',
        typeLabel: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
        dateÉchéance: '2023-10-23',
        dateConstitution: '2021-09-23',
        attestation: 'path/to/attestation.pdf',
        statut: 'validé',
        validation: {
          validéLe: '2021-10-23',
          validéPar: 'admin#1',
        },
        déposéLe: '2021-09-23',
      },
      {
        type: 'consignation',
        typeLabel: getGarantiesFinancièresTypeLabel('consignation'),
        dateConstitution: '2021-07-23',
        attestation: 'path/to/attestation.pdf',
        statut: 'rejeté',
        validation: {
          validéLe: '2021-08-23',
          validéPar: 'admin#1',
        },
        déposéLe: '2021-07-23',
      },
      {
        type: 'six-mois-après-achèvement',
        typeLabel: getGarantiesFinancièresTypeLabel('six-mois-après-achèvement'),
        dateConstitution: '2021-07-23',
        attestation: 'path/to/attestation.pdf',
        statut: 'rejeté',
        validation: {
          validéLe: '2021-08-23',
          validéPar: 'admin#1',
        },
        déposéLe: '2021-07-23',
      },
      {
        type: 'consignation',
        typeLabel: getGarantiesFinancièresTypeLabel('consignation'),
        dateConstitution: '2021-07-23',
        attestation: 'path/to/attestation.pdf',
        statut: 'rejeté',
        validation: {
          validéLe: '2021-08-23',
          validéPar: 'admin#1',
        },
        déposéLe: '2021-07-23',
      },
    ],
  },
};

export const GarantiesFinancieresAvecUnDépôtEnCours: Story = {
  args: {
    projet,
    misÀJourLe: '2021-10-23',
    statut: 'à-traiter',
    dépôts: [
      {
        type: 'avec-date-échéance',
        typeLabel: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
        dateÉchéance: '2023-10-23',
        dateConstitution: '2021-09-23',
        attestation: 'path/to/attestation.pdf',
        statut: 'en-cours',
        validation: {
          validéLe: '2021-10-23',
          validéPar: 'admin#1',
        },
        déposéLe: '2021-09-23',
      },
    ],
  },
};
