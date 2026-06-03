'use client';
import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Link } from '@/components/atoms/LinkNoPrefetch';
import type { ValidationErrors } from '@/utils/formAction';
import type { DemanderOuEnregistrerChangementReprésentantLégalFormKeys } from '../schema';
import type { TypeSociété } from './SaisieTypeSociété.step';

export type SaisiePièceJustificativeProps = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
  pièceJustificative?: Array<string>;
  validationErrors: ValidationErrors<DemanderOuEnregistrerChangementReprésentantLégalFormKeys>;
};

export const SaisiePièceJustificativeStep: FC<SaisiePièceJustificativeProps> = ({
  typeReprésentantLégal,
  typeSociété,
  pièceJustificative,
  validationErrors,
}) => {
  const hintText = getHintTextePiècesJustificatives(typeReprésentantLégal, typeSociété);

  return (
    <>
      <UploadNewOrModifyExistingDocument
        label={'Pièce justificative'}
        name="piecesJustificatives"
        hintText={`Pièces à joindre : ${hintText}`}
        required
        formats={['pdf']}
        multiple={typeSociété !== 'constituée' ? true : undefined}
        state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['piecesJustificatives']}
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

const getHintTextePiècesJustificatives = (
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType,
  typeSociété: TypeSociété,
): string =>
  match(typeReprésentantLégal)
    .returnType<string>()
    .with(
      'personne-physique',
      () => "Une copie de titre d'identité (carte d'identité ou passeport) en cours de validité",
    )
    .with('personne-morale', () =>
      match(typeSociété)
        .returnType<string>()
        .with('constituée', () => 'un extrait Kbis')
        .with(
          'en cours de constitution',
          () =>
            'une copie des statuts de la société, une attestation de récépissé de dépôt de fonds pour constitution de capital social, une copie de l’acte désignant le représentant légal de la société',
        )
        .with(
          'non renseignée',
          () =>
            'Veuillez sélectionner le type de société pour voir les pièces justificatives à fournir',
        )
        .exhaustive(),
    )
    .with('collectivité', () => 'Un extrait de délibération portant sur le projet')
    .with(
      'autre',
      () => "Tout document officiel permettant d'attester de l'existence juridique de l'organisme",
    )
    .with(
      'inconnu',
      () =>
        'Veuillez sélectionner le type de représentant légal pour voir les pièces justificatives à fournir',
    )
    .exhaustive();
