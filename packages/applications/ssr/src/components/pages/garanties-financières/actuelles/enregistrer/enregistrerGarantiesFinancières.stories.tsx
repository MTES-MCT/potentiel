import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import {
  EnregistrerGarantiesFinancièresPage,
  EnregistrerGarantiesFinancièresProps,
} from './enregistrerGarantiesFinancières.page';

const meta = {
  title: 'Pages/Garanties-financières/Actuelles/Enregistrer',
  component: EnregistrerGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<EnregistrerGarantiesFinancièresProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const typesGarantiesFinancières: EnregistrerGarantiesFinancièresProps['typesGarantiesFinancières'] =
  [
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

const projet: EnregistrerGarantiesFinancièresProps['projet'] = {
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

export const Default: Story = {
  args: {
    projet,
    typesGarantiesFinancières,
  },
};
