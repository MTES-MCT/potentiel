import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { ChampAvecAction } from '../../../../_helpers/types';
import { Champ } from '../../../(components)/Champ';

export type AutorisationUrbanismeDétailsProps = ChampAvecAction<
  PlainType<Lauréat.ConsulterLauréatReadModel['autorisationDUrbanisme']>
>;

export const AutorisationUrbanismeDétails = ({ value }: AutorisationUrbanismeDétailsProps) =>
  value ? (
    <ul className="list-none m-0 pl-0">
      <Champ label="Numéro" text={value.numéro} />
      <Champ label="Date d'obtention" date={value.date.date} />
    </ul>
  ) : (
    <div>Champ non renseigné</div>
  );
