import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '@/app/_helpers';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import {
  getInstallationInfos,
  SectionWithErrorHandling,
} from '@/app/laureats/[identifiant]/_helpers';

import { Section } from '../../../(components)/Section';
import { DétailTypologieInstallation } from '../../../../installation/(historique)/events/DétailTypologieInstallation';

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

      const action = rôle.aLaPermission('installation.typologieInstallation.modifier')
        ? {
            url: Routes.Installation.modifierTypologie(identifiantProjet.formatter()),
            label: 'Modifier la typologie du projet',
          }
        : undefined;

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
