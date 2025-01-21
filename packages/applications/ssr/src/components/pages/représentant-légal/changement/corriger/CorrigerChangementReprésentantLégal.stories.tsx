import type { Meta, StoryObj } from '@storybook/react';

import { mapToPlainObject } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { DocumentProjet } from '@potentiel-domain/document';

import {
  CorrigerChangementReprésentantLégalPage,
  CorrigerChangementReprésentantLégalPageProps,
} from './CorrigerChangementReprésentantLégal.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Représentant légal/Changement/Corriger',
  component: CorrigerChangementReprésentantLégalPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<CorrigerChangementReprésentantLégalPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const identifiantProjet = IdentifiantProjet.convertirEnValueType('PPE2 - Bâtiment#4#1#id-cre-738');

export const Default: Story = {
  args: {
    identifiantProjet,
    typeReprésentantLégal: mapToPlainObject(
      ReprésentantLégal.TypeReprésentantLégal.personnePhysique,
    ),
    nomReprésentantLégal: 'Nom du représentant légal',
    pièceJustificative: mapToPlainObject(
      DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
        DateTime.now().formatter(),
        'application/pdf',
      ),
    ),
  },
};
