import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getLauréatInfos } from '@/app/_helpers';
import { getAction } from '@/app/laureats/[identifiant]/_helpers';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { SiteDeProductionDétails } from './SiteDeProductionDétail';

type SiteDeProductionSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Site de production';
export const SiteDeProductionSection = ({ identifiantProjet }: SiteDeProductionSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const lauréat = await getLauréatInfos(identifiantProjet);

      const action = await getAction({
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        domain: 'siteDeProduction',
        rôle,
      });

      const localité = {
        value: mapToPlainObject(lauréat.localité),
        action,
      };

      return (
        <Section title={sectionTitle}>
          <SiteDeProductionDétails localité={localité} coordonnées={lauréat.coordonnées} />
        </Section>
      );
    }),
    sectionTitle,
  );
