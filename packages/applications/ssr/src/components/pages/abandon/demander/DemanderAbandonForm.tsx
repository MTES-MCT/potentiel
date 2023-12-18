'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { Utilisateur } from '@/utils/getUtilisateur';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { DemanderAbandonState, demanderAbandonAction } from './demanderAbandon.action';
import { Form } from '@/components/molecules/Form';
import Input from '@codegouvfr/react-dsfr/Input';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { useState } from 'react';
import { encodeParameter } from '@/utils/encodeParameter';

const initialState: DemanderAbandonState = {
  error: undefined,
  validationErrors: [],
};

type DemanderAbandonFormProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
};

export const DemanderAbandonForm = ({
  identifiantProjet,
  utilisateur,
}: DemanderAbandonFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(demanderAbandonAction, initialState);
  const [recandidature, setRecandidature] = useState(false);
  const [requiredFieldsAdded, setRequiredFieldsAdded] = useState(false);

  if (state.success) {
    router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`);
  }

  return (
    <Form action={formAction} method="post" encType="multipart/form-data">
      <>
        {state.error && <Alert severity="error" title={state.error} className="mb-4" />}

        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
        <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
        <Input
          textArea
          label="Raison"
          id="raison"
          disabled={pending}
          hintText="Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
                conduit à ce besoin de modification (contexte, facteurs extérieurs, etc.)."
          state={state.validationErrors.includes('raison') ? 'error' : 'default'}
          stateRelatedMessage="Raison à préciser"
          nativeTextAreaProps={{
            name: 'raison',
            required: true,
            'aria-required': true,
            onChange: () => setRequiredFieldsAdded(true),
          }}
        />
        <Upload
          label="Pièce justificative (optionnel)"
          hint="Vous pouvez transmettre un fichier compressé si il y a plusieurs documents"
          id="pieceJustificative"
          disabled={pending}
          nativeInputProps={{ name: 'pieceJustificative' }}
          state={state.validationErrors.includes('pieceJustificative') ? 'error' : 'default'}
          stateRelatedMessage="Erreur sur le fichier transmis"
        />
        <Checkbox
          className="mt-6"
          legend="Option"
          id="recandidature"
          state={state.validationErrors.includes('recandidature') ? 'error' : 'default'}
          disabled={pending}
          options={[
            {
              label: 'Je demande un abandon avec recandidature (optionnel)',
              hintText: 'Cocher cette case pour signaler un abandon pour recandidature',
              nativeInputProps: {
                name: 'recandidature',
                value: 'true',
                onClick: () => setRecandidature(!recandidature),
              },
            },
          ]}
        />

        {recandidature && (
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
                    débuté mes travaux au sens du cahier des charges de l'appel d'offres associé et
                    à abandonner mon statut de lauréat au profit d'une recandidature réalisée au
                    plus tard le 31/12/2024. Je m'engage sur l'honneur à ce que cette recandidature
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
        )}
        <Button
          type="submit"
          priority="primary"
          disabled={pending || !requiredFieldsAdded}
          nativeButtonProps={{
            'aria-disabled': pending,
          }}
          className="bg-blue-france-sun-base text-white"
        >
          Envoyer
        </Button>
      </>
    </Form>
  );
};
