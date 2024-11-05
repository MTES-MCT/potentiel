import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { PlainType } from '@potentiel-domain/core';

import { DétailsRaccordementPage, DétailsRaccordementPageProps } from './DétailsRaccordement.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Réseau/Raccordement/Détails',
  component: DétailsRaccordementPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DétailsRaccordementPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const identifiantProjet = IdentifiantProjet.convertirEnValueType('PPE2 - Bâtiment#4#1#id-cre-738');

const gestionnaireRéseau: DétailsRaccordementPageProps['gestionnaireRéseau'] = {
  aideSaisieRéférenceDossierRaccordement: {
    expressionReguliere: { expression: ExpressionRegulière.accepteTout.expression },
    format: 'Format',
    légende: 'Légende',
  },
  contactEmail: { email: 'email@gmail.com' },
  raisonSociale: 'Raison sociale',
  identifiantGestionnaireRéseau: { codeEIC: 'identifiantGestionnaireRéseau#1' },
};

const dossier: PlainType<DétailsRaccordementPageProps['raccordement']['dossiers'][number]> = {
  référence: Raccordement.RéférenceDossierRaccordement.convertirEnValueType('référence-dossier#'),
  demandeComplèteRaccordement: {
    accuséRéception: {
      dateCréation: new Date().toISOString(),
      format: 'application/pdf',
      identifiantProjet: identifiantProjet.formatter(),
      typeDocument: 'accusé-reception#1',
    },
    dateQualification: { date: new Date('2022-05-10').toISOString() as Iso8601DateTime },
  },
  propositionTechniqueEtFinancière: {
    dateSignature: { date: new Date('2022-09-30').toISOString() as Iso8601DateTime },
    propositionTechniqueEtFinancièreSignée: {
      dateCréation: new Date().toISOString(),
      format: 'application/pdf',
      identifiantProjet: identifiantProjet.formatter(),
      typeDocument: 'propositionTechniqueEtFinancièreSignée',
    },
  },
  miseEnService: {
    dateMiseEnService: { date: new Date('2023-12-25').toISOString() as Iso8601DateTime },
  },
  misÀJourLe: { date: new Date().toISOString() },
};

const actions = {
  demandeComplèteRaccordement: { modifierRéférence: true, modifier: true, transmettre: true },
  miseEnService: { modifier: true, transmettre: true },
  propositionTechniqueEtFinancière: { modifier: true, transmettre: true },
  gestionnaireRéseau: { modifier: true },
  supprimer: true,
};

export const Complet: Story = {
  args: {
    identifiantProjet,
    gestionnaireRéseau,
    raccordement: {
      identifiantProjet,
      identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau,
      dossiers: [dossier, dossier],
    },
    actions,
    lienRetour: {
      label: 'Retour',
      href: '',
    },
  },
};

export const Incomplet: Story = {
  args: {
    identifiantProjet,
    gestionnaireRéseau,
    raccordement: {
      identifiantProjet,
      identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau,
      dossiers: [dossier],
    },
    actions: {
      ...actions,
      supprimer: false,
    },
    lienRetour: {
      label: 'Retour',
      href: '',
    },
  },
};

export const GestionnaireInconnu: Story = {
  args: {
    identifiantProjet,
    gestionnaireRéseau: {
      ...gestionnaireRéseau,
      identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
    },
    raccordement: Complet.args.raccordement,
    actions,
    lienRetour: {
      label: 'Retour',
      href: '',
    },
  },
};
