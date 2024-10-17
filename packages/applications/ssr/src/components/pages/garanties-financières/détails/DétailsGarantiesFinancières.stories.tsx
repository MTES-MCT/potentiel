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
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    infoBoxMainlevée: {
      afficher: true,
      actions: 'transmettre-attestation-conformité',
    },
    infoBoxGarantiesFinancières: {
      afficher: false,
    },
    actuelles: {
      type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
      statut: 'levé',
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
      isActuelle: true,
    },
  },
};

export const GarantiesFinancieresActuellesComplètesAvecDépôtEnCours: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    infoBoxMainlevée: {
      afficher: true,
      actions: 'transmettre-attestation-conformité',
    },
    infoBoxGarantiesFinancières: {
      afficher: false,
    },
    actuelles: {
      type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
      statut: 'validé',
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
      isActuelle: true,
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
      isActuelle: false,
    },
  },
};

export const GarantiesFinancieresActuellesComplètesAvecArchives: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    infoBoxMainlevée: {
      afficher: true,
      actions: 'transmettre-attestation-conformité',
    },
    infoBoxGarantiesFinancières: {
      afficher: false,
    },
    actuelles: {
      type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
      statut: 'validé',
      dateÉchéance: new Date('2023-07-01').toISOString() as Iso8601DateTime,
      dateConstitution: new Date('2022-10-01').toISOString() as Iso8601DateTime,
      soumisLe: new Date('2021-09-23').toISOString() as Iso8601DateTime,
      validéLe: new Date('2021-10-23').toISOString() as Iso8601DateTime,
      attestation: 'path/to/attestation.pdf',
      actions: [],
      dernièreMiseÀJour: {
        date: new Date('2021-10-23').toISOString() as Iso8601DateTime,
        par: 'DREAL#1',
      },
      isActuelle: true,
    },
    archivesGarantiesFinancières: [
      {
        type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
        motif: 'renouvellement des garanties financières échues',
        statut: 'échu',
        dateÉchéance: new Date('2023-07-01').toISOString() as Iso8601DateTime,
        dateConstitution: new Date('2022-10-01').toISOString() as Iso8601DateTime,
        soumisLe: new Date('2021-09-23').toISOString() as Iso8601DateTime,
        validéLe: new Date('2021-10-23').toISOString() as Iso8601DateTime,
        dernièreMiseÀJour: {
          date: new Date('2021-1-23').toISOString() as Iso8601DateTime,
          par: 'DREAL#1',
        },
      },
      {
        type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
        motif: 'changement de producteur',
        statut: 'validé',
        dateÉchéance: new Date('2023-07-01').toISOString() as Iso8601DateTime,
        dateConstitution: new Date('2022-10-01').toISOString() as Iso8601DateTime,
        soumisLe: new Date('2021-09-23').toISOString() as Iso8601DateTime,
        validéLe: new Date('2021-10-23').toISOString() as Iso8601DateTime,
        attestation: 'path/to/attestation.pdf',
        dernièreMiseÀJour: {
          date: new Date('2021-1-23').toISOString() as Iso8601DateTime,
          par: 'DREAL#1',
        },
      },
    ],
  },
};

export const GarantiesFinancieresActuellesIncomplètesSansDépôt: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    infoBoxMainlevée: {
      afficher: true,
      actions: 'transmettre-attestation-conformité',
    },
    infoBoxGarantiesFinancières: {
      afficher: true,
    },
    action: 'soumettre',
    actuelles: {
      type: getGarantiesFinancièresTypeLabel('six-mois-après-achèvement'),
      statut: 'levé',
      soumisLe: new Date('2024-01-01').toISOString() as Iso8601DateTime,
      validéLe: new Date('2024-01-15').toISOString() as Iso8601DateTime,
      attestation: 'path/to/attestation.pdf',
      actions: ['enregister-attestation'],
      dernièreMiseÀJour: {
        date: new Date('2024-01-15').toISOString() as Iso8601DateTime,
        par: 'PORTEUR#1',
      },
      isActuelle: true,
    },
  },
};

export const GarantiesFinancieresVideAvecUnDépôtEnCours: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    infoBoxMainlevée: {
      afficher: true,
      actions: 'transmettre-attestation-conformité',
    },
    infoBoxGarantiesFinancières: {
      afficher: false,
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
      isActuelle: false,
    },
  },
};

export const GarantiesFinancieresVideAvecActionSoumettre: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    infoBoxMainlevée: {
      afficher: true,
      actions: 'transmettre-attestation-conformité',
    },
    infoBoxGarantiesFinancières: {
      afficher: true,
    },
    action: 'soumettre',
  },
};

export const GarantiesFinancieresVideAvecActionEnregistrer: Story = {
  args: {
    identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
    infoBoxMainlevée: {
      afficher: true,
      actions: 'transmettre-attestation-conformité',
    },
    infoBoxGarantiesFinancières: {
      afficher: false,
    },
    action: 'enregistrer',
  },
};
