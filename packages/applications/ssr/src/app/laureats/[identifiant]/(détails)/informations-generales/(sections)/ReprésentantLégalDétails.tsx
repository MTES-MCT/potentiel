import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

export type ReprésentantLégalDétailsProps = ChampObligatoireAvecAction<
  PlainType<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalReadModel>
>;

export const ReprésentantLégalDétails = ({ value, action }: ReprésentantLégalDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <span>{value.nomReprésentantLégal || 'Champ non renseigné'}</span>
      {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
    </div>
  </>
);
