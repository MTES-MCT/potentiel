import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '@/app/_helpers';
import { getLauréatInfos, SectionWithErrorHandling } from '@/app/laureats/[identifiant]/_helpers';

import { Section } from '../../../(components)/Section';

import { AutorisationUrbanismeDétails } from './AutorisationUrbanismeDétails';

type AutorisationUrbanismeSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = "Autorisation d'urbanisme";

export const AutorisationUrbanismeSection = ({
  identifiantProjet: identifiantProjetValue,
}: AutorisationUrbanismeSectionProps) =>
  SectionWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    if (!cahierDesCharges.getChampsSupplémentaires().autorisationDUrbanisme) {
      return null;
    }

    const lauréat = await getLauréatInfos(identifiantProjet.formatter());

    return (
      <Section title={sectionTitle}>
        <AutorisationUrbanismeDétails
          value={
            lauréat.autorisationDUrbanisme
              ? mapToPlainObject(lauréat.autorisationDUrbanisme)
              : undefined
          }
        />
      </Section>
    );
  }, sectionTitle);
