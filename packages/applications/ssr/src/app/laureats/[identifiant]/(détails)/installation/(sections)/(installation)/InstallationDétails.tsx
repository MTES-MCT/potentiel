import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { ChampAvecAction, ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';

import { Section } from '../../../(components)/Section';
import { DétailTypologieInstallation } from '../../../../installation/(historique)/events/DétailTypologieInstallation';
import { Champ } from '../../../(components)/Champ';

export type InstallationDétailsProps = {
  typologieInstallation?: ChampObligatoireAvecAction<
    PlainType<Lauréat.Installation.ConsulterInstallationReadModel['typologieInstallation']>
  >;
  dispositifDeStockage?: ChampAvecAction<
    PlainType<Lauréat.Installation.ConsulterInstallationReadModel['dispositifDeStockage']>
  >;
  installateur?: ChampObligatoireAvecAction<
    PlainType<Lauréat.Installation.ConsulterInstallationReadModel['installateur']>
  >;
};

export const InstallationDétails = ({
  typologieInstallation,
  dispositifDeStockage,
  installateur,
}: InstallationDétailsProps) => (
  <div className="flex flex-col gap-4 w-full">
    {typologieInstallation && (
      <Section title="Typologie du projet">
        {typologieInstallation.value.length ? (
          <div>
            <DétailTypologieInstallation typologieInstallation={typologieInstallation.value} />
          </div>
        ) : (
          <span>Champ non renseigné</span>
        )}
        {typologieInstallation.action && (
          <TertiaryLink href={typologieInstallation.action.url}>
            {typologieInstallation.action.label}
          </TertiaryLink>
        )}
      </Section>
    )}
    {installateur && (
      <Section title="Installateur">
        <div className="m-0">{installateur.value || 'Champ non renseigné'}</div>
        {installateur.action && (
          <TertiaryLink href={installateur.action.url}>{installateur.action.label}</TertiaryLink>
        )}
      </Section>
    )}
    {dispositifDeStockage && (
      <Section title="Dispositif de stockage">
        {dispositifDeStockage.value ? (
          <>
            <div>
              {dispositifDeStockage.value.installationAvecDispositifDeStockage
                ? 'Installation couplée à un dispositif de stockage'
                : 'Installation sans dispositif de stockage'}
            </div>
            {dispositifDeStockage.value.puissanceDuDispositifDeStockageEnKW !== undefined && (
              <Champ
                label="Puissance du dispositif de stockage"
                number={dispositifDeStockage.value.puissanceDuDispositifDeStockageEnKW}
                unité="kW"
              />
            )}
            {dispositifDeStockage.value.capacitéDuDispositifDeStockageEnKWh !== undefined && (
              <Champ
                label="Capacité du dispositif de stockage"
                number={dispositifDeStockage.value.capacitéDuDispositifDeStockageEnKWh}
                unité="kWh"
              />
            )}
          </>
        ) : (
          <div>Champ non renseigné</div>
        )}
        {dispositifDeStockage.action && (
          <TertiaryLink href={dispositifDeStockage.action.url}>
            {dispositifDeStockage.action.label}
          </TertiaryLink>
        )}
      </Section>
    )}
  </div>
);
