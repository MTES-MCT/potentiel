import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';
import { ProjetBannerTemplate } from '@/components/molecules/projet/ProjetBanner.template';
import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';
import {
  ModifierCandidatureNotifiéeFormEntries,
  ModifierLauréatKeys,
  ModifierLauréatValueFormEntries,
} from '@/utils/zod/candidature';

import { PageTemplate } from '../../../templates/Page.template';

import { ModifierLauréatForm } from './ModifierLauréat.form';

type ModifierLauréatFormEntries = {
  [K in ModifierLauréatKeys]: {
    currentValue: ModifierLauréatValueFormEntries[K];
    estEnCoursDeModification: boolean;
  };
};

export type ModifierLauréatPageProps = {
  candidature: ModifierCandidatureNotifiéeFormEntries;
  lauréat: ModifierLauréatFormEntries;
  projet: {
    identifiantProjet: string;
    nomProjet: string;
    isCRE4ZNI: boolean;
    isPPE2: boolean;
  };
};

export const ModifierLauréatPage: React.FC<ModifierLauréatPageProps> = ({
  candidature,
  lauréat,
  projet,
}) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(projet.identifiantProjet);

  return (
    <PageTemplate
      banner={
        <ProjetBannerTemplate
          identifiantProjet={identifiantProjet}
          nom={projet.nomProjet}
          href={Routes.Projet.details(identifiantProjet.formatter())}
          badge={
            <div className="flex gap-2">
              <StatutProjetBadge statut={'classé'} />
              <NotificationBadge estNotifié={true} />
            </div>
          }
          dateDésignation={Option.none}
        />
      }
    >
      <ModifierLauréatForm candidature={candidature} lauréat={lauréat} projet={projet} />
    </PageTemplate>
  );
};
