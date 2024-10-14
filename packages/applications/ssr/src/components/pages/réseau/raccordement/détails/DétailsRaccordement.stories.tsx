import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

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

const gestionnaireRéseau: DétailsRaccordementPageProps['gestionnaireRéseau'] = {
  aideSaisieRéférenceDossierRaccordement: {
    expressionReguliere: 'expresion-régulière',
    format: 'Format',
    légende: 'Légende',
  },
  contactEmail: 'email@gmail.com',
  raisonSociale: 'Raison sociale',
  identifiantGestionnaireRéseau: 'identifiantGestionnaireRéseau#1',
  canEdit: true,
};

const dossier: DétailsRaccordementPageProps['dossiers'][number] = {
  identifiantProjet: 'appelOffre#période#famille#numéroCRE',
  référence: 'référence-dossier#',
  demandeComplèteRaccordement: {
    canEdit: true,
    accuséRéception: 'accusé-reception#1',
    dateQualification: new Date('2022-05-10').toISOString() as Iso8601DateTime,
  },
  propositionTechniqueEtFinancière: {
    canEdit: true,
    dateSignature: new Date('2022-09-30').toISOString() as Iso8601DateTime,
    propositionTechniqueEtFinancièreSignée: 'propositionTechniqueEtFinancièreSignée#1',
  },
  miseEnService: {
    canEdit: true,
    dateMiseEnService: new Date('2023-12-25').toISOString() as Iso8601DateTime,
  },
  canDeleteDossier: false,
};

export const Complet: Story = {
  args: {
    identifiantProjet: 'appelOffre#période#famille#numéroCRE',
    gestionnaireRéseau,
    dossiers: [dossier, dossier],
  },
};

export const Incomplet: Story = {
  args: {
    identifiantProjet: 'identifiantProjet#1',
    gestionnaireRéseau,
    dossiers: [
      {
        ...dossier,
        canDeleteDossier: true,
      },
    ],
  },
};

export const GestionnaireInconnu: Story = {
  args: {
    identifiantProjet: 'identifiantProjet#1',
    gestionnaireRéseau: {
      ...gestionnaireRéseau,
      identifiantGestionnaireRéseau: 'inconnu',
    },
    dossiers: Complet.args.dossiers,
  },
};
