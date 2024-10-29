import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/reseau';

export type DossierRaccordementListItemActionsProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  référence: PlainType<Raccordement.RéférenceDossierRaccordement.ValueType>;
  actions: { voirLeDossier: true } | { voirLeDossier: false; transmettreMiseEnService: boolean };
};

export const DossierRaccordementListItemActions: FC<DossierRaccordementListItemActionsProps> = ({
  identifiantProjet,
  référence: { référence },
  actions,
}) => {
  return (
    <div className="flex md:max-lg:flex-col gap-2">
      {!actions.voirLeDossier && actions.transmettreMiseEnService && (
        <Button
          className="md:flex ml-auto"
          linkProps={{
            href: Routes.Raccordement.transmettreDateMiseEnService(
              IdentifiantProjet.bind(identifiantProjet).formatter(),
              référence,
            ),
            prefetch: false,
          }}
          aria-label={`Transmettre la date de mise en service pour le dossier de raccordement ${référence}`}
        >
          Transmettre date mise en service
        </Button>
      )}
      {actions.voirLeDossier && (
        <Button
          className="md:flex ml-auto"
          linkProps={{
            href: Routes.Raccordement.détail(IdentifiantProjet.bind(identifiantProjet).formatter()),
            prefetch: false,
          }}
          aria-label={`Consulter le dossier de raccordement ${référence}`}
        >
          Consulter
        </Button>
      )}
    </div>
  );
};
