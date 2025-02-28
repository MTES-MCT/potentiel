import { FC } from 'react';
import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';

import { ConsulterUtilisateurReadModel } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { ListItem } from '@/components/molecules/ListItem';
import { RoleBadge } from '@/components/molecules/utilisateur/RoleBadge';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export type UtilisateurListItemProps = {
  utilisateur: PlainType<ConsulterUtilisateurReadModel>;
  gestionnaireRéseau: PlainType<
    Option.Type<GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel>
  >;
};

export const UtilisateurListItem: FC<UtilisateurListItemProps> = ({
  utilisateur: {
    identifiantUtilisateur,
    rôle,
    région,
    fonction,
    nomComplet,
    nombreDeProjets,
    invitéLe,
    invitéPar,
  },
  gestionnaireRéseau,
}) => (
  <ListItem
    actions={
      <Button
        size="small"
        iconId="fr-icon-mail-line"
        priority="secondary"
        linkProps={{ href: `mailto:${identifiantUtilisateur.email}` }}
      >
        Contacter
      </Button>
    }
    heading={
      <div className="flex flex-row justify-between gap-2 w-full">
        <h2 className="leading-4">
          <span className="font-bold">{identifiantUtilisateur.email}</span>
        </h2>
        <p className="italic text-xs">
          Invité le <FormattedDate date={DateTime.bind(invitéLe).formatter()} /> par{' '}
          {invitéPar.email}
        </p>
      </div>
    }
  >
    <RoleBadge role={rôle.nom} />
    <ul className="mt-3 text-sm">
      <OptionalElement label="Région" value={région} render={renderText} />
      <OptionalElement label="Fonction" value={fonction} render={renderText} />
      <OptionalElement label="Nom Complet" value={nomComplet} render={renderText} />
      <OptionalElement label="Nombre de projets" value={nombreDeProjets} render={renderText} />
      <OptionalElement
        label="Gestionnaire Réseau"
        value={gestionnaireRéseau}
        render={({ identifiantGestionnaireRéseau, raisonSociale }) => (
          <Link
            className="font-semibold capitalize"
            href={Routes.Gestionnaire.détail(identifiantGestionnaireRéseau.codeEIC)}
          >
            {raisonSociale}
          </Link>
        )}
      />
    </ul>
  </ListItem>
);

const renderText = (value: string | number) => (
  <span className="font-semibold capitalize">{value}</span>
);

const OptionalElement = <TType,>({
  label,
  value,
  render,
}: {
  label: string;
  value: Option.Type<TType>;
  render: (value: TType) => React.ReactNode;
}) =>
  Option.match(value)
    .some((value) => (
      <li>
        <span>
          {label} : {render(value)}
        </span>
      </li>
    ))
    .none(() => <></>);
