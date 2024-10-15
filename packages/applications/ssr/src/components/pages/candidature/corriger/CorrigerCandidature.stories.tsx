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

const candidature = {
  nomProjet: 'Boulodrome de marseille',
  emailContact: 'porteur@test.test',
  identifiantProjet: 'Eolien#2##test',
  nomCandidat: faker.company.name(),
  evaluationCarboneSimplifiee: 1.4,
  adresse1: faker.location.streetAddress(),
  adresse2: faker.location.secondaryAddress(),
  codePostal: faker.location.zipCode(),
  commune: faker.location.city(),
  nomRepresentantLegal: faker.person.fullName(),
  noteTotale: 8.6,
  prixReference: 1.6,
  puissanceALaPointe: false,
  puissanceProductionAnnuelle: 1,
  societeMere: faker.company.name(),
  statut: 'classé' as const,
  technologie: 'pv' as const,
};

export const NonNotifié: Story = {
  args: {
    candidature,
    estNotifiée: false,
  },
};

export const Notifié: Story = {
  args: {
    candidature,
    estNotifiée: true,
  },
};
