import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { ChampAvecAction } from '../../../_helpers/types';
import { FormattedDate } from '../../../../../../components/atoms/FormattedDate';

export type AutorisationUrbanismeDétailsProps = ChampAvecAction<
  PlainType<Lauréat.ConsulterLauréatReadModel['autorisationDUrbanisme']>
>;

export const AutorisationUrbanismeDétails = ({ value }: AutorisationUrbanismeDétailsProps) => (
  <>
    {value ? (
      <ul className="list-none m-0 pl-0">
        <li>Numéro : {value?.numéro}</li>
        {value?.date && <li>Date d'obtention : {<FormattedDate date={value.date.date} />}</li>}
      </ul>
    ) : (
      <div>Champs non renseigné</div>
    )}
  </>
);
