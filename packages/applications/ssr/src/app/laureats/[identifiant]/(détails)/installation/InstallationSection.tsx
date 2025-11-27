'use client';

import Link from 'next/link';

import { Heading2 } from '@/components/atoms/headings';

import { Section } from '../(components)/Section';
import { ColumnPageTemplate } from '../../../../../components/templates/ColumnPage.template';
import { DétailTypologieInstallation } from '../../installation/(historique)/events/DétailTypologieInstallation';

import { GetInstallationForProjectPage } from './_helpers/getInstallation';

type Props = { installation: GetInstallationForProjectPage };

export const InstallationSection = ({ installation }: Props) => (
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

const InstallationLeft = ({ installation }: Props) => (
  <div className="flex flex-col gap-4">
    <Section title="Typologie du projet">
      <div className="flex flex-col gap-2">
        {installation.typologieInstallation.value === 'Champs non renseigné' ? (
          <span>Champs non renseigné</span>
        ) : (
          <div>{DétailTypologieInstallation(installation.typologieInstallation.value)}</div>
        )}
        {installation.typologieInstallation.affichage && (
          <Link
            className="w-fit"
            target="_blank"
            href={installation.typologieInstallation.affichage.url}
          >
            {installation.typologieInstallation.affichage.label}
          </Link>
        )}
      </div>
    </Section>
    {installation.installateur && (
      <Section title="Installateur">
        <div className="m-0">{installation.installateur?.value}</div>
        {installation.installateur.affichage && (
          <Link className="w-fit" target="_blank" href={installation.installateur.affichage.url}>
            {installation.installateur.affichage.label}
          </Link>
        )}
      </Section>
    )}
  </div>
);

const InstallationRight = ({ installation }: Props) => {
  if (!installation.dispositifDeStockage) return null;
  const { value, affichage } = installation.dispositifDeStockage;

  return (
    <Section title="Dispositif de stockage">
      {value === 'Champs non renseigné' ? (
        <div>{value}</div>
      ) : (
        <div>
          <div>
            {value.installationAvecDispositifDeStockage
              ? 'Installation couplée à un dispositif de stockage'
              : 'Installation sans dispositif de stockage'}
          </div>
          {value.puissanceDuDispositifDeStockageEnKW ? (
            <div>
              Puissance du dispositif de stockage : {value.puissanceDuDispositifDeStockageEnKW} kW
            </div>
          ) : null}
          {value.capacitéDuDispositifDeStockageEnKWh ? (
            <div>
              Capacité du dispositif de stockage : {value.capacitéDuDispositifDeStockageEnKWh} kWh
            </div>
          ) : null}
        </div>
      )}
      {affichage && (
        <Link className="w-fit" target="_blank" href={affichage.url}>
          {affichage.label}
        </Link>
      )}
    </Section>
  );
};
