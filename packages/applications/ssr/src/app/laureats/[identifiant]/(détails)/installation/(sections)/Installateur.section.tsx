import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  getAction,
  getInstallationInfos,
  SectionWithErrorHandling,
} from '@/app/laureats/[identifiant]/_helpers';
import { getCahierDesCharges } from '@/app/_helpers';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { Section } from '../../(components)/Section';

type InstallateurSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Installateur';

export const InstallateurSection = ({
  identifiantProjet: identifiantProjetValue,
}: InstallateurSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

      const { installateur: champSupplémentaireInstallateur } =
        cahierDesCharges.getChampsSupplémentaires();

      if (!champSupplémentaireInstallateur) {
        return null;
      }

      const installation = await getInstallationInfos(identifiantProjet.formatter());

      if (!installation) {
        return (
          <Section title={sectionTitle}>
            <span>Champ non renseigné</span>
          </Section>
        );
      }

      const action = await getAction({
        identifiantProjet,
        rôle,
        domain: 'installateur',
      });

      const { installateur } = installation;
      const value = mapToPlainObject(installateur);

      return (
        <Section title={sectionTitle}>
          <div className="m-0">{value || 'Champ non renseigné'}</div>
          {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
        </Section>
      );
    }),
    sectionTitle,
  );
