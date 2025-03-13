'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { ValidationErrors } from '../../../utils/formAction';

import { réclamerProjetAction, RéclamerProjetsFormKeys } from './réclamer/réclamerProjet.action';

export type RéclamerProjetsListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  userHasSameEmail: boolean;
  puissance: number;
  région: string;
};

export const RéclamerProjetsListItem: FC<RéclamerProjetsListItemProps> = ({
  identifiantProjet,
  nomProjet,
  userHasSameEmail,
  puissance,
  région,
}) => (
  <div className={`relative  md:pb-0 flex flex-1 flex-col gap-6`}>
    <div className={`flex flex-col`}>
      <div className="flex items-center">
        <div className="flex flex-col gap-4">
          <h2 className="leading-5">
            Projet <span className="font-bold">{nomProjet}</span>
          </h2>
          <div className="text-sm flex flex-col">
            <div>
              Puissance : <span className="font-semibold">{puissance}</span>
            </div>
            <div>
              Région : <span className="font-semibold">{région}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 md:relative md:flex items-center ml-auto gap-4">
          {userHasSameEmail ? (
            <RéclamerProjetButton identifiantProjet={identifiantProjet} nomProjet={nomProjet} />
          ) : (
            <RéclamerProjetAvecPrixEtNuméroCREButton
              identifiantProjet={identifiantProjet}
              nomProjet={nomProjet}
            />
          )}
        </div>
      </div>
    </div>
  </div>
);

type RéclamerProjetButtonProps = {
  identifiantProjet: string;
  nomProjet: string;
};

const RéclamerProjetButton: FC<RéclamerProjetButtonProps> = ({ identifiantProjet, nomProjet }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        {'Réclamer le projet'}
      </Button>

      <ModalWithForm
        id={`réclamer-projet-${identifiantProjet}`}
        title="Réclamer le projet"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'réclamer-projet-form',
          action: réclamerProjetAction,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir réclamer le projet {nomProjet} ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={nomProjet} name="nomProjet" />
              <input type={'hidden'} value={'true'} name="hasSameEmail" />
            </>
          ),
        }}
      />
    </>
  );
};

type RéclamerProjetAvecPrixEtNuméroCREButtonProps = {
  identifiantProjet: string;
  nomProjet: string;
};

// TODO:
// ajouter un tooltip, c'est plus joli
// ajouter l'image pour le numero CRE
// changer la route du bouton

const RéclamerProjetAvecPrixEtNuméroCREButton: FC<RéclamerProjetAvecPrixEtNuméroCREButtonProps> = ({
  identifiantProjet,
  nomProjet,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<RéclamerProjetsFormKeys>
  >({});
  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        {'Réclamer le projet'}
      </Button>

      <ModalWithForm
        id={`réclamer-projet-${identifiantProjet}`}
        title="Réclamer le projet"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'réclamer-projet-form',
          action: réclamerProjetAction,
          omitMandatoryFieldsLegend: true,
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <Alert
                severity="info"
                small
                className="my-4"
                description={
                  <>
                    <p>
                      Veuillez saisir le prix de référence tel qu'il figure dans votre attestation
                      de désignation, ainsi que le numéro CRE.
                      <Tooltip
                        kind="hover"
                        className="ml-1"
                        title={
                          <>
                            <span>
                              Où trouver mon numéro CRE sur mon attestation de désignation ?
                            </span>
                            <Image
                              alt="Capture d'un exemple d'attestation de désignation indiquant où trouver le numéro CRE dans les référence du document."
                              src="/images/numeroCRE_tooltip.jpg"
                              width={700}
                              height={700}
                            />
                          </>
                        }
                      />
                    </p>
                  </>
                }
              />
              <Input
                state={validationErrors['prixReference'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['prixReference']}
                label="Prix de référence"
                nativeInputProps={{
                  name: 'prixReference',
                  required: true,
                  'aria-required': true,
                }}
              />
              <Input
                nativeInputProps={{
                  name: 'numeroCRE',
                  required: true,
                  type: 'text',
                  'aria-required': true,
                }}
                label="Numéro CRE"
                state={validationErrors['numeroCRE'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['numeroCRE']}
              />
              <input type={'hidden'} value={'false'} name="hasSameEmail" />
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={nomProjet} name="nomProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
