import { FC } from 'react';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading2 } from '@/components/atoms/headings';

import { StatutDemandeDélaiBadge } from '../StatutDemandeDélaiBadge';

export type DétailsDemandeDélaiPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  demande: PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>;
};

export const DétailsDemandeDélaiPage: FC<DétailsDemandeDélaiPageProps> = ({
  identifiantProjet,
  demande: {
    demandéLe,
    demandéPar,
    nombreDeMois,
    raison,
    statut: { statut },
    pièceJustificative,
  },
}) => (
  <ColumnPageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
    leftColumn={{
      children: (
        <>
          <Heading2>Demande de délai</Heading2>
          <div className="flex flex-col gap-4">
            <div className="text-xs italic">
              Demandé le{' '}
              <FormattedDate
                className="font-semibold"
                date={DateTime.bind(demandéLe).formatter()}
              />{' '}
              par <span className="font-semibold">{Email.bind(demandéPar).formatter()}</span>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold">Statut :</div>{' '}
              <StatutDemandeDélaiBadge statut={statut} />
            </div>
            <div className="flex gap-2">
              <div className="font-semibold whitespace-nowrap">Nombre de mois :</div>
              <div>{nombreDeMois}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold whitespace-nowrap">Raison du changement :</div>
              <div>{raison}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold whitespace-nowrap">Pièce justificative :</div>
              <DownloadDocument
                className="mb-0"
                label="Télécharger la pièce justificative"
                format={pièceJustificative.format}
                url={Routes.Document.télécharger(
                  DocumentProjet.bind(pièceJustificative).formatter(),
                )}
              />
            </div>
          </div>
        </>
      ),
    }}
    rightColumn={{
      className: 'flex flex-col gap-8',
      children: <></>,
    }}
  />
);
