'use client';

import { FC, useState } from 'react';
import { Stepper } from '@codegouvfr/react-dsfr/Stepper';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

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
  corrigerChangementReprésentantLégalAction,
  CorrigerChangementReprésentantLégalFormKeys,
} from './corrigerChangementReprésentantLégal.action';

export type CorrigerChangementReprésentantLégalFormProps = PlainType<{
  identifiantProjet: ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['identifiantProjet'];
  typeReprésentantLégal: ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['typeReprésentantLégal'];
  nomReprésentantLégal: ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['nomReprésentantLégal'];
  pièceJustificative: ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['pièceJustificative'];
  dateDemande: ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['demandéLe'];
}>;

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

  const [currentStep, setCurrentStep] = useState(1);

  const [stateTypeReprésentantLégal, setStateTypeReprésentantLégal] =
    useState<ReprésentantLégal.TypeReprésentantLégal.RawType>(typeReprésentantLégal.type);
  const [typeSociété, setTypeSociété] = useState<TypeSociété>('non renseignée');
  const [nom, setNom] = useState(nomReprésentantLégal);
  const [piècesJustificatives, setPiècesJustificatives] = useState<Array<string>>([
    DocumentProjet.bind(pièceJustificative).formatter(),
  ]);

  const disableCondition =
    !stateTypeReprésentantLégal ||
    !nom ||
    !piècesJustificatives.length ||
    Object.keys(validationErrors).length > 0;

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
                  justificatives transmises (nous utilisons l'API de la plateforme d'état{' '}
                  <Link href="https://filigrane.beta.gouv.fr/" target="_blank">
                    filigrane.beta.gouv.fr
                  </Link>{' '}
                  )
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
            contexte="corriger"
            typeReprésentantLégal={stateTypeReprésentantLégal}
            typeSociété={typeSociété}
            validationErrors={validationErrors}
            onChange={({ type, typeSociété }) => {
              setStateTypeReprésentantLégal(type);
              setTypeSociété(typeSociété);
            }}
          />
        </div>
      ),
      nextStep: {
        type: 'link',
        name: 'Commencer',
        disabled:
          !stateTypeReprésentantLégal ||
          (stateTypeReprésentantLégal === 'personne-morale' && typeSociété === 'non renseignée') ||
          ReprésentantLégal.TypeReprésentantLégal.bind({
            type: stateTypeReprésentantLégal,
          }).estInconnu(),
      },
    },
    {
      index: 2,
      name: `Renseigner les informations concernant la correction de la demande de changement`,
      children: (
        <>
          <SaisieNomStep
            typeReprésentantLégal={stateTypeReprésentantLégal}
            nomReprésentantLégal={nom}
            validationErrors={validationErrors}
            onChange={(nouveauNom) => setNom(nouveauNom)}
          />
          <SaisiePièceJustificativeStep
            typeReprésentantLégal={stateTypeReprésentantLégal}
            typeSociété={typeSociété}
            pièceJustificative={piècesJustificatives}
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
      name: `Confirmer la correction de la demande de changement`,
      children: (
        <ValidationStep
          typeReprésentantLégal={stateTypeReprésentantLégal}
          typeSociété={typeSociété}
          nomReprésentantLégal={nom}
          piècesJustificatives={piècesJustificatives}
          message={`Vous êtes sur le point de corriger la demande de changement du représentant légal du projet. Veuillez vérifier l'ensemble des informations saisies et confirmer si tout est correct`}
        />
      ),
      previousStep: { name: 'Corriger' },
      nextStep: {
        type: 'submit',
        name: 'Confirmer la correction',
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
        action={corrigerChangementReprésentantLégalAction}
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
        <input type="hidden" value={DateTime.bind(dateDemande).formatter()} name="dateDemande" />

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
