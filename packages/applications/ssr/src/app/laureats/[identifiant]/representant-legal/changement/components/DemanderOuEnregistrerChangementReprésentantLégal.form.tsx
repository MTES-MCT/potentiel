'use client';

import { FC, useEffect, useState } from 'react';
import { Stepper } from '@codegouvfr/react-dsfr/Stepper';

import { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { Step, Steps } from '@/components/molecules/step/Steps';

import {
  TypeSociété,
  SaisieTypeStep,
  SaisieNomStep,
  SaisiePièceJustificativeStep,
  ValidationStep,
} from '../../_helpers/steps';
import { DemanderOuEnregistrerChangementReprésentantLégalFormKeys } from '../../_helpers/schema';
import { enregistrerChangementReprésentantLégalAction } from '../enregistrer/enregistrerChangementReprésentantLégal.action';
import { demanderChangementReprésentantLégalAction } from '../demander/demanderChangementReprésentantLégal.action';

type DemanderOuEnregistrerChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
  estUneDemande: boolean;
};

type DemanderOuEnregistrerChangementReprésentantLégalState = {
  step: number;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
  nomReprésentantLégal: string;
  piècesJustificatives: Array<string>;
};

export const DemanderOuEnregistrerChangementReprésentantLégalForm: FC<
  DemanderOuEnregistrerChangementReprésentantLégalFormProps
> = ({ identifiantProjet, estUneDemande }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderOuEnregistrerChangementReprésentantLégalFormKeys>
  >({});

  const [state, setState] = useState<DemanderOuEnregistrerChangementReprésentantLégalState>({
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
            Pour ce faire vous allez devoir remplir une {estUneDemande ? 'demande' : 'déclaration'}{' '}
            en ligne avec des pièces justificatives à fournir selon la situation du nouveau
            représentant légal du projet.
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
      name: `Confirmer ${estUneDemande ? 'la demande de changement' : 'le changement'}`,
      children: (
        <ValidationStep
          typeReprésentantLégal={state.typeReprésentantLégal}
          typeSociété={state.typeSociété}
          nomReprésentantLégal={state.nomReprésentantLégal}
          piècesJustificatives={state.piècesJustificatives}
          message={`Vous êtes sur le point de demander le changement du représentant légal du projet. Veuillez vérifier l'ensemble des informations saisies et confirmer si tout est correct. ${
            estUneDemande
              ? "Votre demande sera alors instruite par le service de l'état en région de votre projet. À défaut de réponse, votre demande sera réputée accordée ou rejetée conformément aux règles du cahier des charges en vigueur de votre projet."
              : ''
          }`}
        />
      ),
      previousStep: { name: 'Corriger' },
      nextStep: {
        type: 'submit',
        name: estUneDemande ? 'Confirmer la demande' : 'Confirmer le changement',
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
        action={
          estUneDemande
            ? demanderChangementReprésentantLégalAction
            : enregistrerChangementReprésentantLégalAction
        }
        onInvalid={() => setState((state) => ({ ...state, step: 2 }))}
        onValidationError={(validationErrors) => {
          setValidationErrors(validationErrors);
        }}
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
