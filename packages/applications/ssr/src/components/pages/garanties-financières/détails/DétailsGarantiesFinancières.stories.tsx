import type { Meta, StoryObj } from '@storybook/react';

import { ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import {
  DétailsGarantiesFinancièresPage,
  DétailsGarantiesFinancièresProps,
} from './DétailsGarantiesFinancières.page';

const meta = {
  title: 'Pages/Garanties-financières/Détails/DétailsGarantiesFinancières',
  component: DétailsGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DétailsGarantiesFinancièresProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const projet: ProjetBannerProps = {
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

export const AvecDépôt: Story = {
  args: {
    projet,
    garantiesFinancieres: {
      dépôt: {
        type: 'consignation',
        dateConsitution: '2021-10-23',
        attestationConstitution: 'path/to/attestationConstitution',
      },
    },
  },
};

export const AvecActuelles: Story = {
  args: {
    projet,
    garantiesFinancieres: {
      actuelles: {
        type: 'avec date d’échéance',
        dateÉchéance: '2021-10-23',
        dateConsitution: '2021-10-23',
        attestationConstitution: 'path/to/attestationConstitution',
      },
    },
  },
};
