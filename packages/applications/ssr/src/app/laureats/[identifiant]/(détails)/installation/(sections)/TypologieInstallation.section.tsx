import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '@/app/_helpers';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { getAction, getInstallationInfos } from '@/app/laureats/[identifiant]/_helpers';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { Section } from '@/components/atoms/menu/Section';

import { DétailTypologieInstallation } from '../../../installation/(historique)/events/DétailTypologieInstallation';

type TypologieInstallationSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Typologie du projet';

export const TypologieInstallationSection = ({
  identifiantProjet: identifiantProjetValue,
}: TypologieInstallationSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

      const { typologieInstallation: champsSupplémentaireTypologieInstallation } =
        cahierDesCharges.getChampsSupplémentaires();

      if (!champsSupplémentaireTypologieInstallation) {
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
        domain: 'typologieInstallation',
      });

      const { typologieInstallation } = installation;
      const value = mapToPlainObject(typologieInstallation);

      return (
        <Section title={sectionTitle}>
          {value.length ? (
            <div>
              <DétailTypologieInstallation typologieInstallation={value} />
            </div>
          ) : (
            <span>Champ non renseigné</span>
          )}
          {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
        </Section>
      );
    }),
    sectionTitle,
  );
