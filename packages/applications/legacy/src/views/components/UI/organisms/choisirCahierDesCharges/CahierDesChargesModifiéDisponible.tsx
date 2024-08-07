import React from 'react';
import { AppelOffre } from '@potentiel-domain/appel-offre';

type CahierDesChargesModifiéDisponibleProps = AppelOffre.CahierDesChargesModifié;

export const CahierDesChargesModifiéDisponible: React.FC<
  CahierDesChargesModifiéDisponibleProps
> = ({ paruLe, alternatif }) => (
  <div className="flex-column">
    <div className="font-bold">
      Instruction selon le cahier des charges{alternatif ? ' alternatif' : ''} modifié{' '}
      rétroactivement et publié le {paruLe}{' '}
    </div>

    <ul className="mt-2 list-none p-1 md:list-disc md:pl-10">
      <li>Ce choix s'appliquera à toutes les futures demandes faites sous Potentiel.</li>
      {paruLe === '30/07/2021' && (
        <li>
          Une modification ultérieure pourra toujours être instruite selon le cahier des charges en
          vigueur au moment du dépôt de l'offre, à condition qu'elle soit soumise au format papier
          en précisant ce choix.
        </li>
      )}
    </ul>
  </div>
);
