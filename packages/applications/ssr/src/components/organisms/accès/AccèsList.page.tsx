import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { Section } from '../../atoms/menu/Section';
import { SectionPage } from '../../atoms/menu/SectionPage';
import { InviterPorteurForm } from './(inviter)/InviterPorteur.form';
import { PorteurListItem, type PorteurListItemProps } from './AccèsListItem';

export type AccèsListPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.RawType>;
  accès: PorteurListItemProps[];
  nombreDeProjets?: number;
  peutInviter: boolean;
  statutProjet: 'classé' | 'éliminé';
};

export const AccèsListPage: FC<AccèsListPageProps> = ({
  accès,
  identifiantProjet,
  nombreDeProjets,
  peutInviter,
  statutProjet,
}) => (
  <SectionPage title="Utilisateurs">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-[2] flex-col gap-4">
        <Section title="Comptes ayant accès au projet">
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
        </Section>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <InviterPorteurForm
          identifiantProjet={identifiantProjet}
          nombreDeProjets={nombreDeProjets}
          peutInviter={peutInviter}
          statutProjet={statutProjet}
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
      </div>
    </div>
  </SectionPage>
);
