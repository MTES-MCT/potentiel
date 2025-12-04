import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { SectionPage } from '../../../app/laureats/[identifiant]/(détails)/(components)/SectionPage';
import { Section } from '../../../app/laureats/[identifiant]/(détails)/(components)/Section';

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
    <SectionPage title={'Utilisateurs'}>
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
      <div className="flex flex-col gap-4">
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
      </div>
    </SectionPage>
  );
};
