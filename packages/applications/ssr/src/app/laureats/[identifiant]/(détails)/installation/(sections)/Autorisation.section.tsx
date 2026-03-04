import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '@/app/_helpers';
import { getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { Section } from '@/components/atoms/menu/Section';

import { AutorisationDétails } from './AutorisationDétails';

type AutorisationSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Autorisation';

export const AutorisationSection = ({
  identifiantProjet: identifiantProjetValue,
}: AutorisationSectionProps) =>
  SectionWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    if (!cahierDesCharges.getChampsSupplémentaires().autorisation) {
      return null;
    }

    const lauréat = await getLauréatInfos(identifiantProjet.formatter());

    return (
      <Section title={sectionTitle}>
        <AutorisationDétails
          value={lauréat.autorisation ? mapToPlainObject(lauréat.autorisation) : undefined}
        />
      </Section>
    );
  }, sectionTitle);
