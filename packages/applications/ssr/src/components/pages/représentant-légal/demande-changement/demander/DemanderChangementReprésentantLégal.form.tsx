'use client';

import { FC, useState } from 'react';
import { Stepper } from '@codegouvfr/react-dsfr/Stepper';
import Alert from '@codegouvfr/react-dsfr/Alert';

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

import {
  demanderChangementReprésentantLégalAction,
  DemanderChangementReprésentantLégalFormKeys,
} from './demanderChangementReprésentantLégal.action';

export type DemanderChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
};

export const DemanderChangementReprésentantLégalForm: FC<
  DemanderChangementReprésentantLégalFormProps
> = ({ identifiantProjet }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderChangementReprésentantLégalFormKeys>
  >({});

  const [currentStep, setCurrentStep] = useState(1);

  const [type, setType] = useState<ReprésentantLégal.TypeReprésentantLégal.RawType>('inconnu');
  const [nom, setNom] = useState('');
  const [piècesJustificatives, setPiècesJustificatives] = useState<Array<string>>([]);

  const disableCondition =
    !type || !nom || !piècesJustificatives.length || Object.keys(validationErrors).length > 0;

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
          <Alert
            severity="info"
            title="Concernant la sécurité de vos données"
            description={
              <ul className="p-4 list-disc">
                <li>
                  Un filigrane sera automatiquement appliqué sur l'ensemble des pièces
                  justificatives transmises
                </li>
                <li>
                  Les pièces seront automatiquement supprimées après traitement de votre demande
                </li>
              </ul>
            }
          />
          <p>
            Ensuite votre demande sera instruite par le service de l'état en région de votre projet.
            À défaut de réponse, votre demande sera réputée accordée ou rejetée conformément aux
            règles du cahier des charges en vigueur sur votre projet.
          </p>
          <SaisieTypeStep
            contexte="demander"
            typeReprésentantLégal={type}
            validationErrors={validationErrors}
            onChange={(nouveauType) => setType(nouveauType)}
          />
        </div>
      ),
      nextStep: {
        type: 'link',
        name: 'Commencer',
        disabled: !type || ReprésentantLégal.TypeReprésentantLégal.bind({ type }).estInconnu(),
      },
    },
    {
      index: 2,
      name: `Renseigner les informations concernant le changement`,
      children: (
        <>
          <SaisieNomStep
            typeReprésentantLégal={type}
            nomReprésentantLégal={nom}
            validationErrors={validationErrors}
            onChange={(nouveauNom) => setNom(nouveauNom)}
          />
          <SaisiePièceJustificativeStep
            typeReprésentantLégal={type}
            validationErrors={validationErrors}
            onChange={(nouvellesPiècesJustificatives) =>
              setPiècesJustificatives([...nouvellesPiècesJustificatives])
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
          typeReprésentantLégal={type}
          nomReprésentantLégal={nom}
          piècesJustificatives={piècesJustificatives}
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
        currentStep={currentStep}
        nextTitle={currentStep < steps.length && steps[currentStep].name}
        stepCount={steps.length}
        title={steps[currentStep - 1].name}
      />

      <Form
        action={demanderChangementReprésentantLégalAction}
        onInvalid={() => setCurrentStep(2)}
        onValidationError={(validationErrors) => {
          setValidationErrors(validationErrors);
          if (validationErrors['typeRepresentantLegal']) {
            setCurrentStep(1);
          }
          if (validationErrors['nom'] || validationErrors['piecesJustificatives']) {
            setCurrentStep(2);
          }
        }}
        onError={() => setCurrentStep(2)}
        actions={null}
        omitMandatoryFieldsLegend={currentStep !== 2 ? true : undefined}
      >
        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

        <Steps
          steps={steps}
          currentStep={currentStep}
          onStepSelected={(stepIndex) => setCurrentStep(stepIndex)}
        />
      </Form>
    </>
  );
};
