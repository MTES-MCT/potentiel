import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { DateTime, Email } from '@potentiel-domain/common';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading2, Heading5 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { StatutChangementFournisseurBadge } from '../StatutChangementFournisseurBadge';
import { ListeFournisseurs } from '../ListeFournisseurs';

import { DétailsFournisseurPageProps } from './DétailsFournisseur.page';

export type DétailsChangementFournisseurProps = {
  changement: DétailsFournisseurPageProps['changement'];
};

export const DétailsChangementFournisseur: FC<DétailsChangementFournisseurProps> = ({
  changement,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Heading2>Changement de Fournisseur</Heading2>
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
            <div className="font-semibold">Statut :</div> <StatutChangementFournisseurBadge />
          </div>
        </div>
        <>
          <Heading5>Détails du changement</Heading5>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="font-semibold whitespace-nowrap">Évaluation carbone simplifiée :</div>
              <div>{changement.évaluationCarboneSimplifiée} kg eq CO2/kWc</div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-semibold whitespace-nowrap">Fournisseurs :</div>
              <div className="flex flex-col gap-2">
                <ListeFournisseurs
                  fournisseurs={
                    changement.fournisseurs?.map(
                      ({ nomDuFabricant, typeFournisseur: { typeFournisseur } }) => ({
                        typeFournisseur,
                        nomDuFabricant,
                      }),
                    ) ?? []
                  }
                />
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
