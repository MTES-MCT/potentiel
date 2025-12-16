import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { Section } from '../../../(components)/Section';
import { getCahierDesCharges } from '../../../../../../_helpers';
import { getLauréatInfos } from '../../../../_helpers/getLauréat';

import { AutorisationUrbanismeDétails } from './AutorisationUrbanismeDétails';

type AutorisationUrbanismeSectionProps = {
  identifiantProjet: string;
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
