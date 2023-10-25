'use client';
import {
  experimental_useFormState as useFormState,
  //@ts-ignore
  experimental_useFormStatus as useFormStatus,
} from 'react-dom';

import { Upload } from '@codegouvfr/react-dsfr/Upload';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox';
import { Highlight } from '@codegouvfr/react-dsfr/Highlight';
import { ButtonsGroup } from '@codegouvfr/react-dsfr/ButtonsGroup';
import { Alert } from '@codegouvfr/react-dsfr/Alert';

import { demanderAbandonAction, DemandeAbandonState } from './demanderAbandon.action';

const initialState: DemandeAbandonState = {
  error: undefined,
  validationErrors: [],
};

export type DemanderAbandonFormProps = {
  identifiantProjet: string;
};

export const DemanderAbandonForm = ({ identifiantProjet }: DemanderAbandonFormProps) => {
  const [state, formAction] = useFormState(demanderAbandonAction, initialState);
  const { pending } = useFormStatus();

  return (
    <>
      <div className="text-sm italic">
        Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
      </div>
      <form action={formAction} className="order-2 md:order-1 md:mx-auto">
        {state.error && <Alert severity="error" title={state.error} />}
        <Input
          label="Identifiant projet"
          hideLabel={true}
          nativeInputProps={{
            name: 'identifiantProjet',
            'aria-required': true,
            required: true,
            type: 'hidden',
            value: decodeURIComponent(identifiantProjet),
          }}
        />
        <Input
          label="Veuillez nous indiquer les raisons qui motivent votre demande"
          hintText="Veuillez nous indiquer les raisons qui motivent votre demande"
          state={state.validationErrors.includes('raison') ? 'error' : 'default'}
          stateRelatedMessage="Raison de l'abandon obligatoire"
          nativeInputProps={{
            name: 'raison',
          }}
        />
        <Upload
          label="Pièce justificative"
          hint="Vous pouvez transmettre un fichier compressé si il y a plusieurs documents"
          state={state.validationErrors.includes('pieceJustificative') ? 'error' : 'default'}
          stateRelatedMessage="Pièce justificative obligatoire"
          nativeInputProps={{
            name: 'pieceJustificative',
          }}
        />
        <div className="font-bold">
          Demande d'abandon avec recandidature (procédure dérogatoire et facultative)
        </div>
        <Highlight size="sm">
          Je m'engage sur l'honneur à ne pas avoir débuté mes travaux au sens du cahier des charges
          de l'AO associé et a abandonné mon statut de lauréat au profit d'une recandidature
          réalisée au plus tard le 31/12/2024. Je m'engage sur l'honneur à ce que cette
          recandidature respecte les conditions suivantes :
          <ul className="mb-0">
            <li>
              Que le dossier soit complet et respecte les conditions d'éligibilité du cahier des
              charges concerné
            </li>
            <li>Le même lieu d'implantation que le projet abandonné</li>
            <li>Une puissance équivalente à plus ou moins 20% que le projet abandonné</li>
            <li>
              Le tarif proposé ne doit pas être supérieur au prix plafond de la période dont le
              projet était initialement lauréat, indexé jusqu’à septembre 2023 selon la formule
              d’indexation du prix de référence indiquée dans le cahier des charges concerné par la
              recandidature.
            </li>
          </ul>
          <Checkbox
            options={[
              {
                label: 'Abandon de mon projet avec recandidature (optionnel)',
                nativeInputProps: {
                  name: 'recandidature',
                },
              },
            ]}
          />
        </Highlight>
        <ButtonsGroup
          inlineLayoutWhen="always"
          alignment="left"
          buttons={[
            {
              children: 'Envoyer',
              type: 'submit',
              priority: 'primary',
              nativeButtonProps: {
                'aria-disabled': pending,
              },
            },
            {
              children: 'Retour',
              linkProps: {
                href: '/projects.html',
              },
              priority: 'secondary',
            },
          ]}
        />
      </form>
    </>
  );
};
