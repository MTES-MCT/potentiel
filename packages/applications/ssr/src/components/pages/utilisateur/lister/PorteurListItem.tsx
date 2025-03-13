'use client';
import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Email } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { Heading3 } from '@/components/atoms/headings';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { Tile } from '@/components/organisms/Tile';
import { CopyButton } from '@/components/molecules/CopyButton';

import { retirerAccèsProjetAction } from '../retirerAccès/retirerAccèsProjet.action';

type PorteurListItem = {
  identifiantProjet: IdentifiantProjet.RawType;
  identifiantUtilisateur: Email.RawType;
};

export const PorteurListItem: FC<PorteurListItem> = ({
  identifiantProjet,
  identifiantUtilisateur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Tile className="flex w-full justify-between">
      <CopyButton textToCopy={identifiantUtilisateur}>
        <Heading3>{identifiantUtilisateur}</Heading3>
      </CopyButton>
      <Button size="small" priority="primary" onClick={() => setIsOpen(true)}>
        Retirer l'accès
      </Button>
      <ModalWithForm
        id={`retirer-acces-projet-${identifiantProjet}-${identifiantUtilisateur}`}
        title="Retirer l'accès au projet"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'notifier-periode-form',
          action: retirerAccèsProjetAction,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir retirer l'accès de {identifiantUtilisateur} au projet ?
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input
                type={'hidden'}
                value={identifiantUtilisateur}
                name="identifiantUtilisateurRetire"
              />
            </>
          ),
        }}
      />
    </Tile>
  );
};
