'use client';

import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';
import { Icon } from '@/components/atoms/Icon';

import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from '../../GestionnaireRéseauSelect';

import {
  transmettreDemandeComplèteRaccordementAction,
  TransmettreDemandeComplèteRaccordementFormKeys,
} from './transmettreDemandeComplèteRaccordement.action';

export type TransmettreDemandeComplèteRaccordementFormProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  gestionnaireRéseauActuel: GestionnaireRéseauSelectProps['gestionnaireRéseauActuel'];
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['listeGestionnairesRéseau'];
  aDéjàTransmisUneDemandeComplèteDeRaccordement: boolean;
};

export const TransmettreDemandeComplèteRaccordementForm = ({
  identifiantProjet,
  gestionnaireRéseauActuel,
  listeGestionnairesRéseau,
  aDéjàTransmisUneDemandeComplèteDeRaccordement,
}: TransmettreDemandeComplèteRaccordementFormProps) => {
  const identifiantProjetValue = IdentifiantProjet.bind(identifiantProjet).formatter();
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettreDemandeComplèteRaccordementFormKeys>
  >({});

  const identifiantGestionnaireRéseauActuel = Option.match(gestionnaireRéseauActuel)
    .some<string | undefined>((grd) => grd.identifiantGestionnaireRéseau.codeEIC)
    .none(() => undefined);

  const [selectedIdentifiantGestionnaireRéseau, setSelectedIdentifiantGestionnaireRéseau] =
    useState<string | undefined>(identifiantGestionnaireRéseauActuel);

  const alreadyHasAGestionnaireRéseau =
    identifiantGestionnaireRéseauActuel && identifiantGestionnaireRéseauActuel !== 'inconnu';

  const gestionnaireActuel = selectedIdentifiantGestionnaireRéseau
    ? listeGestionnairesRéseau.find(
        (gestionnaire) =>
          gestionnaire.identifiantGestionnaireRéseau.codeEIC ===
          selectedIdentifiantGestionnaireRéseau,
      )
    : undefined;
  const format = gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement?.format ?? Option.none;
  const légende = gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement.légende ?? Option.none;
  const expressionReguliere =
    gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement?.expressionReguliere?.expression ??
    ExpressionRegulière.accepteTout.expression;

  return (
    <Form
      action={transmettreDemandeComplèteRaccordementAction}
      heading="Transmettre une demande complète de raccordement"
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          {aDéjàTransmisUneDemandeComplèteDeRaccordement ? (
            <Button
              priority="secondary"
              linkProps={{
                href: Routes.Raccordement.détail(identifiantProjetValue),
                prefetch: false,
              }}
              iconId="fr-icon-arrow-left-line"
            >
              Retour aux dossiers de raccordement
            </Button>
          ) : (
            <Button
              priority="secondary"
              linkProps={{
                href: Routes.Projet.details(identifiantProjetValue),
                prefetch: false,
              }}
              iconId="fr-icon-arrow-left-line"
            >
              Retour au projet
            </Button>
          )}
          <SubmitButton>Transmettre</SubmitButton>
        </>
      }
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjetValue} />

      <input
        name="identifiantGestionnaireRéseauActuel"
        type="hidden"
        value={identifiantGestionnaireRéseauActuel}
      />
      {alreadyHasAGestionnaireRéseau ? (
        <div className="flex flex-col">
          <input
            type="hidden"
            name="identifiantGestionnaireReseau"
            value={identifiantGestionnaireRéseauActuel}
          />
          <div className="flex gap-3">
            <legend className="font-bold">Gestionnaire réseau actuel</legend>
            {aDéjàTransmisUneDemandeComplèteDeRaccordement ? null : (
              <Link href={Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjetValue)}>
                <Icon id="fr-icon-edit-box-line" size="sm" /> Modifier
              </Link>
            )}
          </div>
          <div className="flex flex-col">
            {gestionnaireActuel?.raisonSociale} (
            {gestionnaireActuel?.identifiantGestionnaireRéseau?.codeEIC})
          </div>
        </div>
      ) : (
        <GestionnaireRéseauSelect
          id="identifiantGestionnaireReseau"
          name="identifiantGestionnaireReseau"
          label="Gestionnaire de réseau"
          listeGestionnairesRéseau={listeGestionnairesRéseau}
          gestionnaireRéseauActuel={gestionnaireRéseauActuel}
          state={validationErrors['identifiantGestionnaireReseau'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['identifiantGestionnaireReseau']}
          onGestionnaireRéseauSelected={(identifiantGestionnaireRéseau) =>
            setSelectedIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau)
          }
        />
      )}

      <Input
        label="Référence du dossier de raccordement du projet *"
        hintText={
          <div>
            {Option.match(légende)
              .some((légende) => <div>Format attendu : {légende}</div>)
              .none(() => (
                <></>
              ))}
            {Option.match(format)
              .some((format) => <div className="italic">Exemple : {format}</div>)
              .none(() => (
                <></>
              ))}
          </div>
        }
        state={validationErrors['referenceDossier'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['referenceDossier']}
        nativeInputProps={{
          name: 'referenceDossier',
          required: true,
          'aria-required': true,
          placeholder: Option.match(format)
            .some((format) => `Exemple: ${format}`)
            .none(() => `Renseigner la référence`),
          pattern: expressionReguliere || undefined,
          className: 'uppercase placeholder:capitalize',
        }}
      />

      <Input
        label="Date de l'accusé de réception"
        state={validationErrors['dateQualification'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateQualification']}
        nativeInputProps={{
          type: 'date',
          name: 'dateQualification',
          max: new Date().toISOString().split('T').shift(),
          required: true,
          'aria-required': true,
        }}
      />

      <UploadNewOrModifyExistingDocument
        label="Accusé de réception de la demande complète de raccordement **"
        name="accuseReception"
        required
        formats={['pdf']}
        state={validationErrors['accuseReception'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['accuseReception']}
      />
    </Form>
  );
};
