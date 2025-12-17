import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '@/app/_helpers';
import { getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers';

import { Section } from '../../../(components)/Section';

import { AutorisationUrbanismeDétails } from './AutorisationUrbanismeDétails';

type AutorisationUrbanismeSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const AutorisationUrbanismeSection = async ({
  identifiantProjet: identifiantProjetValue,
}: AutorisationUrbanismeSectionProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

  const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

  if (!cahierDesCharges.getChampsSupplémentaires().autorisationDUrbanisme) {
    return null;
  }

  const lauréat = await getLauréatInfos(identifiantProjet.formatter());

  return (
    <Section title="Autorisation d'urbanisme">
      <AutorisationUrbanismeDétails
        value={
          lauréat.autorisationDUrbanisme
            ? mapToPlainObject(lauréat.autorisationDUrbanisme)
            : undefined
        }
      />
    </Section>
  );
};
