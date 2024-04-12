import type { Meta, StoryObj } from '@storybook/react';

import { getGarantiesFinancièresTypeLabel } from '../getGarantiesFinancièresTypeLabel';

import {
  DétailsGarantiesFinancièresPage,
  DétailsGarantiesFinancièresPageProps,
} from './DétailsGarantiesFinancières.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières/Détails',
  component: DétailsGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DétailsGarantiesFinancièresPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: DétailsGarantiesFinancièresPageProps['projet'] = {
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

export const GarantiesFinancieresActuellesComplètes: Story = {
  args: {
    projet,
    actuelles: {
      type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
      dateÉchéance: '2023-07-01',
      dateConstitution: '2022-10-01',
      soumisLe: '2021-09-23',
      validéLe: '2021-10-23',
      attestation: 'path/to/attestation.pdf',
      action: 'modifier',
      dernièreMiseÀJour: {
        date: '2021-10-23',
        par: 'DREAL#1',
      },
    },
    historiqueDépôts: [
      {
        type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
        attestation: 'path/to/attestation.pdf',
        statut: 'validé',
        dateÉchéance: '2023-07-01',
        dateConstitution: '2022-10-01',
        soumisLe: '2022-10-01',
        dernièreMiseÀJour: {
          date: '2022-11-01',
          par: 'DREAL#1',
        },
      },
      {
        type: getGarantiesFinancièresTypeLabel('consignation'),
        dateConstitution: '2021-01-01',
        attestation: 'path/to/attestation.pdf',
        statut: 'rejeté',
        soumisLe: '2021-02-01',
        dernièreMiseÀJour: {
          date: '2021-02-15',
          par: 'DREAL#1',
        },
      },
    ],
  },
};

export const GarantiesFinancieresActuellesComplètesAvecDépôtEnCours: Story = {
  args: {
    projet,
    actuelles: {
      type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
      dateÉchéance: '2023-07-01',
      dateConstitution: '2022-10-01',
      soumisLe: '2021-09-23',
      validéLe: '2021-10-23',
      attestation: 'path/to/attestation.pdf',
      action: 'modifier',
      dernièreMiseÀJour: {
        date: '2021-10-23',
        par: 'DREAL#1',
      },
    },
    dépôtEnCours: {
      type: getGarantiesFinancièresTypeLabel('consignation'),
      dateConstitution: '2024-01-01',
      attestation: 'path/to/attestation.pdf',
      statut: 'en-cours',
      soumisLe: '2021-09-23',
      dernièreMiseÀJour: {
        date: '2024-01-01',
        par: 'PORTEUR#1',
      },
      action: 'modifier',
    },
    historiqueDépôts: [
      {
        type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
        attestation: 'path/to/attestation.pdf',
        statut: 'validé',
        dateÉchéance: '2023-07-01',
        dateConstitution: '2022-10-01',
        soumisLe: '2022-10-01',
        dernièreMiseÀJour: {
          date: '2022-11-01',
          par: 'DREAL#1',
        },
      },
      {
        type: getGarantiesFinancièresTypeLabel('consignation'),
        dateConstitution: '2021-01-01',
        attestation: 'path/to/attestation.pdf',
        statut: 'rejeté',
        soumisLe: '2021-02-01',
        dernièreMiseÀJour: {
          date: '2021-02-15',
          par: 'DREAL#1',
        },
      },
    ],
  },
};

export const GarantiesFinancieresActuellesIncomplètesSansDépôt: Story = {
  args: {
    projet,
    action: 'soumettre',
    actuelles: {
      type: getGarantiesFinancièresTypeLabel('six-mois-après-achèvement'),
      soumisLe: '2024-01-01',
      validéLe: '2024-01-15',
      attestation: 'path/to/attestation.pdf',
      action: 'enregister-attestation',
      dernièreMiseÀJour: {
        date: '2024-01-15',
        par: 'PORTEUR#1',
      },
    },
    historiqueDépôts: [],
  },
};

export const GarantiesFinancieresVideAvecUnDépôtEnCours: Story = {
  args: {
    projet,
    dépôtEnCours: {
      type: getGarantiesFinancièresTypeLabel('consignation'),
      dateConstitution: '2024-01-01',
      attestation: 'path/to/attestation.pdf',
      statut: 'en-cours',
      soumisLe: '2021-09-23',
      dernièreMiseÀJour: {
        date: '2024-01-01',
        par: 'PORTEUR#1',
      },
      action: 'modifier',
    },
    historiqueDépôts: [],
  },
};

export const GarantiesFinancieresVideAvecActionSoumettre: Story = {
  args: {
    projet,
    historiqueDépôts: [],
    action: 'soumettre',
  },
};

export const GarantiesFinancieresVideAvecActionEnregistrer: Story = {
  args: {
    projet,
    historiqueDépôts: [],
    action: 'enregistrer',
  },
};
