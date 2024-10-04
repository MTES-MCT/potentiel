import type { Meta, StoryObj } from '@storybook/react';
import { faker } from '@faker-js/faker';

import { CorrigerCandidaturePage } from './CorrigerCandidature.page';

const meta = {
  title: 'Pages/Candidature/Corriger/CorrigerCandidaturePage',
  component: CorrigerCandidaturePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    candidature: {
      nomProjet: 'Boulodrome de marseille',
      emailContact: 'porteur@test.test',
      identifiantProjet: 'Eolien#2##test',
      nomCandidat: faker.company.name(),
      evaluationCarboneSimplifiée: 1.4,
      historiqueAbandon: 'première-candidature',
      localité: {
        adresse1: faker.location.streetAddress(),
        adresse2: faker.location.secondaryAddress(),
        codePostal: faker.location.zipCode(),
        commune: faker.location.city(),
      },
      nomReprésentantLégal: faker.person.fullName(),
      noteTotale: 8.6,
      prixRéference: 1.6,
      puissanceÀLaPointe: false,
      puissanceProductionAnnuelle: 1,
      sociétéMère: faker.company.name(),
      statut: 'classé',
      technologie: 'eolien',
    },
    estNotifiée: false,
  },
};
