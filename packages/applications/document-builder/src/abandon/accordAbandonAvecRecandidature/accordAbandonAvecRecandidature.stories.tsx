import type { Meta, StoryObj } from '@storybook/react';

import { RéponseAbandonAvecRecandidature } from './RéponseAbandonAvecRecandidature.js';

const meta = {
  title: 'Abandon/AccordAvecRecandidature',
  component: () => {
    return RéponseAbandonAvecRecandidature({
      dateCourrier: new Date().toISOString(),
      projet: {
        identifiantProjet: 'PPE2 Bâtiment#1#2#3',
        nomReprésentantLégal: 'représentant',
        nomCandidat: 'candidat',
        email: 'porteur@test.test',
        nom: 'nom projet',
        commune: 'commune',
        codePostal: '75000',
        dateDésignation: new Date().toISOString(),
        puissance: 1,
        unitéPuissance: 'kwh',
      },
      appelOffre: {
        nom: 'PPE2 Bâtiment',
        description: 'description',
        période: '1',
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: 'xx',
          dispositions: 'xx',
        },
      },
      demandeAbandon: {
        date: new Date().toISOString(),
        instructeur: {
          nom: 'nom instructeur',
          fonction: 'fonction instructeur',
        },
      },
      imagesFolderPath: '/images',
    });
  },
  argTypes: {},
} satisfies Meta<{}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
