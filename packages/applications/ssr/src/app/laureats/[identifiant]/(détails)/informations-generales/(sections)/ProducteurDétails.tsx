import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';
import { Heading6 } from '@/components/atoms/headings';

export type ProducteurDétailsProps = ChampObligatoireAvecAction<
  PlainType<Lauréat.Producteur.ConsulterProducteurReadModel>
>;

export const ProducteurDétails = ({ value, action }: ProducteurDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <div>
        <Heading6>Nom du producteur</Heading6>
        <span>{value.producteur || 'Champ non renseigné'}</span>
      </div>
      {value.numéroImmatriculation !== undefined && (
        <div>
          <Heading6>Numéro d'immmatriculation</Heading6>
          {value.numéroImmatriculation.siret && (
            <span>Numéro SIRET : {value.numéroImmatriculation.siret}</span>
          )}
          {value.numéroImmatriculation.siren && (
            <span>Numéro SIREN : {value.numéroImmatriculation.siren}</span>
          )}
        </div>
      )}
      {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
    </div>
  </>
);
