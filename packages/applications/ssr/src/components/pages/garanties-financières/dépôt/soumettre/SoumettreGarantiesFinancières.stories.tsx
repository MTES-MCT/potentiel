import type { Meta, StoryObj } from '@storybook/react';

import {
  SoumettreGarantiesFinancièresPage,
  SoumettreGarantiesFinancièresProps,
} from './SoumettreGarantiesFinancières.page';

const meta = {
  title: 'Pages/Garanties-financières/Dépôt/Soumettre',
  component: SoumettreGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<SoumettreGarantiesFinancièresProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const typesGarantiesFinancières: SoumettreGarantiesFinancièresProps['typesGarantiesFinancières'] = [
  {
    label: 'Consignation',
    value: 'consignation',
  },
  {
    label: "Avec date d'échéance",
    value: 'avec-date-échéance',
  },
  {
    label: 'Six mois après achèvement',
    value: 'six-mois-après-achèvement',
  },
];

const projet: SoumettreGarantiesFinancièresProps['projet'] = {
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

export const Default: Story = {
  args: {
    projet,
    typesGarantiesFinancières,
  },
};

export const DépôtEnCoursExistant: Story = {
  args: {
    projet,
    typesGarantiesFinancières,
    dépôtEnCoursExistant: true,
  },
};
