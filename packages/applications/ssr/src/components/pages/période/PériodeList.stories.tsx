import type { Meta, StoryObj } from '@storybook/react';

import { PériodeListPage } from './PériodeList.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Période/Liste',
  component: PériodeListPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filters: [
      {
        label: `Appel d'offres`,
        searchParamKey: 'appelOffre',
        options: [
          { label: 'PPE2 - Fusion', value: 'PPE2 - Fusion' },
          { label: 'PPE2 - Vapeur', value: 'PPE2 - Vapeur' },
          { label: 'PPE2 - Charbon', value: 'PPE2 - Charbon' },
        ],
      },
      {
        label: `Statut`,
        searchParamKey: 'statut',
        options: [
          { label: 'Notifiée', value: 'notifiee' },
          { label: 'À notifier', value: 'a-notifier' },
        ],
      },
    ],
    périodes: [
      {
        identifiantPériode: 'PPE2 - Fusion#1',
        appelOffre: 'PPE2 - Fusion',
        période: '1',
        peutÊtreNotifiée: true,

        totalÉliminés: 1,
        totalLauréats: 1,
        totalCandidatures: 1,
        nouveauxCandidatsANotifier: 0,
      },
      {
        identifiantPériode: 'PPE2 - Fusion#2',
        appelOffre: 'PPE2 - Fusion',
        période: '2',

        peutÊtreNotifiée: true,

        notifiéLe: '2023-01-01T10:00:00.000Z',
        notifiéPar: 'Utilisateur 1',

        totalÉliminés: 10,
        totalLauréats: 5,
        totalCandidatures: 20,
        nouveauxCandidatsANotifier: 4,
      },
      {
        identifiantPériode: 'PPE2 - Fusion#3',
        appelOffre: 'PPE2 - Fusion',
        période: '3',

        peutÊtreNotifiée: false,

        notifiéLe: '2023-01-01T10:00:00.000Z',
        notifiéPar: 'Utilisateur 1',

        totalÉliminés: 10,
        totalLauréats: 5,
        totalCandidatures: 20,
        nouveauxCandidatsANotifier: 0,
      },
      {
        identifiantPériode: 'PPE2 - Vapeur#1',
        appelOffre: 'PPE2 - Vapeur',
        période: '1',

        peutÊtreNotifiée: false,

        notifiéLe: '2023-01-01T10:00:00.000Z',
        notifiéPar: 'Utilisateur 1',

        totalÉliminés: 10,
        totalLauréats: 5,
        totalCandidatures: 20,
        nouveauxCandidatsANotifier: 0,
      },
      {
        identifiantPériode: 'PPE2 - Vapeur#2',
        appelOffre: 'PPE2 - Vapeur',
        période: '2',

        peutÊtreNotifiée: false,

        notifiéLe: '2023-01-01T10:00:00.000Z',
        notifiéPar: 'Utilisateur 1',

        totalÉliminés: 10,
        totalLauréats: 5,
        totalCandidatures: 20,
        nouveauxCandidatsANotifier: 0,
      },
      {
        identifiantPériode: 'PPE2 - Vapeur#3',
        appelOffre: 'PPE2 - Vapeur',
        période: '3',

        peutÊtreNotifiée: false,

        notifiéLe: '2023-01-01T10:00:00.000Z',
        notifiéPar: 'Utilisateur 1',

        totalÉliminés: 10,
        totalLauréats: 5,
        totalCandidatures: 20,
        nouveauxCandidatsANotifier: 0,
      },
      {
        identifiantPériode: 'PPE2 - Vapeur#4',
        appelOffre: 'PPE2 - Vapeur',
        période: '4',

        peutÊtreNotifiée: false,

        notifiéLe: '2023-01-01T10:00:00.000Z',
        notifiéPar: 'Utilisateur 1',

        totalÉliminés: 10,
        totalLauréats: 5,
        totalCandidatures: 20,
        nouveauxCandidatsANotifier: 0,
      },
      {
        identifiantPériode: 'PPE2 - Charbon#1',
        appelOffre: 'CRE4 - Charbon',
        période: '1',

        peutÊtreNotifiée: false,

        notifiéLe: '2023-01-01T10:00:00.000Z',
        notifiéPar: 'Utilisateur 1',

        totalÉliminés: 0,
        totalLauréats: 5,
        totalCandidatures: 20,
        nouveauxCandidatsANotifier: 0,
      },
    ],
    range: {
      endPosition: 50,
      startPosition: 10,
    },
    total: 112,
  },
};
