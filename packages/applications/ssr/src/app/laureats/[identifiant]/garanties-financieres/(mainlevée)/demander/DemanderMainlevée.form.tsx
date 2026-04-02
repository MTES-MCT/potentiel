'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { DocumentProjet } from '@potentiel-domain/projet';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { ValidationErrors } from '@/utils/formAction';

import { ActionGarantiesFinancières } from '../../DétailsGarantiesFinancières.page';

import { demanderMainlevéeAction, DemanderMainlevéeFormKeys } from './demanderMainlevée.action';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

type DemanderMainlevéeFormProps = {
  identifiantProjet: string;
  motif: string;
  actions: ActionGarantiesFinancières[];
  attestationAchèvement?: DocumentProjet.RawType;
};

export const DemanderMainlevéeForm = ({
  identifiantProjet,
  motif,
  actions,
  attestationAchèvement,
}: DemanderMainlevéeFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderMainlevéeFormKeys>
  >({});
  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        Demander la mainlevée des garanties financières
      </Button>

      <ModalWithForm
        id="demander-mainlevée-gf"
        title="Demander la mainlevée des garanties financières"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: demanderMainlevéeAction,
          omitMandatoryFieldsLegend: true,
          onValidationError: setValidationErrors,
          children: (
            <>
              {actions.includes('achèvement.enregistrerAttestation') && (
                <UploadNewOrModifyExistingDocument
                  name="attestationConformite"
                  multiple
                  required
                  documentKeys={attestationAchèvement ? [attestationAchèvement] : []}
                  label="Attestation de conformité et rapport associé"
                  hintText="Joindre l'attestation de conformité et le rapport associé, en un ou plusieurs fichier(s)"
                  state={validationErrors['attestationConformite'] ? 'error' : 'default'}
                  stateRelatedMessage={validationErrors['attestationConformite']}
                  formats={['pdf']}
                />
              )}
              <input
                type="hidden"
                name="attestationConformiteDejaPresente"
                value={(!!attestationAchèvement).toString()}
              />
              <p className="mt-3">
                Êtes-vous sûr de vouloir demander la mainlevée de vos garanties financières ?
              </p>

              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={motif} name="motif" />
            </>
          ),
        }}
      />
    </>
  );
};
