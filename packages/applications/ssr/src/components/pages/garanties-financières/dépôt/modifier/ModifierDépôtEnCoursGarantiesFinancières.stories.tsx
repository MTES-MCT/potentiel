import type { Meta, StoryObj } from '@storybook/react';

import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/utils/garanties-financières/typesGarantiesFinancièresPourFormulaire';

import {
  ModifierDépôtEnCoursGarantiesFinancièresPage,
  ModifierDépôtEnCoursGarantiesFinancièresProps,
} from './ModifierDépôtEnCoursGarantiesFinancières.page';

const meta = {
  title: 'Pages/Garanties-financières/Dépôt/Modifier',
  component: ModifierDépôtEnCoursGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierDépôtEnCoursGarantiesFinancièresProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: ModifierDépôtEnCoursGarantiesFinancièresProps['projet'] = {
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

const typesGarantiesFinancières: ModifierDépôtEnCoursGarantiesFinancièresProps['typesGarantiesFinancières'] =
  typesGarantiesFinancièresSansInconnuPourFormulaire;

export const EnTantQueDreal: Story = {
  args: {
    projet,
    dépôtEnCours: {
      type: 'consignation',
      dateConstitution: '2021-10-23',
      statut: 'en-cours',
      soumisLe: '2022-01-01',
      attestation: 'path/to/attestationConstitution',
      dernièreMiseÀJour: {
        date: '2022-01-01',
        par: 'PORTEUR#1',
      },
    },
    actions: ['valider', 'rejeter'],
    typesGarantiesFinancières,
  },
};

export const EnTantQuePorteur: Story = {
  args: {
    projet,
    dépôtEnCours: {
      type: 'avec-date-échéance',
      statut: 'en-cours',
      dateÉchéance: '2023-10-23',
      dateConstitution: '2021-10-23',
      soumisLe: '2022-01-01',
      attestation: 'path/to/attestationConstitution',
      dernièreMiseÀJour: {
        date: '2022-01-15',
        par: 'DREAL#1',
      },
    },
    actions: ['supprimer'],
    showWarning: true,
    typesGarantiesFinancières,
  },
};
