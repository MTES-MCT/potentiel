'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  demanderChangementPuissanceAction,
  DemanderChangementPuissanceFormKeys,
} from './demanderChangementPuissance.action';
import { DemanderChangementPuissancePageProps } from './DemanderChangementPuissance.page';
import { DemanderChangementPuissanceFormErrors } from './DemanderChangementPuissanceFormErrors';

export type DemanderChangementPuissanceFormProps = DemanderChangementPuissancePageProps;

export const DemanderChangementPuissanceForm: FC<DemanderChangementPuissanceFormProps> = ({
  identifiantProjet,
  puissance,
  appelOffre,
  technologie,
  famille,
  cahierDesCharges,
  volumeRéservé,
  unitéPuissance,
  puissanceInitiale,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderChangementPuissanceFormKeys>
  >({});
  const [nouvellePuissance, setNouvellePuissance] = useState<number>(puissance);
  const ratio = nouvellePuissance / puissanceInitiale;
  const ratioActuelleNouvelle = nouvellePuissance / puissance;

  const ratioValueType = Lauréat.Puissance.RatioChangementPuissance.déterminer({
    appelOffre,
    famille,
    cahierDesCharges,
    technologie,
    puissanceInitiale,
    nouvellePuissance,
    volumeRéservé,
  });

  const dépasseLesRatioDeAppelOffres = ratioValueType.dépasseRatiosChangementPuissance();

  const ratioHintText = isNaN(nouvellePuissance) ? (
    "Aucune valeur n'est encore renseignée"
  ) : ratioActuelleNouvelle === 1 ? (
    'La valeur est identique à la puissance actuelle'
  ) : (
    <span>
      Soit{' '}
      <strong>
        {ratio === 1
          ? 'aucune modification'
          : ratio > 1
            ? `une augmentation de 
        ${Math.round(Math.abs(100 - ratio * 100) * 10) / 10}%`
            : `une diminution de 
        ${Math.round(Math.abs(100 - ratio * 100) * 10) / 10}%`}
      </strong>{' '}
      de la puissance initiale, et{' '}
      <strong>
        {ratioActuelleNouvelle > 1 ? 'une augmentation' : 'une diminution'} de{' '}
        {Math.round(Math.abs(100 - ratioActuelleNouvelle * 100) * 10) / 10}%
      </strong>{' '}
      de la puissance actuelle du projet
    </span>
  );

  return (
    <Form
      action={demanderChangementPuissanceAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour à la page projet
          </Button>
          <SubmitButton>Confirmer la demande</SubmitButton>
        </>
      }
    >
      <input
        name="isInformationEnregistree"
        type="hidden"
        value={dépasseLesRatioDeAppelOffres ? 'false' : 'true'}
      />

      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Input
            state={validationErrors['puissance'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['puissance']}
            label={`Puissance (en ${unitéPuissance})`}
            hintText={ratioHintText}
            nativeInputProps={{
              name: 'puissance',
              defaultValue: puissance,
              required: true,
              'aria-required': true,
              type: 'number',
              inputMode: 'decimal',
              pattern: '[0-9]+([.][0-9]+)?',
              step: 'any',
              onChange: (e) => setNouvellePuissance(parseFloat(e.target.value)),
            }}
          />
          <DemanderChangementPuissanceFormErrors
            ratioChangementPuissance={ratioValueType}
            aChoisiCDC2022={
              cahierDesCharges.type === 'modifié' && cahierDesCharges.paruLe === '30/08/2022'
            }
            fourchetteRatioInitialEtCDC2022AlertMessage={
              cahierDesCharges.type === 'modifié'
                ? cahierDesCharges.seuilSupplémentaireChangementPuissance?.paragrapheAlerte
                : undefined
            }
            unitéPuissance={unitéPuissance}
          />
        </div>
        <Input
          textArea
          label={`Raison ${dépasseLesRatioDeAppelOffres ? '' : '(optionnel)'}`}
          id="raison"
          hintText="Pour faciliter le traitement de votre demande, veuillez détailler les raisons ayant conduit au changement de puissance."
          nativeTextAreaProps={{
            name: 'raison',
            required: dépasseLesRatioDeAppelOffres,
            'aria-required': dépasseLesRatioDeAppelOffres,
          }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
        <UploadNewOrModifyExistingDocument
          label={`Pièce justificative ${dépasseLesRatioDeAppelOffres ? '' : '(optionnel)'}`}
          name="piecesJustificatives"
          hintText="Joindre votre justificatif"
          required={dépasseLesRatioDeAppelOffres}
          formats={['pdf']}
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
        />
      </div>
    </Form>
  );
};
