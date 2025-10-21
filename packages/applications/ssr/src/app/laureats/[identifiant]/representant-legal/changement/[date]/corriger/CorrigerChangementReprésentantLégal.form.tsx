'use client';

import { FC, useEffect, useState } from 'react';
import { Stepper } from '@codegouvfr/react-dsfr/Stepper';

import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { Step, Steps } from '@/components/molecules/step/Steps';

import {
  SaisieNomStep,
  SaisiePièceJustificativeStep,
  SaisieTypeStep,
  TypeSociété,
  ValidationStep,
} from '../../../_helpers/steps';

import {
  corrigerChangementReprésentantLégalAction,
  CorrigerChangementReprésentantLégalFormKeys,
} from './corrigerChangementReprésentantLégal.action';

export type CorrigerChangementReprésentantLégalFormProps = PlainType<{
  identifiantProjet: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['identifiantProjet'];
  typeReprésentantLégal: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['typeReprésentantLégal'];
  nomReprésentantLégal: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['nomReprésentantLégal'];
  pièceJustificative: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['pièceJustificative'];
  dateDemande: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['demandéeLe'];
}>;

type CorrigerChangementReprésentantLégalState = {
  step: number;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
  nomReprésentantLégal: string;
  piècesJustificatives: Array<string>;
};

export const CorrigerChangementReprésentantLégalForm: FC<
  CorrigerChangementReprésentantLégalFormProps
> = ({
  identifiantProjet,
  typeReprésentantLégal,
  nomReprésentantLégal,
  pièceJustificative,
  dateDemande,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerChangementReprésentantLégalFormKeys>
  >({});
  const [state, setState] = useState<CorrigerChangementReprésentantLégalState>({
    step: 1,
    nomReprésentantLégal,
    typeReprésentantLégal: typeReprésentantLégal.type,
    typeSociété: 'non renseignée',
    piècesJustificatives: [DocumentProjet.bind(pièceJustificative).formatter()],
  });

  const disableCondition =
    !state.typeReprésentantLégal ||
    !state.nomReprésentantLégal ||
    !state.piècesJustificatives.length ||
    Object.keys(validationErrors).length > 0;

  const conditionDésactivationÉtape1 =
    !state.typeReprésentantLégal ||
    state.typeReprésentantLégal === 'inconnu' ||
    (state.typeReprésentantLégal === 'personne-morale' && state.typeSociété === 'non renseignée');

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
            Pour ce faire vous allez devoir remplir une demande en ligne avec des éléments selon la
            situation du nouveau représentant légal du projet.
          </p>
          <SaisieTypeStep
            contexte="corriger"
            typeReprésentantLégal={state.typeReprésentantLégal}
            typeSociété={state.typeSociété}
            validationErrors={validationErrors}
            onChange={({ typeReprésentantLégal, typeSociété }) =>
              setState((state) => ({
                ...state,
                typeReprésentantLégal,
                typeSociété,
              }))
            }
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
      name: `Renseigner les informations concernant la correction de la demande de changement`,
      children: (
        <>
          <SaisieNomStep
            typeReprésentantLégal={state.typeReprésentantLégal}
            nomReprésentantLégal={state.nomReprésentantLégal}
            validationErrors={validationErrors}
            onChange={(nouveauNom) =>
              setState((state) => ({
                ...state,
                nomReprésentantLégal: nouveauNom,
              }))
            }
          />
          <SaisiePièceJustificativeStep
            typeReprésentantLégal={state.typeReprésentantLégal}
            typeSociété={state.typeSociété}
            pièceJustificative={state.piècesJustificatives}
            validationErrors={validationErrors}
            onChange={(nouvellesPiècesJustificatives) =>
              setState((state) => ({
                ...state,
                piècesJustificatives: [...nouvellesPiècesJustificatives],
              }))
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
      name: `Confirmer la correction de la demande de changement`,
      children: (
        <ValidationStep
          typeReprésentantLégal={state.typeReprésentantLégal}
          typeSociété={state.typeSociété}
          nomReprésentantLégal={state.nomReprésentantLégal}
          piècesJustificatives={state.piècesJustificatives}
          message={`
            Vous êtes sur le point de corriger la demande de changement du représentant légal du projet. 
            Veuillez vérifier l'ensemble des informations saisies et confirmer si tout est correct.
            Ensuite votre demande sera alors instruite par le service de l'état en région de votre projet. 
            À défaut de réponse, votre demande sera réputée accordée ou rejetée conformément aux
            règles du cahier des charges en vigueur de votre projet.`}
        />
      ),
      previousStep: { name: 'Corriger' },
      nextStep: {
        type: 'submit',
        name: 'Confirmer la correction',
        disabled: disableCondition && Object.keys(validationErrors).length === 0,
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
        action={corrigerChangementReprésentantLégalAction}
        onInvalid={() => setState((state) => ({ ...state, step: 2 }))}
        onValidationError={(validationErrors) => {
          setValidationErrors(validationErrors);
        }}
        omitMandatoryFieldsLegend={state.step !== 2 ? true : undefined}
      >
        <input type="hidden" value={DateTime.bind(dateDemande).formatter()} name="dateDemande" />

        <input
          type={'hidden'}
          value={IdentifiantProjet.bind(identifiantProjet).formatter()}
          name="identifiantProjet"
        />

        <Steps
          steps={steps}
          currentStep={state.step}
          onStepSelected={(step) => setState((state) => ({ ...state, step }))}
        />
      </Form>
    </>
  );
};
