import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { ListerProjetsListItemReadModel } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { StatutProjetBadge } from './StatutProjetBadge';
import { ProjetLinks } from './TempProjetLinks';

type ProjetListItemProps = PlainType<ListerProjetsListItemReadModel>;

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

      <div className="flex flex-row gap-2 justify-between mt-4 md:mt-2">
        <ProjetLinks
          identifiantProjet={identifiantProjetValue.formatter()}
          title="Abandon"
          links={[
            'demander',
            'détail',
            'transmettrePreuveRecandidature',
            'téléchargerModèleRéponse',
          ]}
        />
        <ProjetLinks
          identifiantProjet={identifiantProjetValue.formatter()}
          title="GarantiesFinancières"
          links={['détail', 'téléchargerModèleMiseEnDemeure']}
        />
        <ProjetLinks
          identifiantProjet={identifiantProjetValue.formatter()}
          title="Achèvement"
          links={['transmettreAttestationConformité', 'modifierAttestationConformité']}
        />
        <ProjetLinks
          identifiantProjet={identifiantProjetValue.formatter()}
          title="Raccordement"
          links={[
            'transmettreDemandeComplèteRaccordement',
            'détail',
            'modifierGestionnaireDeRéseau',
            'importer',
          ]}
        />
      </div>
    </>
  );
};
