import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';

export type ProducteurDétailsProps = ChampObligatoireAvecAction<
  PlainType<Lauréat.Producteur.ConsulterProducteurReadModel>
>;

export const ProducteurDétails = ({ value, action }: ProducteurDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <span>{value.producteur || 'Champ non renseigné'}</span>
      {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
    </div>
  </>
);
