import Link from 'next/link';

import { Section } from '../(components)/Section';
import { DétailTypologieInstallation } from '../../installation/(historique)/events/DétailTypologieInstallation';
import { SectionPage } from '../(components)/SectionPage';
import { getNatureDeLExploitationTypeLabel } from '../../../../_helpers/getNatureDeLExploitationTypeLabel';
import { FormattedDate } from '../../../../../components/atoms/FormattedDate';

import { GetInstallationForProjectPage } from './_helpers/getInstallation';

type Props = { installation: GetInstallationForProjectPage };

export const InstallationSection = ({ installation }: Props) => (
  <SectionPage title="Installation">
    <Installation installation={installation} />
  </SectionPage>
);

const Installation = ({
  installation: {
    typologieInstallation,
    installateur,
    dispositifDeStockage,
    natureDeLExploitation,
    autorisationDUrbanisme,
  },
}: Props) => {
  return (
    <>
      {typologieInstallation && (
        <Section title="Typologie du projet">
          <div className="flex flex-col gap-2">
            {typologieInstallation.value === 'Champs non renseigné' ? (
              <span>{typologieInstallation.value}</span>
            ) : (
              <div>{DétailTypologieInstallation(typologieInstallation.value)}</div>
            )}
            {typologieInstallation.affichage && (
              <Link className="w-fit" href={typologieInstallation.affichage.url}>
                {typologieInstallation.affichage.label}
              </Link>
            )}
          </div>
        </Section>
      )}
      {installateur && (
        <Section title="Installateur">
          <div className="m-0">{installateur?.value}</div>
          {installateur.affichage && (
            <Link className="w-fit" href={installateur.affichage.url}>
              {installateur.affichage.label}
            </Link>
          )}
        </Section>
      )}
      {dispositifDeStockage && (
        <Section title="Dispositif de stockage">
          {dispositifDeStockage.value === 'Champs non renseigné' ? (
            <div>{dispositifDeStockage.value}</div>
          ) : (
            <div>
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
            </div>
          )}
          {dispositifDeStockage.affichage && (
            <Link className="w-fit" href={dispositifDeStockage.affichage.url}>
              {dispositifDeStockage.affichage.label}
            </Link>
          )}
        </Section>
      )}
      {autorisationDUrbanisme && (
        <Section title="Autorisation d'urbanisme">
          {autorisationDUrbanisme.value === 'Champs non renseigné' ? (
            <div>{autorisationDUrbanisme.value}</div>
          ) : (
            <ul className="list-none m-0 pl-0">
              <li>Numéro : {autorisationDUrbanisme.value?.numéro}</li>
              {autorisationDUrbanisme.value?.date && (
                <li>
                  Date d'obtention : {<FormattedDate date={autorisationDUrbanisme.value?.date} />}
                </li>
              )}
            </ul>
          )}
        </Section>
      )}
      {natureDeLExploitation && (
        <Section title="Nature de l'exploitation">
          {natureDeLExploitation.value === 'Champs non renseigné' ? (
            <div>{natureDeLExploitation.value}</div>
          ) : (
            <div>
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
          )}
          {natureDeLExploitation.affichage && (
            <Link className="w-fit" href={natureDeLExploitation.affichage.url}>
              {natureDeLExploitation.affichage.label}
            </Link>
          )}
        </Section>
      )}
    </>
  );
};
