import type { Meta, StoryObj } from '@storybook/react';

import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import {
  TransmettreDemandeComplèteRaccordementPage,
  TransmettreDemandeComplèteRaccordementPageProps,
} from './TransmettreDemandeComplèteRaccordement.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Transmettre/TransmettreDemandeComplèteRaccordement',
  component: TransmettreDemandeComplèteRaccordementPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TransmettreDemandeComplèteRaccordementPageProps>;

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
    gestionnaireRéseauActuel: Option.none,
    identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Bâtiment#4#1#id-cre-738'),
    delaiDemandeDeRaccordementEnMois: { texte: '3 mois', valeur: 3 },
    aDéjàTransmisUneDemandeComplèteDeRaccordement: false,
  },
};

export const AvecGestionnaire: Story = {
  args: {
    listeGestionnairesRéseau,
    gestionnaireRéseauActuel: listeGestionnairesRéseau[1],
    identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Bâtiment#4#1#id-cre-738'),
    delaiDemandeDeRaccordementEnMois: { texte: '3 mois', valeur: 3 },
    aDéjàTransmisUneDemandeComplèteDeRaccordement: false,
  },
};
