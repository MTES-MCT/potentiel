'use client';
import { FC } from 'react';
import { match, P } from 'ts-pattern';
import Notice from '@codegouvfr/react-dsfr/Notice';
import Link from 'next/link';

import { Lauréat } from '@potentiel-domain/projet';

import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import { DemanderOuEnregistrerChangementReprésentantLégalFormKeys } from '../schema';

import { TypeSociété } from './SaisieTypeSociété.step';

export type SaisiePièceJustificativeProps = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété?: TypeSociété;
  pièceJustificative?: Array<string>;
  onChange?: (piècesJustificative: Array<string>) => void;
  validationErrors: ValidationErrors<DemanderOuEnregistrerChangementReprésentantLégalFormKeys>;
  isOptional?: true;
};

export const SaisiePièceJustificativeStep: FC<SaisiePièceJustificativeProps> = ({
  typeReprésentantLégal,
  typeSociété,
  pièceJustificative,
  validationErrors,
  isOptional,
  onChange,
}) => {
  const getPièceJustificativeHintText = () =>
    match({ typeReprésentantLégal, typeSociété })
      .with(
        { typeReprésentantLégal: 'personne-physique' },
        () => `Une copie de titre d'identité (carte d'identité ou passeport) en cours de validité`,
      )
      .with(
        { typeReprésentantLégal: 'personne-morale', typeSociété: 'constituée' },
        () => `Un extrait Kbis`,
      )
      .with(
        {
          typeReprésentantLégal: 'personne-morale',
          typeSociété: P.union('en cours de constitution', 'non renseignée'),
        },
        () =>
          `Une copie des statuts de la société en cours de constitution, une attestation de récépissé de dépôt de fonds pour constitution de capital social et une copie de l’acte désignant le représentant légal de la société`,
      )
      .with(
        { typeReprésentantLégal: 'collectivité' },
        () => `Un extrait de délibération portant sur le projet`,
      )
      .otherwise(
        () =>
          `Tout document officiel permettant d'attester de l'existence juridique de l'organisme`,
      );

  return (
    <>
      <UploadNewOrModifyExistingDocument
        label={`Pièce justificative${isOptional ? ' (optionnel)' : ''}`}
        name="piecesJustificatives"
        hintText={getPièceJustificativeHintText()}
        required={!isOptional}
        formats={['pdf']}
        multiple={typeSociété !== 'constituée' ? true : undefined}
        state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['piecesJustificatives']}
        onChange={(piècesJustificatives) => {
          delete validationErrors['piecesJustificatives'];
          if (onChange) {
            onChange(piècesJustificatives);
          }
        }}
        documentKeys={pièceJustificative}
      />
      <Notice
        title="Concernant la sécurité de vos données"
        description={
          <span className="inline-block">
            <span className="inline-block">
              Un filigrane sera automatiquement appliqué sur l'ensemble des pièces justificatives
              transmises (nous utilisons le service de la plateforme d'état{' '}
              <Link href="https://filigrane.beta.gouv.fr/" target="_blank">
                filigrane.beta.gouv.fr
              </Link>
              . ).
            </span>
            <span className="inline-block">
              Les pièces seront automatiquement supprimées après traitement de votre demande.
            </span>
          </span>
        }
      />
    </>
  );
};
