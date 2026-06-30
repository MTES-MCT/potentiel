import type { Lauréat } from '@potentiel-domain/projet';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { TitreChamp } from '@/components/atoms/section/TitreChamp';
import type { ChampObligatoireAvecAction } from '../../../_helpers';

export type ProducteurDétailsProps = ChampObligatoireAvecAction<
  Lauréat.Producteur.ConsulterProducteurReadModel['producteur']
>;

export const ProducteurDétails = ({ value, action }: ProducteurDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <div>
        <TitreChamp>Nom du producteur</TitreChamp>
        <span>{value || 'Champ non renseigné'}</span>
      </div>
      {action && (
        <TertiaryLink href={action.url} key={action.label}>
          {action.label}
        </TertiaryLink>
      )}
    </div>
  </>
);
