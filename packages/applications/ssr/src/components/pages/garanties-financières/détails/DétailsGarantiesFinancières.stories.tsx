import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

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
  dateDésignation: new Date('2021-10-23').toISOString() as Iso8601DateTime,
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
      dateÉchéance: new Date('2023-07-01').toISOString() as Iso8601DateTime,
      dateConstitution: new Date('2022-10-01').toISOString() as Iso8601DateTime,
      soumisLe: new Date('2021-09-23').toISOString() as Iso8601DateTime,
      validéLe: new Date('2021-10-23').toISOString() as Iso8601DateTime,
      attestation: 'path/to/attestation.pdf',
      actions: ['modifier'],
      dernièreMiseÀJour: {
        date: new Date('2021-10-23').toISOString() as Iso8601DateTime,
        par: 'DREAL#1',
      },
    },
  },
};

export const GarantiesFinancieresActuellesComplètesAvecDépôtEnCours: Story = {
  args: {
    projet,
    actuelles: {
      type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
      dateÉchéance: new Date('2023-07-01').toISOString() as Iso8601DateTime,
      dateConstitution: new Date('2022-10-01').toISOString() as Iso8601DateTime,
      soumisLe: new Date('2021-09-23').toISOString() as Iso8601DateTime,
      validéLe: new Date('2021-10-23').toISOString() as Iso8601DateTime,
      attestation: 'path/to/attestation.pdf',
      actions: ['modifier'],
      dernièreMiseÀJour: {
        date: new Date('2021-10-23').toISOString() as Iso8601DateTime,
        par: 'DREAL#1',
      },
    },
    dépôtEnCours: {
      type: getGarantiesFinancièresTypeLabel('consignation'),
      dateConstitution: new Date('2024-01-01').toISOString() as Iso8601DateTime,
      attestation: 'path/to/attestation.pdf',
      dernièreMiseÀJour: {
        date: new Date('2024-01-01').toISOString() as Iso8601DateTime,
        par: 'PORTEUR#1',
      },
      actions: ['modifier'],
    },
  },
};

export const GarantiesFinancieresActuellesIncomplètesSansDépôt: Story = {
  args: {
    projet,
    action: 'soumettre',
    actuelles: {
      type: getGarantiesFinancièresTypeLabel('six-mois-après-achèvement'),
      soumisLe: new Date('2024-01-01').toISOString() as Iso8601DateTime,
      validéLe: new Date('2024-01-15').toISOString() as Iso8601DateTime,
      attestation: 'path/to/attestation.pdf',
      actions: ['enregister-attestation'],
      dernièreMiseÀJour: {
        date: new Date('2024-01-15').toISOString() as Iso8601DateTime,
        par: 'PORTEUR#1',
      },
    },
  },
};

export const GarantiesFinancieresVideAvecUnDépôtEnCours: Story = {
  args: {
    projet,
    dépôtEnCours: {
      type: getGarantiesFinancièresTypeLabel('consignation'),
      dateConstitution: new Date('2024-01-01').toISOString() as Iso8601DateTime,
      attestation: 'path/to/attestation.pdf',
      dernièreMiseÀJour: {
        date: new Date('2024-01-01').toISOString() as Iso8601DateTime,
        par: 'PORTEUR#1',
      },
      actions: ['modifier'],
    },
  },
};

export const GarantiesFinancieresVideAvecActionSoumettre: Story = {
  args: {
    projet,
    action: 'soumettre',
  },
};

export const GarantiesFinancieresVideAvecActionEnregistrer: Story = {
  args: {
    projet,
    action: 'enregistrer',
  },
};
