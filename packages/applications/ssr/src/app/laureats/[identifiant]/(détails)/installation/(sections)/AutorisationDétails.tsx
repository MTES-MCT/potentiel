import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { ChampAvecAction } from '@/app/laureats/[identifiant]/_helpers';
import { Champ } from '@/components/atoms/menu/Champ';

export type AutorisationDétailsProps = ChampAvecAction<
  PlainType<Lauréat.ConsulterLauréatReadModel['autorisation']>
>;

export const AutorisationDétails = ({ value }: AutorisationDétailsProps) =>
  value ? (
    <ul className="list-none m-0 pl-0">
      <Champ label="Numéro" text={value.numéro} />
      <Champ label="Date d'obtention" date={value.date.date} />
    </ul>
  ) : (
    <div>Champ non renseigné</div>
  );
