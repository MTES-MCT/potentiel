'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';

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
  période,
  technologie,
  famille,
  cahierDesCharges,
  note,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderChangementPuissanceFormKeys>
  >({});
  const [piècesJustificatives, setPiècesJustificatives] = useState<Array<string>>([]);
  const [nouvellePuissance, setNouvellePuissance] = useState<number>(puissance);

  // implémentation des règles du ratios
  const ratioValueType = Puissance.RatioChangementPuissance.bind({
    appelOffre,
    période,
    famille,
    cahierDesCharges,
    technologie: technologie,
    ratio: nouvellePuissance / puissance,
    nouvellePuissance: nouvellePuissance,
    note,
  });

  const dépasseLesRatioDeAppelOffres =
    ratioValueType.dépasseRatiosChangementPuissance().dépasseMax ||
    ratioValueType.dépasseRatiosChangementPuissance().enDeçaDeMin;
  const dépassePuissanceMaxDuVolumeRéservé = ratioValueType.dépassePuissanceMaxDuVolumeRéservé();
  const dépassePuissanceMaxFamille = ratioValueType.dépassePuissanceMaxFamille();

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
          <SubmitButton
            disabledCondition={() =>
              (!piècesJustificatives.length && dépasseLesRatioDeAppelOffres) ||
              Object.keys(validationErrors).length > 0 ||
              dépassePuissanceMaxDuVolumeRéservé ||
              dépassePuissanceMaxFamille
            }
          >
            Confirmer la demande
          </SubmitButton>
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
        <Input
          state={validationErrors['puissance'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['puissance']}
          label="Puissance (en MWc)"
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
          dépasseLesRatioDeAppelOffres={dépasseLesRatioDeAppelOffres}
          dépassePuissanceMaxDuVolumeRéservé={dépassePuissanceMaxDuVolumeRéservé}
          dépassePuissanceMaxFamille={dépassePuissanceMaxFamille}
        />
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
          multiple
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
          onChange={(piècesJustificatives) => {
            delete validationErrors['piecesJustificatives'];
            setPiècesJustificatives(piècesJustificatives);
          }}
        />
      </div>
    </Form>
  );
};
