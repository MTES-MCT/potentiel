import React from 'react';
import { ExternalLink } from '@components';
import { CahierDesChargesModifié } from '@entities/cahierDesCharges';

type CahierDesChargesModifiéDisponibleProps = CahierDesChargesModifié;

export const CahierDesChargesModifiéDisponible: React.FC<
  CahierDesChargesModifiéDisponibleProps
> = ({ paruLe, alternatif, url }) => (
  <div className="flex-column">
    <div>
      <span className="font-bold">
        Instruction selon le cahier des charges{alternatif ? ' alternatif' : ''} modifié{' '}
        rétroactivement et publié le {paruLe}{' '}
      </span>
      {'('}
      <ExternalLink href={url}>voir le cahier des charges</ExternalLink>
      {')'}.
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
