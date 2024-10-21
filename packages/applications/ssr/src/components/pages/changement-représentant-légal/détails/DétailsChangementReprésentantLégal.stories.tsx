import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
// import { ReprésentantLégal } from '@potentiel-domain/laureat';

import {
  DétailsChangementReprésentantLégalPage,
  DétailsChangementReprésentantLégalPageProps,
} from './DétailsChangementReprésentantLégal.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/ChangementReprésentantLégal/Détails',
  component: DétailsChangementReprésentantLégalPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DétailsChangementReprésentantLégalPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const identifiantProjet = 'PPE2 - Bâtiment#4#1#id-cre-738';

export const Demandé: Story = {
  args: {
    identifiantProjet,
    role: Role.porteur,
    changementReprésentantLégal: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: 'demandé',
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        nomReprésentantLégal: 'Nouveau représentant légal',
        pièceJustificative: {
          dateCréation: new Date('2022-01-01').toISOString(),
          format: 'application/pdf',
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          typeDocument: 'application/pdf',
          //   ChangementReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative
          //     .type,
        },
      },
    },
    actions: [],
  },
};

export const Rejeté: Story = {
  args: {
    identifiantProjet,
    role: Role.porteur,
    changementReprésentantLégal: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: 'rejeté',
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        nomReprésentantLégal: 'Nouveau représentant légal',
        pièceJustificative: {
          dateCréation: new Date('2022-01-01').toISOString(),
          format: 'application/pdf',
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          typeDocument: 'application/pdf',
          //   ChangementReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative
          //     .type,
        },
        rejet: {
          rejetéPar: {
            email: 'validateur@test.test',
          },
          rejetéLe: {
            date: new Date('2022-02-01').toISOString() as Iso8601DateTime,
          },
        },
      },
    },
    actions: [],
  },
};

export const Accordé: Story = {
  args: {
    identifiantProjet,
    role: Role.porteur,
    changementReprésentantLégal: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut: 'accordé',
      demande: {
        demandéPar: {
          email: 'porteur@test.test',
        },
        demandéLe: {
          date: new Date('2022-01-01').toISOString(),
        },
        nomReprésentantLégal: 'Nouveau représentant légal',
        pièceJustificative: {
          dateCréation: new Date('2022-01-01').toISOString(),
          format: 'application/pdf',
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          typeDocument: 'application/pdf',
          //   ChangementReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative
          //     .type,
        },
        accord: {
          accordéPar: {
            email: 'validateur@test.test',
          },
          accordéLe: {
            date: new Date('2022-02-01').toISOString() as Iso8601DateTime,
          },
          nomReprésentantLégal: 'Nouveau représentant légal corrigé',
        },
      },
    },
    actions: [],
  },
};
