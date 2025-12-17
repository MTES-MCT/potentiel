'use client';
import Button from '@codegouvfr/react-dsfr/Button';
import { FC, useState } from 'react';

import { Email } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { CopyButton } from '@/components/molecules/CopyButton';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { retirerAccèsProjetAction } from './retirerAccèsProjet.action';

export type PorteurListItemProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  identifiantUtilisateur: Email.RawType;
  peutRetirerAccès: boolean;
};

export const PorteurListItem: FC<PorteurListItemProps> = ({
  identifiantProjet,
  identifiantUtilisateur,
  peutRetirerAccès,
}) => {
  return (
    <div className="flex flex-row items-center justify-between border-b-dsfr-border-default-grey-default border-b-2 last:border-none pb-2 pt-1">
      <span className="font-semibold">
        <CopyButton textToCopy={identifiantUtilisateur}>{identifiantUtilisateur}</CopyButton>
      </span>
      <div className="flex flex-row gap-3">
        <RetirerAccèsProjetButton
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
          peutRetirerAccès={peutRetirerAccès}
        />
      </div>
    </div>
  );
};

const RetirerAccèsProjetButton: FC<{
  identifiantProjet: IdentifiantProjet.RawType;
  identifiantUtilisateur: Email.RawType;
  peutRetirerAccès: boolean;
}> = ({ identifiantProjet, identifiantUtilisateur, peutRetirerAccès }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        size="small"
        priority="tertiary no outline"
        onClick={() => setIsOpen(true)}
        disabled={!peutRetirerAccès}
      >
        Retirer l'accès
      </Button>
      <ModalWithForm
        id={`retirer-acces-projet-${identifiantProjet}-${identifiantUtilisateur}`}
        title="Retirer l'accès au projet"
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
