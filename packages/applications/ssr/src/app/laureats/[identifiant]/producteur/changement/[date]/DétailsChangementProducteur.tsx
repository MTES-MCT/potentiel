import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading2, Heading5 } from '@/components/atoms/headings';
import { StatutChangementProducteurBadge } from '../StatutChangementProducteurBadge';
import type { DétailsProducteurPageProps } from './DétailsProducteur.page';

export type DétailsChangementProducteurProps = {
  changement: DétailsProducteurPageProps['changement'];
};

export const DétailsChangementProducteur: FC<DétailsChangementProducteurProps> = ({
  changement,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Heading2>Changement de producteur</Heading2>
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xs italic">
            Modifié le{' '}
            <FormattedDate
              className="font-semibold"
              date={DateTime.bind(changement.enregistréLe).formatter()}
            />{' '}
            par{' '}
            <span className="font-semibold">
              {Email.bind(changement.enregistréPar).formatter()}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="font-semibold">Statut :</div> <StatutChangementProducteurBadge />
          </div>
        </div>
        <>
          <Heading5>Détails du changement</Heading5>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="font-semibold whitespace-nowrap">Producteur</div>
              <div className="flex flex-col gap-2">
                <div>Nouveau producteur : {changement.nouveauProducteur}</div>
                <div>Producteur initial : {changement.ancienProducteur}</div>
              </div>
            </div>
            {changement.raison && (
              <div className="flex gap-2">
                <div className="font-semibold whitespace-nowrap">Raison du changement :</div>
                <div>{changement.raison}</div>
              </div>
            )}
            <div className="flex gap-2">
              <div className="font-semibold whitespace-nowrap">Pièce(s) justificative(s) :</div>
              <DownloadDocument
                className="mb-0"
                label="Télécharger la pièce justificative"
                format={changement.pièceJustificative.format}
                url={Routes.Document.télécharger(
                  DocumentProjet.bind(changement.pièceJustificative).formatter(),
                )}
              />
            </div>
          </div>
        </>
      </>
    </div>
  );
};
