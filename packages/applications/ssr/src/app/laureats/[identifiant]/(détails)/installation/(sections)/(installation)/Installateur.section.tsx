import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getAction } from '@/app/laureats/[identifiant]/_helpers';
import { getCahierDesCharges } from '@/app/_helpers';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { Section } from '../../../(components)/Section';

type InstallateurSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const InstallateurSection = ({
  identifiantProjet: identifiantProjetValue,
}: InstallateurSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    const { installateur: champSupplémentaireInstallateur } =
      cahierDesCharges.getChampsSupplémentaires();

    if (!champSupplémentaireInstallateur) {
      return null;
    }

    const projection = await mediator.send<Lauréat.Installation.ConsulterInstallationQuery>({
      type: 'Lauréat.Installation.Query.ConsulterInstallation',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isNone(projection)) {
      return (
        <Section title="Installateur">
          <span>Champ non renseigné</span>
        </Section>
      );
    }

    const action = await getAction({
      identifiantProjet,
      rôle,
      domain: 'installateur',
    });

    const { installateur } = projection;
    const value = mapToPlainObject(installateur);

    return (
      <Section title="Installateur">
        <div className="m-0">{value || 'Champ non renseigné'}</div>
        {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
      </Section>
    );
  });
