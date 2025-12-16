import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { ChampAvecAction, ChampObligatoireAvecAction } from '../../../../_helpers/types';
import { Section } from '../../../(components)/Section';
import { DétailTypologieInstallation } from '../../../../installation/(historique)/events/DétailTypologieInstallation';

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
  <div className="flex flex-col gap-4">
    {typologieInstallation && (
      <Section title="Typologie du projet">
        {typologieInstallation.value.length ? (
          <div>{DétailTypologieInstallation(typologieInstallation.value)}</div>
        ) : (
          <span>Champs non renseigné</span>
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
        <div className="m-0">{installateur.value || 'Champs non renseigné'}</div>
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
            {dispositifDeStockage.value.puissanceDuDispositifDeStockageEnKW ? (
              <div>
                Puissance du dispositif de stockage :{' '}
                {dispositifDeStockage.value.puissanceDuDispositifDeStockageEnKW} kW
              </div>
            ) : null}
            {dispositifDeStockage.value.capacitéDuDispositifDeStockageEnKWh ? (
              <div>
                Capacité du dispositif de stockage :{' '}
                {dispositifDeStockage.value.capacitéDuDispositifDeStockageEnKWh} kWh
              </div>
            ) : null}
          </>
        ) : (
          <div>Champs non renseigné</div>
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
