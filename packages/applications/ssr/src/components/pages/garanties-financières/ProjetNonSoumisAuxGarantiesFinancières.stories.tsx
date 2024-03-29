import type { Meta, StoryObj } from '@storybook/react';

import {
  ProjetNonSoumisAuxGarantiesFinancièresPage,
  ProjetNonSoumisAuxGarantiesFinancièresProps,
} from './ProjetNonSoumisAuxGarantiesFinancières.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières',
  component: ProjetNonSoumisAuxGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ProjetNonSoumisAuxGarantiesFinancièresProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProjetNonSoumisAuxGarantiesFinancières: Story = {
  args: {
    projet: {
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
    },
  },
};
