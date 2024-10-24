import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { PlainType } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { StatutProjetBadge } from './StatutProjetBadge';

type ProjetListItemProps = PlainType<Candidature.ListerProjetsListItemReadModel>;

export const ProjetListItem: FC<ProjetListItemProps> = (projet) => {
  const identifiantProjetValue = IdentifiantProjet.bind(projet.identifiantProjet);

  return (
    <>
      <div>
        <div className="flex flex-col gap-1">
          <h2 className="leading-4 flex flex-row md:flex-row gap-2">
            <span className="font-bold">{projet.nom}</span>
            <StatutProjetBadge statut={projet.statut.statut} />
          </h2>
          <div className="italic text-xs text-grey-425-base">
            {identifiantProjetValue.formatter()}
          </div>
          <div>
            {projet.localité?.commune} - {projet.localité?.région}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 md:mt-2">
        <Button linkProps={{ href: Routes.Abandon.détail(identifiantProjetValue.formatter()) }}>
          Abandon
        </Button>
        <Button linkProps={{ href: Routes.Recours.détail(identifiantProjetValue.formatter()) }}>
          Recours
        </Button>
        <Button
          linkProps={{
            href: Routes.GarantiesFinancières.détail(identifiantProjetValue.formatter()),
          }}
        >
          GarantiesFinancières
        </Button>
        <Button
          linkProps={{
            href: Routes.Achèvement.transmettreAttestationConformité(
              identifiantProjetValue.formatter(),
            ),
          }}
        >
          Achèvement
        </Button>
        <Button
          linkProps={{ href: Routes.Raccordement.détail(identifiantProjetValue.formatter()) }}
        >
          Raccordement
        </Button>
      </div>
    </>
  );
};
