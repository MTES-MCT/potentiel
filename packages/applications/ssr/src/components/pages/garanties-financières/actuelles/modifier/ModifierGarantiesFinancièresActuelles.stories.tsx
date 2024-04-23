import type { Meta, StoryObj } from '@storybook/react';

import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/utils/garanties-financières/typesGarantiesFinancièresPourFormulaire';
import { Iso8601DateTime } from '@/utils/formatDate';

import {
  ModifierGarantiesFinancièresActuellesPage,
  ModifierGarantiesFinancièresActuellesProps,
} from './ModifierGarantiesFinancièresActuelles.page';

const meta = {
  title: 'Pages/Garanties-financières/Actuelles/Modifier',
  component: ModifierGarantiesFinancièresActuellesPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierGarantiesFinancièresActuellesProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: ModifierGarantiesFinancièresActuellesProps['projet'] = {
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

const typesGarantiesFinancières: ModifierGarantiesFinancièresActuellesProps['typesGarantiesFinancières'] =
  typesGarantiesFinancièresSansInconnuPourFormulaire;

export const Default: Story = {
  args: {
    projet,
    typesGarantiesFinancières,
    actuelles: {
      type: 'consignation',
      dateConstitution: new Date('2021-10-23').toISOString() as Iso8601DateTime,
      soumisLe: new Date('2022-01-01').toISOString() as Iso8601DateTime,
      attestation: 'path/to/attestationConstitution',
      dernièreMiseÀJour: {
        date: new Date('2022-01-01').toISOString() as Iso8601DateTime,
        par: 'PORTEUR#1',
      },
    },
  },
};
