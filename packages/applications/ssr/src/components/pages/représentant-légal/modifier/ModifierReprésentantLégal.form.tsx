'use client';

import { FC, useState } from 'react';
import Stepper from '@codegouvfr/react-dsfr/Stepper';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { Step, Steps } from '@/components/molecules/step/Steps';

import { SaisieNomStep, SaisieTypeStep, ValidationStep } from '../_utils/steps';
import { TypeSociété } from '../_utils/steps/SaisieTypeSociété.step';

import {
  modifierReprésentantLégalAction,
  ModifierReprésentantLégalFormKeys,
} from './modifierReprésentantLégal.action';
import { ModifierReprésentantLégalPageProps } from './ModifierReprésentantLégal.page';

export type ModifierReprésentantLégalFormProps = ModifierReprésentantLégalPageProps;

export const ModifierReprésentantLégalForm: FC<ModifierReprésentantLégalFormProps> = ({
  identifiantProjet,
  nomReprésentantLégal,
  typeReprésentantLégal,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierReprésentantLégalFormKeys>
  >({});

  const [currentStep, setCurrentStep] = useState(1);

  const [stateTypeReprésentantLégal, setStateTypeReprésentantLégal] = useState(
    typeReprésentantLégal.type,
  );
  const [typeSociété, setTypeSociété] = useState<TypeSociété>('non renseignée');
  const [nom, setNom] = useState('');

  const conditionDésactivationÉtape1 =
    !stateTypeReprésentantLégal ||
    (stateTypeReprésentantLégal === 'personne-morale' && typeSociété === 'non renseignée') ||
    stateTypeReprésentantLégal === 'inconnu';

  const conditionDésactivationÉtape2 = !nom || nom === nomReprésentantLégal;

  const conditionDésactivationÉtape3 = !stateTypeReprésentantLégal || !nom;

  const steps: Array<Step> = [
    {
      index: 1,
      name: `Description de la démarche`,
      children: (
        <div className="flex flex-col gap-4">
          <p>
            Pour effectuer une modification du représentant légal vous devez tout d'abord
            sélectionner le type du nouveau représentant légal pour connaître les documents
            obligatoires nécessaires à la modification.
          </p>
          <SaisieTypeStep
            contexte="modifier"
            typeReprésentantLégal={stateTypeReprésentantLégal}
            typeSociété={typeSociété}
            onChange={({ typeReprésentantLégal, typeSociété }) => {
              setStateTypeReprésentantLégal(typeReprésentantLégal);
              setTypeSociété(typeSociété);
            }}
            validationErrors={validationErrors}
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
        <SaisieNomStep
          nomReprésentantLégal={nom}
          typeReprésentantLégal={stateTypeReprésentantLégal}
          validationErrors={validationErrors}
          onChange={(nouveauNom) => setNom(nouveauNom)}
        />
      ),
      previousStep: { name: 'Précédent' },
      nextStep: {
        type: 'link',
        name: 'Suivant',
        disabled: conditionDésactivationÉtape2,
      },
    },
    {
      index: 3,
      name: `Confirmer la modification`,
      children: (
        <ValidationStep
          typeReprésentantLégal={stateTypeReprésentantLégal}
          typeSociété={typeSociété}
          nomReprésentantLégal={nom}
          piècesJustificatives={[]}
          message={`Vous êtes sur le point de modifier le représentant légal du projet. Veuillez vérifier l'ensemble des informations saisies et confirmer si tout est correct`}
        />
      ),
      previousStep: { name: 'Précédent' },
      nextStep: {
        type: 'submit',
        name: 'Modifier le représentant légal',
        disabled: conditionDésactivationÉtape3,
      },
    },
  ];

  const handleOnValidationError = (
    vErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>,
  ) => {
    if (Object.keys(validationErrors).length) {
      return;
    }

    vErrors.typeRepresentantLegal && setCurrentStep(1);
    vErrors.nomRepresentantLegal && setCurrentStep(2);

    setValidationErrors(vErrors);
  };

  return (
    <>
      <Stepper
        className="my-10"
        currentStep={currentStep}
        nextTitle={currentStep < steps.length && steps[currentStep].name}
        stepCount={steps.length}
        title={steps[currentStep - 1].name}
      />

      <Form
        action={modifierReprésentantLégalAction}
        onInvalid={() => setCurrentStep(1)}
        onError={() => setCurrentStep(1)}
        onValidationError={(vErrors) => handleOnValidationError(vErrors)}
        actions={null}
        omitMandatoryFieldsLegend={currentStep === 3 ? undefined : true}
      >
        <input
          type={'hidden'}
          value={IdentifiantProjet.bind(identifiantProjet).formatter()}
          name="identifiantProjet"
        />
        <Steps
          steps={steps}
          currentStep={currentStep}
          onStepSelected={(stepIndex) => setCurrentStep(stepIndex)}
        />
      </Form>
    </>
  );
};
