import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';
import { ProjetBannerTemplate } from '@/components/molecules/projet/ProjetBanner.template';
import { PageTemplate } from '@/components/templates/Page.template';
import { StatutLauréatBadge } from '@/components/molecules/projet/lauréat/StatutLauréatBadge';

import { ModifierLauréatForm, ModifierLauréatFormProps } from './ModifierLauréat.form';

export type ModifierLauréatPageProps = ModifierLauréatFormProps;

export const ModifierLauréatPage: React.FC<ModifierLauréatPageProps> = ({
  candidature,
  lauréat,
  projet,
  cahierDesCharges,
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
              <StatutLauréatBadge statut={'actif'} />
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
        cahierDesCharges={cahierDesCharges}
      />
    </PageTemplate>
  );
};
