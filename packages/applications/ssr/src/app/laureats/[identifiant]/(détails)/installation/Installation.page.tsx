import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { Section } from '../(components)/Section';
import { DétailTypologieInstallation } from '../../installation/(historique)/events/DétailTypologieInstallation';
import { getNatureDeLExploitationTypeLabel } from '../../../../_helpers/getNatureDeLExploitationTypeLabel';

import { GetInstallationForProjectPage } from './_helpers/getInstallation';
import { Heading2 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

type Props = { installation: GetInstallationForProjectPage };

export const InstallationPage = ({ installation }: Props) => (
  <ColumnPageTemplate
    heading={<Heading2>Installation</Heading2>}
    leftColumn={{
      children: <InstallationLeft installation={installation} />,
    }}
    rightColumn={{
      children: <InstallationRight installation={installation} />,
    }}
  />
);

const InstallationLeft = ({
  installation: { typologieInstallation, installateur, dispositifDeStockage },
}: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {typologieInstallation && (
        <Section title="Typologie du projet">
          {typologieInstallation.value ? (
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
          <div className="m-0">{installateur?.value}</div>
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
};

const InstallationRight = ({
  installation: { natureDeLExploitation, autorisationDUrbanisme },
}: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {autorisationDUrbanisme && (
        <Section title="Autorisation d'urbanisme">
          {autorisationDUrbanisme.value ? (
            <ul className="list-none m-0 pl-0">
              <li>Numéro : {autorisationDUrbanisme.value?.numéro}</li>
              {autorisationDUrbanisme.value?.date && (
                <li>
                  Date d'obtention : {<FormattedDate date={autorisationDUrbanisme.value?.date} />}
                </li>
              )}
            </ul>
          ) : (
            <div>Champs non renseigné</div>
          )}
        </Section>
      )}
      {natureDeLExploitation && (
        <Section title="Nature de l'exploitation">
          {natureDeLExploitation.value ? (
            <div className="flex flex-col">
              <span>
                {getNatureDeLExploitationTypeLabel(
                  natureDeLExploitation.value.typeNatureDeLExploitation,
                ) || 'Non renseigné'}
              </span>
              {natureDeLExploitation.value.tauxPrévisionnelACI !== undefined ? (
                <span>
                  Taux d'autoconsommation individuelle prévisionnel :{' '}
                  {natureDeLExploitation.value.tauxPrévisionnelACI} %
                </span>
              ) : null}
            </div>
          ) : (
            <div>{natureDeLExploitation.value}</div>
          )}
          {natureDeLExploitation.action && (
            <TertiaryLink href={natureDeLExploitation.action.url}>
              {natureDeLExploitation.action.label}
            </TertiaryLink>
          )}
        </Section>
      )}
    </div>
  );
};
