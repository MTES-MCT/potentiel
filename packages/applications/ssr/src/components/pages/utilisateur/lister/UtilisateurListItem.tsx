'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import Badge from '@codegouvfr/react-dsfr/Badge';

import { ConsulterUtilisateurReadModel } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { ListItem } from '@/components/molecules/ListItem';
import { RoleBadge } from '@/components/molecules/utilisateur/RoleBadge';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { roleToLabel } from '@/utils/utilisateur/format-role';

import { désactiverUtilisateurAction } from '../désactiver/désactiverUtilisateur.action';

export type UtilisateurActions = {
  actions: 'désactiver'[];
};

export type UtilisateurListItemProps = {
  utilisateur: PlainType<ConsulterUtilisateurReadModel & UtilisateurActions>;
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
    désactivé,
    actions,
  },
  gestionnaireRéseau,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ListItem
        actions={
          <ButtonsGroup
            buttonsSize="small"
            buttonsEquisized
            inlineLayoutWhen="always"
            buttons={[
              {
                children: 'Contacter',
                iconId: 'fr-icon-mail-line',
                priority: 'secondary',
                linkProps: { href: `mailto:${identifiantUtilisateur.email}` },
                style: { marginBottom: 0, marginTop: '1rem' },
              },
              {
                children: 'Désactiver',
                iconId: 'fr-icon-delete-bin-line',
                priority: 'primary',
                onClick: () => setIsOpen(true),
                style: { marginBottom: 0, marginTop: '1rem' },
                disabled: !actions.includes('désactiver'),
              },
            ]}
          />
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
        <div className="flex flex-row gap-2">
          <RoleBadge role={rôle.nom} />
          {désactivé && (
            <Badge small noIcon severity="error">
              Inactif
            </Badge>
          )}
        </div>
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
      <ModalWithForm
        id={`delete-user-${identifiantUtilisateur.email}`}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        title="Désactiver un utilisateur"
        form={{
          id: 'delete-user-form',
          action: désactiverUtilisateurAction,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir désactiver l'utilisateur{' '}
                <b className="text-nowrap">{identifiantUtilisateur.email}</b>, ayant pour rôle{' '}
                <b>{roleToLabel[rôle.nom]}</b> ?
              </p>
              <input
                type={'hidden'}
                value={identifiantUtilisateur.email}
                name={'identifiantUtilisateurDesactive'}
              />
            </>
          ),
        }}
      />
    </>
  );
};

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
