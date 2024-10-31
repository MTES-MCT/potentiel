import type { Meta, StoryObj } from '@storybook/react';

import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { ExpressionRegulière } from '@potentiel-domain/common';

import { ImporterDatesMiseEnServicePage } from './ImporterDatesMiseEnService.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/ImporterDatesMiseEnServicePage',
  component: ImporterDatesMiseEnServicePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

const listeGestionnairesRéseau = Array.from({ length: 3 }, (_, i) => ({
  identifiantGestionnaireRéseau:
    GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
      `identifiantGestionnaireRéseau#${i}`,
    ),
  aideSaisieRéférenceDossierRaccordement: {
    expressionReguliere: ExpressionRegulière.accepteTout,
    format: 'Format',
    légende: 'Légende',
  },
  raisonSociale: `Raison sociale ${i}`,
  contactEmail: Option.none,
}));

export const Default: Story = {
  args: {
    listeGestionnairesRéseau,
    gestionnaireRéseauActuel: listeGestionnairesRéseau[1],
  },
};
