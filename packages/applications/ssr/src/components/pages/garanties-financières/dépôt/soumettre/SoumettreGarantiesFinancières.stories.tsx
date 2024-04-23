import type { Meta, StoryObj } from '@storybook/react';

import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/utils/garanties-financières/typesGarantiesFinancièresPourFormulaire';
import { Iso8601DateTime } from '@/utils/formatDate';

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

const typesGarantiesFinancières: SoumettreGarantiesFinancièresProps['typesGarantiesFinancières'] =
  typesGarantiesFinancièresSansInconnuPourFormulaire;

const projet: SoumettreGarantiesFinancièresProps['projet'] = {
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
