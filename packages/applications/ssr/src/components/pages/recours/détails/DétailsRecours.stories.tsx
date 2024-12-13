import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';
import { Recours } from '@potentiel-domain/elimine';

import { DétailsRecoursPage, DétailsRecoursPageProps } from './DétailsRecours.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Recours/Détails',
  component: DétailsRecoursPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DétailsRecoursPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const identifiantProjet = 'PPE2 - Bâtiment#4#1#id-cre-738';

export const Demandé: Story = {
  args: {
    identifiantProjet,
    recours: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: {
        value: 'demandé',
      },
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        raison: "Justification de l'abandon",
        pièceJustificative: {
          dateCréation: new Date('2022-01-01').toISOString(),
          format: 'application/pdf',
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          typeDocument: Recours.TypeDocumentRecours.pièceJustificative.type,
        },
      },
    },
    historique: {
      items: [],
      range: {
        endPosition: 0,
        startPosition: 0,
      },
      total: 0,
    },
    actions: [],
  },
};

export const Rejeté: Story = {
  args: {
    identifiantProjet,
    recours: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: {
        value: 'rejeté',
      },
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        raison: "Justification de l'abandon",
        pièceJustificative: {
          dateCréation: new Date('2022-01-01').toISOString(),
          format: 'application/pdf',
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          typeDocument: Recours.TypeDocumentRecours.pièceJustificative.type,
        },
        rejet: {
          rejetéPar: {
            email: 'validateur@test.test',
          },
          rejetéLe: {
            date: new Date('2022-02-01').toISOString() as Iso8601DateTime,
          },
          réponseSignée: {
            dateCréation: new Date('2022-02-01').toISOString() as Iso8601DateTime,
            format: 'image/png',
            identifiantProjet,
            typeDocument: Abandon.TypeDocumentAbandon.abandonRejeté.formatter(),
          },
        },
      },
    },
    historique: {
      items: [],
      range: {
        endPosition: 0,
        startPosition: 0,
      },
      total: 0,
    },
    actions: [],
  },
};

export const Accordé: Story = {
  args: {
    identifiantProjet,
    recours: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: {
        value: 'accordé',
      },
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        raison: "Justification de l'abandon",
        pièceJustificative: {
          dateCréation: new Date('2022-01-01').toISOString(),
          format: 'application/pdf',
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          typeDocument: Recours.TypeDocumentRecours.pièceJustificative.type,
        },
        accord: {
          accordéPar: {
            email: 'validateur@test.test',
          },
          accordéLe: {
            date: new Date('2022-02-01').toISOString() as Iso8601DateTime,
          },
          réponseSignée: {
            dateCréation: new Date('2022-02-01').toISOString() as Iso8601DateTime,
            format: 'image/png',
            identifiantProjet,
            typeDocument: Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
          },
        },
      },
    },
    historique: {
      items: [],
      range: {
        endPosition: 0,
        startPosition: 0,
      },
      total: 0,
    },
    actions: [],
  },
};
