import type { Meta, StoryObj } from '@storybook/react';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { DocumentProjet } from '@potentiel-domain/document';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantUtilisateur, Role } from '@potentiel-domain/utilisateur';

import {
  DétailsDemandeChangementReprésentantLégalPage,
  DétailsDemandeChangementReprésentantLégalPageProps,
} from './DétailsDemandeChangementReprésentantLégal.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/DemandeChangementReprésentantLégal/Détails',
  component: DétailsDemandeChangementReprésentantLégalPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<DétailsDemandeChangementReprésentantLégalPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const identifiantProjet = IdentifiantProjet.convertirEnValueType('PPE2 - Bâtiment#4#1#id-cre-738');

export const Demandé: Story = {
  args: {
    identifiantProjet,
    role: mapToPlainObject(Role.porteur),
    statut: mapToPlainObject(ReprésentantLégal.StatutDemandeChangementReprésentantLégal.demandé),
    nomReprésentantLégal: 'Nouveau représentant légal',
    typeReprésentantLégal: mapToPlainObject(
      ReprésentantLégal.TypeReprésentantLégal.personnePhysique,
    ),
    piècesJustificatives: [
      mapToPlainObject(
        DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
          DateTime.now().formatter(),
          'application/pdf',
        ),
      ),
    ],
    demandéLe: mapToPlainObject(DateTime.now()),
    demandéPar: mapToPlainObject(IdentifiantUtilisateur.unknownUser),
    actions: ['accorder', 'rejeter'],
  },
};
