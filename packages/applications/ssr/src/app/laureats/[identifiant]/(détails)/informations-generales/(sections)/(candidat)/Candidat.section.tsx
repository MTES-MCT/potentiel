import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  getAction,
  getLauréatInfos,
  SectionWithErrorHandling,
} from '@/app/laureats/[identifiant]/_helpers';

import { Section } from '../../../(components)/Section';

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
          <CandidatDétails localité={localité} emailContact={lauréat.emailContact.email} />
        </Section>
      );
    }),
    sectionTitle,
  );
