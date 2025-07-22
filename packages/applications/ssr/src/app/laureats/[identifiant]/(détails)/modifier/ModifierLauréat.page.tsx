import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';
import { ProjetBannerTemplate } from '@/components/molecules/projet/ProjetBanner.template';
import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';
import { PageTemplate } from '@/components/templates/Page.template';

import { ModifierLauréatForm, ModifierLauréatFormProps } from './ModifierLauréat.form';

export type ModifierLauréatPageProps = ModifierLauréatFormProps;

export const ModifierLauréatPage: React.FC<ModifierLauréatPageProps> = ({
  candidature,
  lauréat,
  projet,
  champsSupplémentaires,
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
      <ModifierLauréatForm
        candidature={candidature}
        lauréat={lauréat}
        projet={projet}
        champsSupplémentaires={champsSupplémentaires}
      />
    </PageTemplate>
  );
};
