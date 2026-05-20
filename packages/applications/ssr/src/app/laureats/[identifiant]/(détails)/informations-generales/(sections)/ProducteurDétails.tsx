import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';

import type { ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';
import { FormattedSIREN, FormattedSIRET } from '@/components/atoms/FormattedNuméroIdentification';
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
      <div>
        <Heading6>Numéro d'immmatriculation</Heading6>
        <div className="flex flex-col">
          <span>
            Numéro SIRET : <FormattedSIRET siret={value.numéroIdentification?.siret} />
          </span>
          <span>
            Numéro SIREN : <FormattedSIREN siren={value.numéroIdentification?.siren} />
          </span>
        </div>
      </div>
      {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
    </div>
  </>
);
