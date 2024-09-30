'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { ValidationErrors } from '@/utils/formAction';

import { demanderAbandonAction } from './demanderAbandon.action';

export type DemanderAbandonFormProps = {
  identifiantProjet: string;
  showRecandidatureCheckBox: boolean;
};

export const DemanderAbandonForm: FC<DemanderAbandonFormProps> = ({
  identifiantProjet,
  showRecandidatureCheckBox,
}) => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [recandidature, setRecandidature] = useState(false);

  return (
    <Form
      action={demanderAbandonAction}
      method="POST"
      encType="multipart/form-data"
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={<SubmitButton>Demander l'abandon</SubmitButton>}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <Input
        textArea
        label="Raison"
        id="raison"
        hintText="Pour faciliter le traitement de votre demande, veuillez détailler les raisons ayant
                conduit à cet abandon (contexte, facteurs extérieurs, etc.)."
        nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
        state={validationErrors['raison'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raison']}
      />

      <UploadDocument
        label={`Pièce justificative${recandidature ? ' (optionnel)' : ''}`}
        id="pieceJustificative"
        name="pieceJustificative"
        required={!recandidature}
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
      />

      {showRecandidatureCheckBox && (
        <Checkbox
          className="mt-6"
          id="recandidature"
          state={validationErrors['recandidature'] ? 'error' : 'default'}
          options={[
            {
              label: 'Je demande un abandon avec recandidature (optionnel)',
              nativeInputProps: {
                name: 'recandidature',
                value: 'true',
                onClick: () => setRecandidature(!recandidature),
              },
            },
          ]}
        />
      )}

      {showRecandidatureCheckBox && recandidature ? (
        <Alert
          severity="warning"
          title="Abandon avec recandidature"
          className="mb-6"
          description={
            <div>
              <div className="font-bold">(procédure dérogatoire et facultative)</div>
              <div>
                <p className="m-0 mt-4">
                  Par cet abandon avec recandidature, je m'engage sur l'honneur à ne pas avoir
                  débuté mes travaux au sens du cahier des charges de l'appel d'offres associé et à
                  abandonner mon statut de lauréat au profit d'une recandidature réalisée au plus
                  tard le 31/12/2024. Je m'engage sur l'honneur à ce que cette recandidature
                  respecte les conditions suivantes :
                </p>
                <ul className="mb-0 list-disc indent-8 list-inside">
                  <li>
                    Que le dossier soit complet et respecte les conditions d'éligibilité du cahier
                    des charges concerné
                  </li>
                  <li>Le même lieu d'implantation que le projet abandonné</li>
                  <li>
                    La même autorisation préfectorale (numéro ICPE identifique) que le projet
                    abandonné, nonobstant des porter à connaissance ultérieurs
                  </li>
                  <li>
                    Le tarif proposé ne doit pas être supérieur au prix plafond de la période dont
                    le projet était initialement lauréat, indexé jusqu’à septembre 2023 selon la
                    formule d’indexation du prix de référence indiquée dans le cahier des charges
                    concerné par la recandidature.
                  </li>
                </ul>
              </div>
            </div>
          }
        />
      ) : null}
    </Form>
  );
};
