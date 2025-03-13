'use client';
import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Email } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { Heading3 } from '@/components/atoms/headings';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';
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
  return (
    <>
      <div className="flex flex-row items-center justify-between border-b-dsfr-border-default-grey-default border-b-2 pb-2 pt-1">
        <Heading3>{identifiantUtilisateur}</Heading3>
        <div className="flex flex-row gap-3">
          <CopyButton textToCopy={identifiantUtilisateur}>
            <></>
          </CopyButton>
          <RetirerAccèsProjetButton
            identifiantProjet={identifiantProjet}
            identifiantUtilisateur={identifiantUtilisateur}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between border-b-dsfr-border-default-grey-default border-b-2 pb-2 pt-1">
        <Heading3>{identifiantUtilisateur}</Heading3>
        <div className="flex flex-row gap-3">
          <CopyButton textToCopy={identifiantUtilisateur}>
            <></>
          </CopyButton>
          <RetirerAccèsProjetButton
            identifiantProjet={identifiantProjet}
            identifiantUtilisateur={identifiantUtilisateur}
          />
        </div>
      </div>
    </>
  );
};

const RetirerAccèsProjetButton: FC<{
  identifiantProjet: IdentifiantProjet.RawType;
  identifiantUtilisateur: Email.RawType;
}> = ({ identifiantProjet, identifiantUtilisateur }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
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
    </div>
  );
};
