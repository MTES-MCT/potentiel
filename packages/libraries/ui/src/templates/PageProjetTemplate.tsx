import React, { FC, ReactNode } from 'react';
import { CandidatureLegacyReadModel, UtilisateurLegacyReadModel } from '@potentiel/domain-views';
import routes from '@potentiel/routes';

import { Badge, BadgeType, Heading1, KeyIcon, Link, MapPinIcon } from '../atoms';
import { PageTemplate } from './PageTemplate';

export const PageProjetTemplate: FC<{
  user: Omit<UtilisateurLegacyReadModel, 'type'>;
  résuméProjet: CandidatureLegacyReadModel;
  titre: ReactNode;
}> = ({ user, résuméProjet, titre, children }) => (
  <PageTemplate user={user} contentHeader={<EntêteProjet {...résuméProjet} />}>
    <Heading1 className="mb-6">{titre}</Heading1>
    {children}
  </PageTemplate>
);

const EntêteProjet: FC<CandidatureLegacyReadModel> = ({
  appelOffre,
  période,
  famille,
  numéroCRE,
  statut,
  nom,
  localité,
  identifiantProjet,
}) => (
  <div className="w-full py-3 lg:flex justify-between gap-2">
    <div className="mb-3">
      <div className="flex justify-start items-center">
        <Link
          href={routes.PROJECT_DETAILS(identifiantProjet)}
          className="no-underline text-3xl font-bold text-white"
          style={{ color: 'white', textDecoration: 'none' }}
        >
          <div className="text-3xl font-bold !text-white">{nom}</div>
        </Link>
        <StatutProjet statut={statut} />
      </div>
      <div className="text-xs italic">
        <KeyIcon className="mr-1" />
        {appelOffre}-{période}
        {famille && `-${famille}`}-{numéroCRE}
      </div>
      <p className="text-sm font-medium p-0 m-0 mt-2">
        <MapPinIcon className="mr-1" />
        {localité.commune}, {localité.département}, {localité.région}
      </p>
    </div>
  </div>
);

const getBadgeType = (statut: CandidatureLegacyReadModel['statut']): BadgeType => {
  switch (statut) {
    case 'abandonné':
      return 'warning';
    case 'classé':
      return 'success';
    case 'éliminé':
      return 'error';
    case 'non-notifié':
      return 'info';
  }
};

const StatutProjet: FC<{
  statut: CandidatureLegacyReadModel['statut'];
}> = ({ statut }) => (
  <Badge type={getBadgeType(statut)} className="ml-2 self-center">
    {statut}
  </Badge>
);
