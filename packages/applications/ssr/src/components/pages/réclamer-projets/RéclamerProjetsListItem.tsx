'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Input from '@codegouvfr/react-dsfr/Input';
import Image from 'next/image';

import { ModalWithForm } from '../../molecules/ModalWithForm';
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
            <RéclamerProjetForm identifiantProjet={identifiantProjet} nomProjet={nomProjet} />
          ) : (
            <RéclamerProjetAvecPrixEtNuméroCREForm
              identifiantProjet={identifiantProjet}
              nomProjet={nomProjet}
            />
          )}
        </div>
      </div>
    </div>
  </div>
);

type RéclamerProjetFormProps = {
  identifiantProjet: string;
  nomProjet: string;
};

const RéclamerProjetForm: FC<RéclamerProjetFormProps> = ({ identifiantProjet, nomProjet }) => {
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

const RéclamerProjetAvecPrixEtNuméroCREForm: FC<RéclamerProjetFormProps> = ({
  identifiantProjet,
  nomProjet,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCREDocument, setShowCREDocument] = useState(false);
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
                className="my-4 pr-2"
                description={
                  <div className="flex flex-col gap-2">
                    <p>
                      Veuillez saisir le prix de référence tel qu'il figure dans votre attestation
                      de désignation, ainsi que le numéro CRE.
                    </p>
                    <Button
                      iconId="fr-icon-checkbox-circle-line"
                      onClick={() => setShowCREDocument(!showCREDocument)}
                      priority="tertiary no outline"
                      size="small"
                    >
                      {showCREDocument ? 'Masquer' : 'Où trouver mon numéro CRE ?'}
                    </Button>
                    {showCREDocument && (
                      <div className="px-4 py-2 w-full">
                        <Image
                          src="/images/numeroCRE_tooltip.jpg"
                          alt="Capture d'un exemple d'attestation de désignation indiquant où trouver le numéro CRE dans les référence du document."
                          className="w-full"
                          width={700}
                          height={700}
                        />
                      </div>
                    )}
                  </div>
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
