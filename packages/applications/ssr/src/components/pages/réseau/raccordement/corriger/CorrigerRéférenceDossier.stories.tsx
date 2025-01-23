import type { Meta, StoryObj } from '@storybook/react';

import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Raccordement } from '@potentiel-domain/laureat';

import { CorrigerRéférenceDossierPage } from './CorrigerRéférenceDossier.page';

const meta = {
  title: 'Pages/Réseau/Raccordement/Corriger/CorrigerRéférenceDossierPage',
  component: CorrigerRéférenceDossierPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gestionnaireRéseau: {
      contactEmail: Option.none,
      raisonSociale: 'Enedis',
      identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
      aideSaisieRéférenceDossierRaccordement: {
        expressionReguliere: ExpressionRegulière.accepteTout,
        format: 'Format',
        légende: 'Légende',
      },
    },
    identifiantProjet: 'testAO#1#2#3',
    dossierRaccordement: {
      identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
      référence: Raccordement.RéférenceDossierRaccordement.convertirEnValueType('abcd'),
      identifiantProjet: IdentifiantProjet.inconnu,
      demandeComplèteRaccordement: {},
    },
    lienRetour: '',
  },
};
