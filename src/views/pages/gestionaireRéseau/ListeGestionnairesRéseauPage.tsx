import { Heading1, PageTemplate, Tile } from '@views/components';
import { hydrateOnClient } from '@views/helpers';
import { Request } from 'express';
import React, { FC } from 'react';

type ListeGestionnairesRéseauProps = {
  request: Request;
  gestionnairesRéseau: Array<GestionnaireRéseauProps>;
};

export const ListeGestionnairesRéseau = ({
  request: { user },
  gestionnairesRéseau,
}: ListeGestionnairesRéseauProps) => (
  <PageTemplate user={user} currentPage={'liste-gestionnaires-réseau'}>
    <div className="panel">
      <div className="panel__header">
        <Heading1>Liste des gestionnaires de réseau</Heading1>
      </div>

      {gestionnairesRéseau.length === 0 ? (
        <AucunGestionnaireRéseau />
      ) : (
        <Liste {...{ gestionnairesRéseau }} />
      )}
    </div>
  </PageTemplate>
);

const AucunGestionnaireRéseau = () => (
  <div className="flex p-16 border border-dashed border-grey-625-base">
    <span className="mx-auto text-center">Aucun gestionnaire de réseau</span>
  </div>
);

type ListeProps = {
  gestionnairesRéseau: Array<GestionnaireRéseauProps>;
};
const Liste: FC<ListeProps> = ({ gestionnairesRéseau }) => (
  <ul className="m-0 p-0 list-none">
    {gestionnairesRéseau.map((gestionnaireRéseau) => (
      <li key={`gestionnaire-réseau-${gestionnaireRéseau.id}`} className="m-0 mb-3 p-0">
        <Tile>
          <GestionnaireRéseau {...gestionnaireRéseau} />
        </Tile>
      </li>
    ))}
  </ul>
);

type GestionnaireRéseauProps = {
  id: string;
  nom: string;
};
const GestionnaireRéseau: FC<GestionnaireRéseauProps> = ({ nom }) => (
  <>
    <div className="font-bold">{nom}</div>
  </>
);

hydrateOnClient(ListeGestionnairesRéseau);
