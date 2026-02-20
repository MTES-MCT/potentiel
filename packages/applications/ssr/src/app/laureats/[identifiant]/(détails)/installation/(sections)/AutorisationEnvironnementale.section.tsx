import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '@/app/_helpers';
import { getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { Section } from '@/components/atoms/menu/Section';

import { AutorisationEnvironnementaleDétails } from './AutorisationEnvironnementaleDetails';

type AutorisationEnvironnementaleSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Autorisation environnementale';

export const AutorisationEnvironnementaleSection = ({
  identifiantProjet: identifiantProjetValue,
}: AutorisationEnvironnementaleSectionProps) =>
  SectionWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    if (!cahierDesCharges.getChampsSupplémentaires().autorisationEnvironnementale) {
      return null;
    }

    const lauréat = await getLauréatInfos(identifiantProjet.formatter());

    return (
      <Section title={sectionTitle}>
        <AutorisationEnvironnementaleDétails
          value={
            lauréat.autorisationEnvironnementale
              ? mapToPlainObject(lauréat.autorisationEnvironnementale)
              : undefined
          }
        />
      </Section>
    );
  }, sectionTitle);
