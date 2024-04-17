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
  dateDésignation: '23/10/2021',
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
      dateÉchéance: '01/07/2023',
      dateConstitution: '01/10/2022',
      soumisLe: '23/09/2021',
      validéLe: '23/10/2021',
      attestation: 'path/to/attestation.pdf',
      action: 'modifier',
      dernièreMiseÀJour: {
        date: '23/10/2021',
        par: 'DREAL#1',
      },
    },
    historiqueDépôts: [
      {
        type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
        attestation: 'path/to/attestation.pdf',
        statut: 'validé',
        dateÉchéance: '01/07/2023',
        dateConstitution: '01/10/2022',
        soumisLe: '01/10/2022',
        dernièreMiseÀJour: {
          date: '01/11/2022',
          par: 'DREAL#1',
        },
      },
      {
        type: getGarantiesFinancièresTypeLabel('consignation'),
        dateConstitution: '01/01/2021',
        attestation: 'path/to/attestation.pdf',
        statut: 'rejeté',
        soumisLe: '01/02/2021',
        dernièreMiseÀJour: {
          date: '15/02/2021',
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
      dateÉchéance: '01/07/2023',
      dateConstitution: '01/10/2022',
      soumisLe: '23/09/2021',
      validéLe: '23/10/2021',
      attestation: 'path/to/attestation.pdf',
      action: 'modifier',
      dernièreMiseÀJour: {
        date: '23/10/2021',
        par: 'DREAL#1',
      },
    },
    dépôtEnCours: {
      type: getGarantiesFinancièresTypeLabel('consignation'),
      dateConstitution: '01/01/2024',
      attestation: 'path/to/attestation.pdf',
      statut: 'en-cours',
      soumisLe: '23/09/2021',
      dernièreMiseÀJour: {
        date: '01/01/2024',
        par: 'PORTEUR#1',
      },
      action: 'modifier',
    },
    historiqueDépôts: [
      {
        type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
        attestation: 'path/to/attestation.pdf',
        statut: 'validé',
        dateÉchéance: '01/07/2023',
        dateConstitution: '01/10/2022',
        soumisLe: '01/10/2022',
        dernièreMiseÀJour: {
          date: '01/11/2021',
          par: 'DREAL#1',
        },
      },
      {
        type: getGarantiesFinancièresTypeLabel('consignation'),
        dateConstitution: '01/01/2021',
        attestation: 'path/to/attestation.pdf',
        statut: 'rejeté',
        soumisLe: '01/02/2021',
        dernièreMiseÀJour: {
          date: '15/02/2021',
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
      soumisLe: '01/01/2024',
      validéLe: '15/01/2024',
      attestation: 'path/to/attestation.pdf',
      action: 'enregister-attestation',
      dernièreMiseÀJour: {
        date: '15/01/2024',
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
      dateConstitution: '01/01/2024',
      attestation: 'path/to/attestation.pdf',
      statut: 'en-cours',
      soumisLe: '23/09/2021',
      dernièreMiseÀJour: {
        date: '01/01/2024',
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
