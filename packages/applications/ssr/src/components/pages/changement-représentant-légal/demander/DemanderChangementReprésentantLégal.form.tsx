'use client';

import { FC, ReactNode, useState } from 'react';
import { match } from 'ts-pattern';
import Input from '@codegouvfr/react-dsfr/Input';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import { Stepper } from '@codegouvfr/react-dsfr/Stepper';
import Button from '@codegouvfr/react-dsfr/Button';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { ValidationErrors } from '@/utils/formAction';

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

  const stepCount = 3;
  const [currentStep, setCurrentStep] = useState(1);
  const [saisie, setSaisie] = useState<Saisie>({
    typePersonne: undefined,
    nomReprésentantLégal: '',
    piècesJustificatives: [],
  });

  const steps: Array<StepProps> = [
    {
      index: 1,
      name: `Description de la démarche en cours`,
      children: <Description />,
      nextStep: { type: 'link', name: 'Commencer' },
    },
    {
      index: 2,
      name: `Renseignez les informations concernant le changement`,
      children: (
        <Saisie validationErrors={validationErrors} onChanged={(changes) => setSaisie(changes)} />
      ),
      previousStep: { name: 'Précédent' },
      nextStep: { type: 'link', name: 'Vérifier' },
    },
    {
      index: 3,
      name: `Renseignez les informations concernant le changement`,
      children: (
        <Validation
          typePersonne={saisie.typePersonne}
          nomReprésentantLégal={saisie.nomReprésentantLégal}
          piècesJustificatives={saisie.piècesJustificatives}
        />
      ),
      previousStep: { name: 'Corriger' },
      nextStep: { type: 'submit', name: 'Confirmer la demande' },
    },
  ];

  return (
    <>
      Current step = {currentStep}
      <Stepper
        currentStep={currentStep}
        nextTitle="Renseignez les informations concernant le changement"
        stepCount={stepCount}
        title="Description de la démarche en cours"
      />
      <Form
        action={demanderChangementReprésentantLégalAction}
        method="POST"
        encType="multipart/form-data"
        onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
        actions={null}
        omitMandatoryFieldsLegend={currentStep !== 2 ? true : undefined}
      >
        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

        <Steps onStepSelected={(stepIndex) => setCurrentStep(stepIndex)} steps={steps} />
      </Form>
    </>
  );
};

const Description: FC<{}> = () => (
  <>
    Vous vous apprêter à faire une demande de changement de représentant légal. Sed ut perspiciatis
    unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
    eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
    explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
    consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
    qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius
    modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
    veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea
    commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
    nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
  </>
);

type Saisie = {
  typePersonne: string | undefined;
  nomReprésentantLégal: string;
  piècesJustificatives: ReadonlyArray<string>;
};

const Saisie: FC<{
  onChanged?: (changes: Saisie) => void;
  validationErrors: ValidationErrors<DemanderChangementReprésentantLégalFormKeys>;
}> = ({ validationErrors, onChanged }) => {
  type TypeDePersonne = 'Personne physique' | 'Personne morale' | 'Collectivité' | 'Autre';
  const [typePersonne, selectTypePersonne] = useState<TypeDePersonne>();
  const [nomReprésentantLégal, setNomReprésentantLégal] = useState('');
  const [piècesJustificatives, setPiècesJustificatives] = useState<ReadonlyArray<string>>([]);

  const getNomReprésentantLégalHintText = () =>
    match(typePersonne)
      .with('Personne physique', () => 'les nom et prénom')
      .with('Personne morale', () => 'le nom de la société')
      .with('Collectivité', () => 'le nom de la collectivité')
      .with('Autre', () => `le nom de l'organisme`)
      .otherwise(() => 'le nom');

  const getPièceJustificativeHintText = () =>
    match(typePersonne)
      .with(
        'Personne physique',
        () => `Une copie de titre d'identité (carte d'identité ou passeport) en cours de validité`,
      )
      .with(
        'Personne morale',
        () =>
          'Un extrait Kbis, pour les sociétés en cours de constitutionv une copie des statuts de la société en cours de constitution, une attestation de récépissé de dépôt de fonds pour constitution de capital social et une copie de l’acte désignant le représentant légal de la société',
      )
      .with(
        'Collectivité',
        () => `Un extrait de délibération portant sur le projet objet de l'offre`,
      )
      .otherwise(
        () =>
          `Tout document officiel permettant d'attester de l'existence juridique de la personne`,
      );

  return (
    <>
      <SelectNext
        label="Choisir le type de personne pour le représentant légal"
        placeholder={`Sélectionner le type de personne pour le représentant légal`}
        state={validationErrors['typeDePersonne'] ? 'error' : 'default'}
        stateRelatedMessage="Le type de personne pour le représentant légal est obligatoire"
        nativeSelectProps={{
          onChange: ({ currentTarget: { value } }) => {
            selectTypePersonne(value as TypeDePersonne);
            onChanged &&
              onChanged({ typePersonne: value, nomReprésentantLégal, piècesJustificatives });
          },
        }}
        options={['Personne physique', 'Personne morale', 'Collectivité', 'Autre'].map((type) => ({
          label: type,
          value: type,
        }))}
      />

      <Input
        label="Nom du représentant légal"
        id="nomRepresentantLegal"
        hintText={`Veuillez préciser ${getNomReprésentantLégalHintText()} pour le nouveau représentant légal de votre projet`}
        nativeInputProps={{
          name: 'nomRepresentantLegal',
          required: true,
          'aria-required': true,
          onChange: (e) => {
            setNomReprésentantLégal(e.target.value);
            onChanged &&
              onChanged({
                typePersonne,
                nomReprésentantLégal: e.target.value,
                piècesJustificatives,
              });
          },
        }}
        state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomRepresentantLegal']}
      />

      <UploadDocument
        label={'Pièce justificative'}
        id="pieceJustificative"
        name="pieceJustificative"
        hintText={getPièceJustificativeHintText()}
        required
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
        onChange={(fileNames) => {
          setPiècesJustificatives(fileNames);
          onChanged &&
            onChanged({
              typePersonne,
              nomReprésentantLégal,
              piècesJustificatives: fileNames,
            });
        }}
      />
    </>
  );
};

