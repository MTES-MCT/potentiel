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
  dateDésignation: '23/10/2021',
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
      dateConstitution: '23/10/2021',
      statut: 'en-cours',
      soumisLe: '01/01/2022',
      attestation: 'path/to/attestationConstitution',
      dernièreMiseÀJour: {
        date: '01/01/2022',
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
      dateÉchéance: '23/10/2023',
      dateConstitution: '23/10/2023',
      soumisLe: '01/01/2022',
      attestation: 'path/to/attestationConstitution',
      dernièreMiseÀJour: {
        date: '15/01/2022',
        par: 'DREAL#1',
      },
    },
    actions: ['supprimer'],
    showWarning: true,
    typesGarantiesFinancières,
  },
};
