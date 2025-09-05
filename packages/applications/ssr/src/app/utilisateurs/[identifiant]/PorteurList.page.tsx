import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { ConsulterUtilisateurReadModel } from '@potentiel-domain/utilisateur';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ActionsList } from '@/components/templates/ActionsList.template';

import { InviterPorteurForm } from './(inviter)/InviterPorteur.form';
import { PorteurListItem } from './PorteurListItem';

export type PorteurListPageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  items: PlainType<ConsulterUtilisateurReadModel & { peutRetirerAccès: boolean }>[];
  nombreDeProjets?: number;
};

export const PorteurListPage: FC<PorteurListPageProps> = ({
  identifiantProjet,
  items,
  nombreDeProjets,
}) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      leftColumn={{
        children: (
          <div className="flex flex-col">
            <Heading2>Comptes ayant accès au projet</Heading2>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-16">
                <p className="text-lg font-semibold">Aucun porteur n'a accès à ce projet</p>
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-4 mt-4">
                  {items.map(({ email, peutRetirerAccès }) => (
                    <PorteurListItem
                      key={email}
                      identifiantProjet={identifiantProjet}
                      identifiantUtilisateur={email}
                      peutRetirerAccès={peutRetirerAccès}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
      }}
      rightColumn={{
        children: (
          <PorteurListActions
            identifiantProjet={identifiantProjet}
            items={items}
            nombreDeProjets={nombreDeProjets}
          />
        ),
      }}
    />
  );
};

const PorteurListActions: FC<{
  identifiantProjet: IdentifiantProjet.RawType;
  items: PlainType<ConsulterUtilisateurReadModel>[];
  nombreDeProjets?: number;
}> = ({ identifiantProjet, items, nombreDeProjets }) => (
  <ActionsList actionsListLength={2} className="pl-10">
    <InviterPorteurForm identifiantProjet={identifiantProjet} nombreDeProjets={nombreDeProjets} />
    <Button
      iconId="fr-icon-mail-line"
      priority="secondary"
      linkProps={{ href: `mailto:${items.map((item) => item.email).join(',')}` }}
    >
      Contacter tous les utilisateurs
    </Button>
  </ActionsList>
);
