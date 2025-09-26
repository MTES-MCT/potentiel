import React, { FC, ReactNode } from 'react';

import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { Badge, BadgeType, Heading1, KeyIcon, Link, MapPinIcon, PageTemplate } from '../..';
import routes from '../../../../routes';
import type { Candidature } from '@potentiel-domain/projet';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../helpers/dataToValueTypes';
import { Lauréat } from '@potentiel-domain/projet';
import { match, P } from 'ts-pattern';

export type RésuméProjet = {
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  statut: Lauréat.StatutLauréat.RawType;
  nom: string;
  localité: Candidature.Localité.ValueType;
};

export const PageProjetTemplate: FC<{
  user: UtilisateurReadModel;
  résuméProjet: RésuméProjet;
  titre: ReactNode;
  children: ReactNode;
}> = ({ user, résuméProjet, titre, children }) => (
  <PageTemplate user={user} contentHeader={<EntêteProjet {...résuméProjet} />}>
    <Heading1 className="mb-6">{titre}</Heading1>
    {children}
  </PageTemplate>
);

const EntêteProjet: FC<RésuméProjet> = ({
  appelOffre,
  période,
  famille,
  numéroCRE,
  statut,
  nom,
  localité,
}) => (
  <div className="w-full py-3 lg:flex justify-between gap-2">
    <div className="mb-3">
      <div className="flex justify-start items-center">
        <Link
          href={routes.PROJECT_DETAILS(
            formatProjectDataToIdentifiantProjetValueType({
              appelOffreId: appelOffre,
              periodeId: période,
              familleId: famille,
              numeroCRE: numéroCRE,
            }).formatter(),
          )}
          className="no-underline text-3xl font-bold text-white"
          style={{ color: 'white', textDecoration: 'none' }}
        >
          <div className="text-3xl font-bold !text-white">{nom}</div>
        </Link>
        <StatutProjetBadge statut={statut} />
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

const getBadgeType = (statut: Lauréat.StatutLauréat.RawType): BadgeType =>
  match(statut)
    .with('abandonné', () => 'warning' as BadgeType)
    .with(P.union('actif', 'achevé'), () => 'success' as BadgeType)
    .exhaustive();

const StatutProjetBadge: FC<{
  statut: Lauréat.StatutLauréat.RawType;
}> = ({ statut }) => (
  <Badge type={getBadgeType(statut)} className="ml-2 self-center">
    {statut}
  </Badge>
);
