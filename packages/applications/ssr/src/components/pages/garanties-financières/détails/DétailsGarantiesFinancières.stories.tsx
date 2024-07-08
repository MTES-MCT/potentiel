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

export const GarantiesFinancieresActuellesComplètes: Story = {
  args: {
    identifiantProjet: 'identifiantProjet#1',
    afficherInfoConditionsMainlevée: true,
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
    identifiantProjet: 'identifiantProjet#1',
    afficherInfoConditionsMainlevée: true,
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
    identifiantProjet: 'identifiantProjet#1',
    afficherInfoConditionsMainlevée: true,
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
    identifiantProjet: 'identifiantProjet#1',
    afficherInfoConditionsMainlevée: true,
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
    identifiantProjet: 'identifiantProjet#1',
    afficherInfoConditionsMainlevée: true,
    action: 'soumettre',
  },
};

export const GarantiesFinancieresVideAvecActionEnregistrer: Story = {
  args: {
    identifiantProjet: 'identifiantProjet#1',
    afficherInfoConditionsMainlevée: true,
    action: 'enregistrer',
  },
};
