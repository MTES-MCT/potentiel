import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';

import type { ChampAvecMultiplesActions } from '@/app/laureats/[identifiant]/_helpers';
import { FormattedSIREN, FormattedSIRET } from '@/components/atoms/FormattedNuméroIdentification';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { TitreChamp } from '@/components/atoms/section/TitreChamp';

export type ProducteurDétailsProps = ChampAvecMultiplesActions<
  PlainType<Lauréat.Producteur.ConsulterProducteurReadModel>
>;

export const ProducteurDétails = ({ value, actions }: ProducteurDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <div>
        <TitreChamp>Nom du producteur</TitreChamp>
        <span>{value.producteur || 'Champ non renseigné'}</span>
      </div>
      <div>
        <TitreChamp>Numéro d'identification</TitreChamp>
        <div className="flex flex-col">
          <span>
            Numéro SIRET : <FormattedSIRET value={value.numéroIdentification?.siret} />
          </span>
          <span>
            Numéro SIREN : <FormattedSIREN value={value.numéroIdentification?.siren} />
          </span>
        </div>
      </div>
      {actions?.map((action) => (
        <TertiaryLink href={action.url} key={action.label}>
          {action.label}
        </TertiaryLink>
      ))}
    </div>
  </>
);
