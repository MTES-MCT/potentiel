'use client';
import { useState } from 'react';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { supprimerDocumentAction } from './supprimerDocument.action';

type SupprimerDocumentFormProps = {
  identifiantProjet: string;
  référence: string;
  type: string;
};

export const SupprimerDocumentForm = ({
  identifiantProjet,
  référence,
  type,
}: SupprimerDocumentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TertiaryLink href="" onClick={() => setIsOpen(true)} className="block text-center shrink-0">
        Supprimer le document
      </TertiaryLink>

      <ModalWithForm
        id={`supprimer-${type}-dossier-${référence}`}
        title={`Supprimer la ${type.split('-').join(' ')}`}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: supprimerDocumentAction,
          id: 'supprimer-document-raccordement-form',
          children: (
            <>
              <input type="hidden" value={identifiantProjet} name="identifiantProjet" />
              <input type="hidden" name="référenceDossierRaccordement" value={référence} />
              <input type="hidden" name="type" value={type} />

              <div>
                Référence du dossier de raccordement : <strong>{référence}</strong>
              </div>

              <p className="mt-3">Êtes-vous sûr de vouloir supprimer ce document ?</p>
            </>
          ),
        }}
      />
    </>
  );
};
