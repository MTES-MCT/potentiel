import Link from 'next/link';

import { Section } from '../(components)/Section';
import { DétailTypologieInstallation } from '../../installation/(historique)/events/DétailTypologieInstallation';
import { SectionPage } from '../(components)/SectionPage';

import { GetInstallationForProjectPage } from './_helpers/getInstallation';

type Props = { installation: GetInstallationForProjectPage };

export const InstallationSection = ({ installation }: Props) => (
  <SectionPage title="Installation">
    <Installation installation={installation} />
  </SectionPage>
);

const Installation = ({
  installation: { typologieInstallation, installateur, dispositifDeStockage },
}: Props) => {
  return (
    <>
      {typologieInstallation && (
        <Section title="Typologie du projet">
          <div className="flex flex-col gap-2">
            {typologieInstallation.value === 'Champs non renseigné' ? (
              <span>Champs non renseigné</span>
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
      <Section title="Autorisation d'urbanisme">
        <ul className="list-none m-0 pl-0">
          <li>Numéro : PC 084 088 24 A0029</li>
          <li>Date d'obtention : 22/09/2025</li>
        </ul>
      </Section>
      <Section title="Nature de l'exploitation">
        <span>Vente avec injection en totalité</span>
        <Link className="w-fit" href="">
          Modifier la nature de l'exploitation
        </Link>
      </Section>
    </>
  );
};
