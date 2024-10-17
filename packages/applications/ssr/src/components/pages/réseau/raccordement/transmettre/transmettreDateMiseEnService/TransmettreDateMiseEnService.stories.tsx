import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import {
  TransmettreDateMiseEnServicePage,
  TransmettreDateMiseEnServicePageProps,
} from './TransmettreDateMiseEnService.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Transmettre/TransmettreDateMiseEnServicePage',
  component: TransmettreDateMiseEnServicePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TransmettreDateMiseEnServicePageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dossierRaccordement: {
      référence: 'Référence',
    },
    intervalleDatesMeSDélaiCDC2022: {
      min: new Date('2022-09-01').toISOString() as Iso8601DateTime,
      max: new Date('2024-12-31').toISOString() as Iso8601DateTime,
    },
    projet: {
      identifiantProjet: 'PPE2 - Bâtiment#4#1#id-cre-738',
      dateDésignation: new Date('2022-09-01').toISOString() as Iso8601DateTime,
    },
  },
};
