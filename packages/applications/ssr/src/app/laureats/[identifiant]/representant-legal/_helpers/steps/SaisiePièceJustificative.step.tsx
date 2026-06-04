'use client';
import { Highlight } from '@codegouvfr/react-dsfr/Highlight';
import type { FC } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Link } from '@/components/atoms/LinkNoPrefetch';
import type { ValidationErrors } from '@/utils/formAction';
import { getPiècesJustificativesText } from '../getTypeReprésentantLégalLabel';
import type { DemanderOuEnregistrerChangementReprésentantLégalFormKeys } from '../schema';
import type { TypeSociété } from './SaisieTypeAndSociété.step';

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
  const hintText = getPiècesJustificativesText(typeReprésentantLégal, typeSociété);

  return (
    <div className="md:grid md:grid-cols-2 md:items-center gap-2">
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
      <Highlight size="sm" classes={{ root: 'fr-highlight--brown-caramel' }}>
        Un filigrane sera appliqué sur l'ensemble des pièces transmises (nous utilisons le service
        de la plateforme d'état{' '}
        <Link href="https://filigrane.beta.gouv.fr/" target="_blank">
          filigrane.beta.gouv.fr
        </Link>
        . ). Elles seront automatiquement supprimées après traitement de votre demande.
      </Highlight>
    </div>
  );
};
