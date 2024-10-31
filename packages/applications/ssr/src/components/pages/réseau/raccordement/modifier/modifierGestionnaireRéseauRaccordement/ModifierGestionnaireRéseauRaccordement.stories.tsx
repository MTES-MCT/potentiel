import type { Meta, StoryObj } from '@storybook/react';

import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import {
  ModifierGestionnaireRéseauRaccordementPage,
  ModifierGestionnaireRéseauRaccordementPageProps,
} from './ModifierGestionnaireRéseauRaccordement.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Modifier/ModifierGestionnaireRéseauRaccordementPage',
  component: ModifierGestionnaireRéseauRaccordementPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ModifierGestionnaireRéseauRaccordementPageProps>;

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
    identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Bâtiment#4#1#id-cre-738'),
    listeGestionnairesRéseau,
    gestionnaireRéseauActuel: listeGestionnairesRéseau[1],
  },
};
