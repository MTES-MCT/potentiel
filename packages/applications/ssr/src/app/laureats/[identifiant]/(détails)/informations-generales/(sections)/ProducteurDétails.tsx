import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';

import type { ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';
import { FormattedSIREN, FormattedSIRET } from '@/components/atoms/FormattedNuméroIdentification';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { TitreChamp } from '@/components/atoms/section/TitreChamp';

export type ProducteurDétailsProps = {
  producteur: ChampObligatoireAvecAction<
    PlainType<Lauréat.Producteur.ConsulterProducteurReadModel['producteur']>
  >;
  numéroIdentification: ChampObligatoireAvecAction<
    PlainType<Lauréat.Producteur.ConsulterProducteurReadModel['numéroIdentification']>
  >;
};

export const ProducteurDétails = ({ producteur, numéroIdentification }: ProducteurDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <div>
        <TitreChamp>Nom du producteur</TitreChamp>
        <span>{producteur.value || 'Champ non renseigné'}</span>
      </div>
      {producteur.action && (
        <TertiaryLink href={producteur.action.url} key={producteur.action.label}>
          {producteur.action.label}
        </TertiaryLink>
      )}
      <div>
        <TitreChamp>Numéro d'identification</TitreChamp>
        <div className="flex flex-col">
          <span>
            Numéro SIRET : <FormattedSIRET value={numéroIdentification.value?.siret} />
          </span>
          <span>
            Numéro SIREN : <FormattedSIREN value={numéroIdentification.value?.siren} />
          </span>
        </div>
      </div>
      {numéroIdentification.action && (
        <TertiaryLink
          href={numéroIdentification.action.url}
          key={numéroIdentification.action.label}
        >
          {numéroIdentification.action.label}
        </TertiaryLink>
      )}
    </div>
  </>
);
