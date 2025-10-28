import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { ActionsList } from '@/components/templates/ActionsList.template';

import { InviterPorteurForm } from './(inviter)/InviterPorteur.form';
import { PorteurListItem, PorteurListItemProps } from './PorteurListItem';

export type PorteurListPageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  accès: Omit<PorteurListItemProps, 'identifiantProjet'>[];
  nombreDeProjets?: number;
};

export const PorteurListPage: FC<PorteurListPageProps> = ({
  identifiantProjet,
  accès,
  nombreDeProjets,
}) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}
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
                  {accès.map(({ identifiantUtilisateur, peutRetirerAccès }) => (
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
          <PorteurListActions
            identifiantProjet={identifiantProjet}
            accès={accès}
            nombreDeProjets={nombreDeProjets}
          />
        ),
      }}
    />
  );
};

const PorteurListActions: FC<{
  identifiantProjet: IdentifiantProjet.RawType;
  accès: Omit<PorteurListItemProps, 'identifiantProjet'>[];
  nombreDeProjets?: number;
}> = ({ identifiantProjet, accès, nombreDeProjets }) => (
  <ActionsList actionsListLength={2} className="pl-10">
    <InviterPorteurForm identifiantProjet={identifiantProjet} nombreDeProjets={nombreDeProjets} />
    <Button
      iconId="fr-icon-mail-line"
      priority="secondary"
      linkProps={{ href: `mailto:${accès.map((item) => item.identifiantUtilisateur).join(',')}` }}
    >
      Contacter tous les utilisateurs
    </Button>
  </ActionsList>
);
