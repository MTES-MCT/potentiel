import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getAction, getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { CandidatDétails } from './CandidatDétails';

type CandidatSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Candidat';
export const CandidatSection = ({ identifiantProjet }: CandidatSectionProps) =>
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
          <CandidatDétails
            localité={localité}
            emailContact={lauréat.emailContact.email}
            coordonnées={lauréat.coordonnées}
          />
        </Section>
      );
    }),
    sectionTitle,
  );
