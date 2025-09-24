'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { CahierDesCharges, IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
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
  cahierDesCharges,
  cahierDesChargesInitial,
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

  const cdcActuel = CahierDesCharges.bind(cahierDesCharges);
  const ratioCdcActuel = Lauréat.Puissance.RatioChangementPuissance.bind({
    puissanceMaxFamille: cahierDesCharges.famille?.puissanceMax,
    ratios: cdcActuel.getRatiosChangementPuissance(),
    puissanceInitiale,
    nouvellePuissance,
    volumeRéservé,
  });
  const ratioCdcInitial = Lauréat.Puissance.RatioChangementPuissance.bind({
    puissanceMaxFamille: cahierDesCharges.famille?.puissanceMax,
    ratios: CahierDesCharges.bind(cahierDesChargesInitial).getRatiosChangementPuissance(),
    puissanceInitiale,
    nouvellePuissance,
    volumeRéservé,
  });

  const dépasseLesRatioDeAppelOffres = ratioCdcActuel.dépasseRatiosChangementPuissance();

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
      actionButtons={{
        submitLabel: 'Demander le changement',
        secondaryAction: {
          type: 'back',
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
          label: 'Retour à la page projet',
        },
      }}
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
            label={`Puissance (en ${unitéPuissance.unité})`}
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
            ratioCdcActuel={ratioCdcActuel}
            ratioCdcInitial={ratioCdcInitial}
            aChoisiCDC2022={
              cahierDesCharges.cahierDesChargesModificatif
                ? AppelOffre.RéférenceCahierDesCharges.bind(
                    cahierDesCharges.cahierDesChargesModificatif,
                  ).estCDC2022()
                : false
            }
            fourchetteRatioInitialEtCDC2022AlertMessage={
              cdcActuel.getRèglesChangements('puissance').paragrapheAlerte
            }
            unitéPuissance={unitéPuissance.unité}
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