type ValidationProps = Saisie;
const Validation: FC<ValidationProps> = ({
  typePersonne,
  nomReprésentantLégal,
  piècesJustificatives,
}) => (
  <>
    <p>
      Vous êtes sur le point de faire une demande de changement de représentant légal pour votre
      projet. <br />
      Veuillez vérifier l'ensemble des informations saisies et valider si tout est correct.
    </p>
    <div className="py-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="whitespace-nowrap">Type de personne :</div>
          <blockquote className="font-semibold italic">{typePersonne}</blockquote>
        </div>
        <div className="flex gap-2">
          <div className="whitespace-nowrap">Nom représentant légal :</div>
          <blockquote className="font-semibold italic">{nomReprésentantLégal}</blockquote>
        </div>
        <div className="flex flex-col gap-2">
          <div className="whitespace-nowrap">Pièces justificatives :</div>
          {piècesJustificatives.map((pièceJustificative) => (
            <ul>
              <li>{pièceJustificative}</li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  </>
);

type StepProps = {
  index: number;
  name: string;
  children: ReactNode;
  previousStep?: { name: string };
  nextStep: { name: string; type: 'link' | 'submit' };
};

const Steps: FC<{
  onStepSelected: (stepIndex: number) => void;
  steps: Array<StepProps>;
}> = ({ onStepSelected, steps }) => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <ul className="flex flex-col gap-8">
      {steps.map((step) => (
        <li className={currentStep !== step.index ? 'hidden' : 'visible'}>
          {step.children}
          <StepNavigation
            onStepSelected={(stepIndex) => {
              setCurrentStep(stepIndex);
              onStepSelected(stepIndex);
            }}
            previousStep={
              step.previousStep
                ? { index: step.index - 1, name: step.previousStep.name }
                : undefined
            }
            nextStep={
              step.nextStep.type === 'link'
                ? { index: step.index + 1, name: step.nextStep.name, type: 'link' }
                : { name: step.nextStep.name, type: 'submit' }
            }
          />
        </li>
      ))}
    </ul>
  );
};

type StepNavigationProps = {
  onStepSelected: (stepIndex: number) => void;
  previousStep?: {
    index: number;
    name: string;
  };
  nextStep: {
    name: string;
  } & (
    | {
        index: number;
        type: 'link';
      }
    | {
        type: 'submit';
      }
  );
};

const StepNavigation: FC<StepNavigationProps> = ({ onStepSelected, previousStep, nextStep }) => (
  <div className="flex w-full mt-4 gap-4">
    {previousStep && (
      <Button type="button" priority="secondary" onClick={() => onStepSelected(previousStep.index)}>
        {previousStep.name}
      </Button>
    )}

    {nextStep.type === 'link' ? (
      <Button
        type="button"
        className="flex ml-auto"
        priority="secondary"
        onClick={() => onStepSelected(nextStep.index)}
      >
        {nextStep.name}
      </Button>
    ) : (
      <SubmitButton classname="flex ml-auto">{nextStep.name}</SubmitButton>
    )}
  </div>
);
