import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
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
      {value.numéroIdentification !== undefined && (
        <div>
          <Heading6>Numéro d'immmatriculation</Heading6>
          <div className="flex flex-col">
            {value.numéroIdentification.siret && (
              <span>Numéro SIRET : {value.numéroIdentification.siret}</span>
            )}
            {value.numéroIdentification.siren && (
              <span>Numéro SIREN : {value.numéroIdentification.siren}</span>
            )}
          </div>
        </div>
      )}
      {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
    </div>
  </>
);
