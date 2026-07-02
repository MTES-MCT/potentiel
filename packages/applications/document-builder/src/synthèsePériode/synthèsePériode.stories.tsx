import type { Meta, StoryObj } from '@storybook/react';

import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { SynthèsePériode, type SynthèsePériodeProps } from './SynthèsePériode.js';

const donnéesPériodes = Object.fromEntries(
  appelsOffreData.flatMap((appelOffre) =>
    appelOffre.periodes.map((période): [string, SynthèsePériodeProps['période']] => [
      `${appelOffre.id}#${période.id}`,
      {
        titre: période.title,
        cycleAppelOffres: appelOffre.cycleAppelOffre,
        puissanceRecherchée: '',
        titreAppelOffres: appelOffre.title,
      },
    ]),
  ),
);

const meta = {
  title: 'Candidature/SynthèseLauréatsPériode',
  component: ({ période }) => {
    return SynthèsePériode({
      dateCourrier: new Date().toISOString(),
      imagesFolderPath: '/images',
      lauréats: [
        {
          nom: 'Société A',
          nomProjet: 'Le-nez-au-vent',
          puissance: '80',
          commune: 'Etaules',
          département: 'Charente-Maritime',
          région: 'Nouvelle-Aquitaine',
        },
        {
          nom: 'Société B',
          nomProjet: 'Vive le vent',
          puissance: '120',
          commune: 'Mulhouse',
          département: 'Haut-Rhin',
          région: 'Grand Est',
        },
        {
          nom: 'Société C',
          nomProjet: 'Bon vent',
          puissance: '50',
          commune: 'Biarritz',
          département: 'Pyrénées-Atlantiques',
          région: 'Nouvelle-Aquitaine',
        },
        {
          nom: 'Société C',
          nomProjet: 'Le vent tourne',
          puissance: '50',
          commune: 'Lorient',
          département: 'Morbihan',
          région: 'Bretagne',
        },
        {
          nom: 'Société D',
          nomProjet: 'Sous le vent',
          puissance: '70',
          commune: 'Paris',
          département: 'Paris',
          région: 'Île-de-France',
        },
        {
          nom: 'Société D',
          nomProjet: 'Rose des vents',
          puissance: '80',
          commune: 'Saint-Amand-sur-Fion',
          département: 'Marne',
          région: 'Grand Est',
        },
      ],
      période: donnéesPériodes[période],
      synthèse: {
        candidats: { nombre: '90', puissanceCumulée: '1200' },
        lauréats: { nombre: '50', puissanceCumulée: '900', prixMoyenPondéré: '50' },
      },
    });
  },
  argTypes: {
    période: {
      control: { type: 'select' },
      options: Object.keys(donnéesPériodes),
    },
  },
} satisfies Meta<{ période: string }>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { période: 'PPE2 - Eolien#1' },
};
