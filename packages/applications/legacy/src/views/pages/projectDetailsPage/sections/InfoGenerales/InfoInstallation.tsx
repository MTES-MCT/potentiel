import React from 'react';
import { Heading3, Heading4, Link } from '../../../../components';

import { GetInstallationForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getInstallation';
import { match } from 'ts-pattern';

export type InfoInstallationProps = {
  installation: GetInstallationForProjectPage;
};

export const InfoInstallation = ({
  installation: { installateur, typologieInstallation },
}: InfoInstallationProps) => {
  const getTypologieLabels = (
    typologie: GetInstallationForProjectPage['typologieInstallation']['value'][number]['typologie'],
  ) => {
    return match(typologie)
      .with('agrivoltaïque.culture', () => 'Installation agrivoltaïque (culture)')
      .with(
        'agrivoltaïque.jachère-plus-de-5-ans',
        () => 'Installation agrivoltaïque (jachère de plus de 5 ans)',
      )
      .with('agrivoltaïque.serre', () => 'Installation agrivoltaïque (serre)')
      .with('agrivoltaïque.élevage', () => 'Installation agrivoltaïque (élevage)')
      .with(
        'bâtiment.existant-avec-rénovation-de-toiture',
        () => 'Bâtiment existant avec rénovation de toiture',
      )
      .with(
        'bâtiment.existant-sans-rénovation-de-toiture',
        () => 'Bâtiment existant sans rénovation de toiture',
      )
      .with('bâtiment.mixte', () => 'Bâtiment (mixte)')
      .with('bâtiment.neuf', () => 'Bâtiment neuf')
      .with('bâtiment.serre', () => 'Bâtiment (serre)')
      .with('bâtiment.stabulation', () => 'Bâtiment (stabulation)')
      .with('ombrière.parking', () => 'Ombrière (parking)')
      .with('ombrière.mixte', () => 'Ombrière (mixte)')
      .with('ombrière.autre', () => 'Ombrière')
      .exhaustive();
  };

  const formatTypologieInstallation = ({
    typologie,
    détails,
  }: InfoInstallationProps['installation']['typologieInstallation']['value'][number]) => (
    <>
      <div>{getTypologieLabels(typologie)}</div>
      {détails && <div>Éléments sous l'installation : {détails}</div>}
    </>
  );
  return (
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0 ">Installation</Heading3>
      <div>
        <Heading4 className="m-0" style={{ fontSize: '16px' }}>
          Typologie du projet
        </Heading4>
        {typologieInstallation.value.length > 1 ? (
          <>
            <div className="m-0">Installation mixte :</div>
            <ul className="list-disc pl-4 m-0">
              {typologieInstallation.value.map((typologieInstallation) => (
                <li key={typologieInstallation.typologie}>
                  {formatTypologieInstallation(typologieInstallation)}
                </li>
              ))}
            </ul>
          </>
        ) : typologieInstallation.value.length === 1 ? (
          <div>{formatTypologieInstallation(typologieInstallation.value[0])}</div>
        ) : (
          <span>Typologie du projet non renseignée</span>
        )}
      </div>
      {typologieInstallation.affichage && (
        <Link
          href={typologieInstallation.affichage.url}
          aria-label={typologieInstallation.affichage.label}
        >
          {typologieInstallation.affichage.label}
        </Link>
      )}
      <div>
        <Heading4 className="mb-0" style={{ fontSize: '16px' }}>
          Installateur
        </Heading4>
        <div className="m-0">{installateur.value || 'Non renseigné'}</div>
        {installateur.affichage && (
          <Link href={installateur.affichage.url} aria-label={installateur.affichage.label}>
            {installateur.affichage.label}
          </Link>
        )}
      </div>
    </div>
  );
};
