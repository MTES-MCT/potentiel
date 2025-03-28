'use client';

import { FC, useEffect, useState } from 'react';
import { Stepper } from '@codegouvfr/react-dsfr/Stepper';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { Step, Steps } from '@/components/molecules/step/Steps';

import {
  SaisieNomStep,
  SaisiePièceJustificativeStep,
  SaisieTypeStep,
  ValidationStep,
} from '../../_utils/steps';
import { TypeSociété } from '../../_utils/steps/SaisieTypeSociété.step';

import {
  demanderChangementReprésentantLégalAction,
  DemanderChangementReprésentantLégalFormKeys,
} from './demanderChangementReprésentantLégal.action';

export type DemanderChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
};

type DemanderChangementReprésentantLégalState = {
  step: number;
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
  nomReprésentantLégal: string;
  piècesJustificatives: Array<string>;
};

export const DemanderChangementReprésentantLégalForm: FC<
  DemanderChangementReprésentantLégalFormProps
> = ({ identifiantProjet }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderChangementReprésentantLégalFormKeys>
  >({});

  const [state, setState] = useState<DemanderChangementReprésentantLégalState>({
    step: 1,
    typeReprésentantLégal: 'inconnu',
    typeSociété: 'non renseignée',
    nomReprésentantLégal: '',
    piècesJustificatives: [],
  });

  const disableCondition =
    !state.typeReprésentantLégal ||
    !state.nomReprésentantLégal ||
    !state.piècesJustificatives.length ||
    Object.keys(validationErrors).length > 0;

  const conditionDésactivationÉtape1 =
    !state.typeReprésentantLégal ||
    (state.typeReprésentantLégal === 'personne-morale' && state.typeSociété === 'non renseignée') ||
    state.typeReprésentantLégal === 'inconnu';

  useEffect(() => {
    if (validationErrors['typeRepresentantLegal']) {
      setState((state) => ({ ...state, step: 1 }));
    }

    if (validationErrors['nomRepresentantLegal'] || validationErrors['piecesJustificatives']) {
      setState((state) => ({ ...state, step: 2 }));
    }
  }, [validationErrors]);

  const steps: Array<Step> = [
    {
      index: 1,
      name: `Description de la démarche`,
      children: (
        <div className="flex flex-col gap-4">
          <p>
            Conformément au cahier des charges en vigueur sur votre projet et afin de faciliter
            l'instruction de vos démarches sur la plateforme Potentiel, il vous est possible
            d'apporter des modifications concernant le représentant légal de votre projet.
          </p>

          <p>
            Pour ce faire vous allez devoir remplir une demande en ligne avec des pièces
            justificatives à fournir selon la situation du nouveau représentant légal du projet.
          </p>
          <Alert
            severity="info"
            title="Concernant la sécurité de vos données"
            description={
              <ul className="p-4 list-disc">
                <li>
                  Un filigrane sera automatiquement appliqué sur l'ensemble des pièces
                  justificatives transmises (nous utilisons le service de la plateforme d'état{' '}
                  <Link href="https://filigrane.beta.gouv.fr/" target="_blank">
                    filigrane.beta.gouv.fr
                  </Link>
                  . )
                </li>
                <li>
                  Les pièces seront automatiquement supprimées après traitement de votre demande.
                </li>
              </ul>
            }
          />
          <p>
            Votre demande sera alors instruite par le service de l'état en région de votre projet. À
            défaut de réponse, votre demande sera réputée accordée ou rejetée conformément aux
            règles du cahier des charges en vigueur de votre projet.
          </p>
          <SaisieTypeStep
            contexte="demander"
            typeReprésentantLégal={state.typeReprésentantLégal}
            typeSociété={state.typeSociété}
            validationErrors={validationErrors}
            onChange={({ typeReprésentantLégal, typeSociété }) => {
              setState((state) => ({
                ...state,
                typeReprésentantLégal,
                typeSociété,
              }));
            }}
          />
        </div>
      ),
      nextStep: {
        type: 'link',
        name: 'Commencer',
        disabled: conditionDésactivationÉtape1,
      },
    },
    {
      index: 2,
      name: `Renseigner les informations concernant le changement`,
      children: (
        <>
          <SaisieNomStep
            typeReprésentantLégal={state.typeReprésentantLégal}
            nomReprésentantLégal={state.nomReprésentantLégal}
            validationErrors={validationErrors}
            onChange={(nomReprésentantLégal) => setState({ ...state, nomReprésentantLégal })}
          />
          <SaisiePièceJustificativeStep
            typeReprésentantLégal={state.typeReprésentantLégal}
            typeSociété={state.typeSociété}
            validationErrors={validationErrors}
            onChange={(piècesJustificatives) =>
              setState((state) => ({ ...state, piècesJustificatives }))
            }
          />
        </>
      ),
      previousStep: { name: 'Précédent' },
      nextStep: {
        type: 'link',
        name: 'Vérifier',
        disabled: disableCondition,
      },
    },
    {
      index: 3,
      name: `Confirmer la demande de changement`,
      children: (
        <ValidationStep
          typeReprésentantLégal={state.typeReprésentantLégal}
          typeSociété={state.typeSociété}
          nomReprésentantLégal={state.nomReprésentantLégal}
          piècesJustificatives={state.piècesJustificatives}
          message={`Vous êtes sur le point de demander le changement du représentant légal du projet. Veuillez vérifier l'ensemble des informations saisies et confirmer si tout est correct`}
        />
      ),
      previousStep: { name: 'Corriger' },
      nextStep: {
        type: 'submit',
        name: 'Confirmer la demande',
        disabled: disableCondition && !validationErrors,
      },
    },
  ];

  return (
    <>
      <Stepper
        className="my-10"
        currentStep={state.step}
        nextTitle={state.step < steps.length && steps[state.step].name}
        stepCount={steps.length}
        title={steps[state.step - 1].name}
      />

      <Form
        action={demanderChangementReprésentantLégalAction}
        onInvalid={() => setState((state) => ({ ...state, step: 2 }))}
        onValidationError={(validationErrors) => {
          setValidationErrors(validationErrors);
        }}
        actions={null}
        omitMandatoryFieldsLegend={state.step !== 2 ? true : undefined}
      >
        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

        <Steps
          steps={steps}
          currentStep={state.step}
          onStepSelected={(step) => setState((state) => ({ ...state, step }))}
        />
      </Form>
    </>
  );
};
