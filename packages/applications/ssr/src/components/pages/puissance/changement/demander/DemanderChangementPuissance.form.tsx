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
  unitéPuissance,
  puissanceInitiale,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderChangementPuissanceFormKeys>
  >({});
  const [piècesJustificatives, setPiècesJustificatives] = useState<Array<string>>([]);
  const [nouvellePuissance, setNouvellePuissance] = useState<number>(puissance);
  const ratio = nouvellePuissance / puissanceInitiale;

  const ratioValueType = Puissance.RatioChangementPuissance.bind({
    appelOffre,
    période,
    famille,
    cahierDesCharges,
    technologie,
    ratio,
    nouvellePuissance,
    note,
  });

  const dépasseLesRatioDeAppelOffres =
    ratioValueType.dépasseRatiosChangementPuissance().dépasseMax ||
    ratioValueType.dépasseRatiosChangementPuissance().enDeçaDeMin;
  const dépassePuissanceMaxDuVolumeRéservé = ratioValueType.dépassePuissanceMaxDuVolumeRéservé();
  const dépassePuissanceMaxFamille = ratioValueType.dépassePuissanceMaxFamille();
  const fourchetteRatioInitialEtCDC2022AlertMessage =
    cahierDesCharges.type === 'modifié'
      ? cahierDesCharges.seuilSupplémentaireChangementPuissance?.paragrapheAlerte
      : undefined;
  const dépasseRatiosChangementPuissanceDuCahierDesChargesInitial =
    ratioValueType.dépasseRatiosChangementPuissanceDuCahierDesChargesInitial();
  const aChoisiCDC2022 =
    cahierDesCharges.type === 'modifié' && cahierDesCharges.paruLe === '30/08/2022';

  const ratioHintText =
    ratio === 1
      ? 'La valeur est identique à la puissance actuelle'
      : `Ceci correspond à ${ratio > 1 ? 'une augmentation' : 'une diminution'} de ${Math.abs(100 - ratio * 100)}% par rapport à la puissance initiale du projet`;

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
        <div className="flex flex-col gap-2">
          <Input
            state={validationErrors['puissance'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['puissance']}
            label="Puissance (en MWc)"
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
            dépasseLesRatioDeAppelOffres={dépasseLesRatioDeAppelOffres}
            dépassePuissanceMaxDuVolumeRéservé={dépassePuissanceMaxDuVolumeRéservé}
            dépassePuissanceMaxFamille={dépassePuissanceMaxFamille}
            dépasseRatiosChangementPuissanceDuCahierDesChargesInitial={
              dépasseRatiosChangementPuissanceDuCahierDesChargesInitial
            }
            aChoisiCDC2022={aChoisiCDC2022}
            fourchetteRatioInitialEtCDC2022AlertMessage={
              fourchetteRatioInitialEtCDC2022AlertMessage
            }
            unitéPuissance={unitéPuissance}
            puissanceMaxVoluméRéservé={ratioValueType.récupérerPuissanceMaxVolumeRéservé()}
            puissanceMaxFamille={ratioValueType.récupérerPuissanceMaxFamille()}
            ratioAppelOffre={{
              min: ratioValueType.récupérerRatiosChangementPuissance().minRatio,
              max: ratioValueType.récupérerRatiosChangementPuissance().maxRatio,
            }}
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
