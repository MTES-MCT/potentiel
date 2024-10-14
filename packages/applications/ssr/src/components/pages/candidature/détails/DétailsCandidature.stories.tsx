import type { Meta, StoryObj } from '@storybook/react';

import { mapToPlainObject } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { DocumentProjet } from '@potentiel-domain/document';

import { DétailsCandidaturePage } from './DétailsCandidature.page';

const meta = {
  title: 'Pages/Candidature/Détails/DétailsCandidaturePage',
  component: DétailsCandidaturePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<{}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CandidatureNonNotifiée: Story = {
  args: {
    candidature: mapToPlainObject({
      identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Eolien#1##23'),
      statut: Candidature.StatutCandidature.classé,
      nomProjet: 'Nom projet',
      nomCandidat: 'Candidat',
      emailContact: 'porteur@test.test',
      localité: {
        commune: 'Commune',
        département: 'Département',
        région: 'Région',
        adresse1: 'adresse 1',
        adresse2: '',
        codePostal: '00000',
      },
      puissanceProductionAnnuelle: 1,
      prixReference: 1,
      nomReprésentantLégal: 'Frodon Sacquet',
      evaluationCarboneSimplifiée: 1,
      historiqueAbandon: Candidature.HistoriqueAbandon.convertirEnValueType('première-candidature'),
      technologie: Candidature.TypeTechnologie.convertirEnValueType('eolien'),
      sociétéMère: 'Daronne',
      noteTotale: 20,
      puissanceALaPointe: true,
      territoireProjet: 'NZ',
      misÀJourLe: DateTime.convertirEnValueType(new Date('2022-01-01').toISOString()),
      détailsImport: DocumentProjet.convertirEnValueType(
        'PPE2 - Eolien#1##23',
        'candidature/import',
        DateTime.now().formatter(),
        'application/json',
      ),
    }),
    actions: { corriger: true, prévisualiserAttestation: true, téléchargerAttestation: false },
  },
};

export const CandidatureNotifiée: Story = {
  args: {
    candidature: mapToPlainObject({
      identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Eolien#1##23'),
      statut: Candidature.StatutCandidature.classé,
      nomProjet: 'Nom projet',
      nomCandidat: 'Candidat',
      emailContact: 'porteur@test.test',
      localité: {
        commune: 'Commune',
        département: 'Département',
        région: 'Région',
        adresse1: 'adresse 1',
        adresse2: '',
        codePostal: '00000',
      },
      puissanceProductionAnnuelle: 1,
      prixReference: 1,
      nomReprésentantLégal: 'Frodon Sacquet',
      evaluationCarboneSimplifiée: 1,
      historiqueAbandon: Candidature.HistoriqueAbandon.convertirEnValueType('première-candidature'),
      technologie: Candidature.TypeTechnologie.convertirEnValueType('eolien'),
      sociétéMère: 'Daronne',
      noteTotale: 20,
      puissanceALaPointe: true,
      territoireProjet: 'NZ',
      misÀJourLe: DateTime.convertirEnValueType(new Date('2022-01-01').toISOString()),
      détailsImport: DocumentProjet.convertirEnValueType(
        'PPE2 - Eolien#1##23',
        'candidature/import',
        DateTime.now().formatter(),
        'application/json',
      ),
      notification: {
        attestation: DocumentProjet.convertirEnValueType(
          'PPE2 - Eolien#1##23',
          'candidature/import',
          DateTime.now().formatter(),
          'application/json',
        ),
        notifiéeLe: DateTime.convertirEnValueType(new Date('2022-01-01').toISOString()),
        notifiéePar: Email.convertirEnValueType('validateur@test.test'),
        validateur: {
          nomComplet: 'Madame Validateur',
          fonction: 'je valide',
        },
      },
    }),
    actions: { corriger: true, prévisualiserAttestation: false, téléchargerAttestation: true },
  },
};
