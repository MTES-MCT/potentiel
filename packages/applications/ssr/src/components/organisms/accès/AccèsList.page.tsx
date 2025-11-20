import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading2 } from '@/components/atoms/headings';
import { ActionsList } from '@/components/templates/ActionsList.template';

import { PorteurListItem, PorteurListItemProps } from './AccèsListItem';
import { InviterPorteurForm } from './(inviter)/InviterPorteur.form';

export type AccèsListPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.RawType>;
  accès: PorteurListItemProps[];
  nombreDeProjets?: number;
};

export const AccèsListPage: FC<AccèsListPageProps> = ({
  accès,
  identifiantProjet,
  nombreDeProjets,
}) => {
  return (
    <ColumnPageTemplate
      leftColumn={{
        children: (
          <div className="flex flex-col">
            <Heading2>Comptes ayant accès au projet</Heading2>
            {accès.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-16">
                <p className="text-lg font-semibold">Aucun porteur n'a accès à ce projet</p>
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-4 mt-4">
                  {accès.map(({ identifiantProjet, identifiantUtilisateur, peutRetirerAccès }) => (
                    <PorteurListItem
                      key={identifiantUtilisateur}
                      identifiantProjet={identifiantProjet}
                      identifiantUtilisateur={identifiantUtilisateur}
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
          <ActionsList actionsListLength={2} className="pl-10">
            <InviterPorteurForm
              identifiantProjet={identifiantProjet}
              nombreDeProjets={nombreDeProjets}
            />
            <Button
              iconId="fr-icon-mail-line"
              priority="secondary"
              linkProps={{
                href: `mailto:${accès.map((item) => item.identifiantUtilisateur).join(',')}`,
              }}
            >
              Contacter tous les utilisateurs
            </Button>
          </ActionsList>
        ),
      }}
    />
  );
};
