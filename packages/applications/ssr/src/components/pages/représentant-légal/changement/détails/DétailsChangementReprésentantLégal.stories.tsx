import type { Meta, StoryObj } from '@storybook/react';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { DocumentProjet } from '@potentiel-domain/document';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantUtilisateur, Role } from '@potentiel-domain/utilisateur';

import {
  DétailsChangementReprésentantLégalPage,
  DétailsChangementReprésentantLégalPageProps,
} from './DétailsChangementReprésentantLégal.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Représentant légal/Changement/Détails',
  component: DétailsChangementReprésentantLégalPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DétailsChangementReprésentantLégalPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const identifiantProjet = IdentifiantProjet.convertirEnValueType('PPE2 - Bâtiment#4#1#id-cre-738');

export const Demandé: Story = {
  args: {
    identifiantProjet,
    role: mapToPlainObject(Role.porteur),
    statut: mapToPlainObject(ReprésentantLégal.StatutChangementReprésentantLégal.demandé),
    demande: {
      nomReprésentantLégal: 'Nouveau représentant légal',
      typeReprésentantLégal: mapToPlainObject(
        ReprésentantLégal.TypeReprésentantLégal.personnePhysique,
      ),
      pièceJustificative: mapToPlainObject(
        DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
          DateTime.now().formatter(),
          'application/pdf',
        ),
      ),
      demandéLe: mapToPlainObject(DateTime.now()),
      demandéPar: mapToPlainObject(IdentifiantUtilisateur.unknownUser),
    },
    actions: ['accorder', 'rejeter'],
  },
};
