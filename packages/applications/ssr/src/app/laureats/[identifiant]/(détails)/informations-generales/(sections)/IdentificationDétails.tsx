import type { Lauréat } from '@potentiel-domain/projet';

import { FormattedSIREN, FormattedSIRET } from '@/components/atoms/FormattedNuméroIdentification';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { TitreChamp } from '@/components/atoms/section/TitreChamp';
import type { ChampObligatoireAvecAction } from '../../../_helpers';

export type IdentificationDétailsProps = ChampObligatoireAvecAction<
  Lauréat.Producteur.ConsulterProducteurReadModel['numéroIdentification']
>;

export const IdentificationDétails = ({ value, action }: IdentificationDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <div>
        <TitreChamp>Numéro d'identification</TitreChamp>
        <div className="flex flex-col">
          <span>
            Numéro SIRET : <FormattedSIRET value={value?.siret} />
          </span>
          <span>
            Numéro SIREN : <FormattedSIREN value={value?.siren} />
          </span>
        </div>
      </div>
      {action && (
        <TertiaryLink href={action.url} key={action.label}>
          {action.label}
        </TertiaryLink>
      )}
    </div>
  </>
);
