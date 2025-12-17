import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '@/app/_helpers';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { Section } from '../../../(components)/Section';
import { DétailTypologieInstallation } from '../../../../installation/(historique)/events/DétailTypologieInstallation';

type TypologieInstallationSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const TypologieInstallationSection = ({
  identifiantProjet: identifiantProjetValue,
}: TypologieInstallationSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    const { typologieInstallation: champsSupplémentaireTypologieInstallation } =
      cahierDesCharges.getChampsSupplémentaires();

    if (!champsSupplémentaireTypologieInstallation) {
      return null;
    }

    const projection = await mediator.send<Lauréat.Installation.ConsulterInstallationQuery>({
      type: 'Lauréat.Installation.Query.ConsulterInstallation',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isNone(projection)) {
      return (
        <Section title="Typologie du projet">
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

    const { typologieInstallation } = projection;
    const value = mapToPlainObject(typologieInstallation);

    return (
      <Section title="Typologie du projet">
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
  });
