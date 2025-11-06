import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { Icon } from '@/components/atoms/Icon';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { FormatFichierInvalide } from '../../components/FormatFichierInvalide';
import { Etape } from '../../components/Étape';

export type ÉtapeDemandeComplèteRaccordementProps = {
  identifiantProjet: string;
  référence: string;
  demandeComplèteRaccordement: PlainType<
    Lauréat.Raccordement.ConsulterDossierRaccordementReadModel['demandeComplèteRaccordement']
  >;
  actions: { modifierRéférence: boolean; modifier: boolean; transmettre: boolean };
};

export const ÉtapeDemandeComplèteRaccordement: FC<ÉtapeDemandeComplèteRaccordementProps> = ({
  identifiantProjet,
  référence,
  demandeComplèteRaccordement,
  actions,
}) => {
  const accuséRéception = demandeComplèteRaccordement.accuséRéception
    ? DocumentProjet.bind(demandeComplèteRaccordement.accuséRéception).formatter()
    : undefined;
  const dateQualification = demandeComplèteRaccordement.dateQualification
    ? DateTime.bind(demandeComplèteRaccordement.dateQualification).formatter()
    : undefined;
  return (
    <Etape
      className="relative"
      statut={dateQualification ? 'étape validée' : 'étape incomplète'}
      titre="Demande complète de raccordement"
    >
      <div className="flex flex-col text-sm gap-2">
        <div className="flex items-center">
          <Icon id="fr-icon-information-line" size="sm" className="mr-1" />
          <span className="font-bold mr-2">{référence}</span>{' '}
          {actions.modifierRéférence && (
            <Link
              href={Routes.Raccordement.corrigerRéférenceDossier(identifiantProjet, référence)}
              aria-label={`Corriger la référence ${référence} de la demande de raccordement`}
            >
              <Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
              Corriger
            </Link>
          )}
        </div>

        <div className="flex items-center">
          <Icon
            id="fr-icon-calendar-line"
            size="xs"
            className="mr-1"
            title="date de l'accusé de réception"
          />
          {dateQualification ? (
            <FormattedDate date={dateQualification} />
          ) : actions.transmettre ? (
            <Link
              href={Routes.Raccordement.modifierDemandeComplèteRaccordement(
                identifiantProjet,
                référence,
              )}
            >
              Date de l'accusé de réception à renseigner
            </Link>
          ) : (
            <p className="font-bold">Date de l'accusé de réception manquante</p>
          )}
        </div>

        {accuséRéception && (
          <div>
            {accuséRéception.endsWith('.bin') && <FormatFichierInvalide />}
            <DownloadDocument
              className="flex items-center"
              url={Routes.Document.télécharger(accuséRéception)}
              label="Télécharger l'accusé de réception"
              format="pdf"
            />
          </div>
        )}

        {actions.modifier && (
          <Link
            href={Routes.Raccordement.modifierDemandeComplèteRaccordement(
              identifiantProjet,
              référence,
            )}
            className="absolute top-2 right-2"
            aria-label={`Modifier la demande de raccordement ${référence}`}
          >
            <Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
            Modifier
          </Link>
        )}
      </div>
    </Etape>
  );
};
