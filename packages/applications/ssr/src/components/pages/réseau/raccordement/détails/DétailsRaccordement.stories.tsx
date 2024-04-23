import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@/utils/formatDate';

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

const projet: DétailsRaccordementPageProps['projet'] = {
  identifiantProjet: 'identifiantProjet#1',
  appelOffre: 'Appel offre',
  période: 'Période',
  famille: 'Famille',
  nom: 'Nom du projet',
  dateDésignation: new Date('2021-10-23').toISOString() as Iso8601DateTime,
  localité: {
    codePostal: 'XXXXX',
    commune: 'Commune',
    département: 'Département',
    région: 'Région',
  },
  statut: 'classé',
};

const gestionnaireRéseau: DétailsRaccordementPageProps['gestionnaireRéseau'] = {
  aideSaisieRéférenceDossierRaccordement: {
    expressionReguliere: 'expresion-régulière',
    format: 'Format',
    légende: 'Légende',
  },
  raisonSociale: 'Raison sociale',
  identifiantGestionnaireRéseau: 'identifiantGestionnaireRéseau#1',
  canEdit: true,
};

export const Complet: Story = {
  args: {
    projet,
    gestionnaireRéseau,
    dossiers: [
      {
        identifiantProjet: 'identifiantProjet#1',
        référence: 'référence-dossier#1',
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
      },
    ],
  },
};

export const Incomplet: Story = {
  args: {
    projet,
    gestionnaireRéseau,
    dossiers: [
      {
        identifiantProjet: 'identifiantProjet#2',
        référence: 'référence-dossier#2',
        demandeComplèteRaccordement: {
          canEdit: true,
          accuséRéception: 'accusé-reception#1',
        },
        propositionTechniqueEtFinancière: {
          canEdit: false,
          dateSignature: new Date('2022-09-30').toISOString() as Iso8601DateTime,
          propositionTechniqueEtFinancièreSignée: 'propositionTechniqueEtFinancièreSignée#2.bin',
        },
        miseEnService: {
          canEdit: false,
        },
      },
    ],
  },
};
