import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';
import { ProjetBannerTemplate } from '@/components/molecules/projet/ProjetBanner.template';
import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { CorrigerCandidatureForm, CorrigerCandidatureFormProps } from './CorrigerCandidature.form';

export type CorrigerCandidaturePageProps = CorrigerCandidatureFormProps & { estNotifiée: boolean };

export const CorrigerCandidaturePage: React.FC<CorrigerCandidaturePageProps> = ({
  candidature,
  estNotifiée,
}) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(candidature.identifiantProjet);

  return (
    <ColumnPageTemplate
      banner={
        <ProjetBannerTemplate
          identifiantProjet={identifiantProjet}
          nom={candidature.nomProjet}
          badge={
            <div className="flex gap-2">
              <StatutProjetBadge statut={candidature.statut} />
              <NotificationBadge estNotifié={estNotifiée} />
            </div>
          }
        />
      }
      leftColumn={{
        children: <CorrigerCandidatureForm candidature={candidature} estNotifiée={estNotifiée} />,
      }}
      rightColumn={{
        children: (
          <Alert
            severity="info"
            small
            description={
              <div className="flex flex-col gap-2">
                <div>Ce formulaire sert à corriger des erreurs lors de la candidature.</div>
                <div>
                  Pour un changement a posteriori, utiliser le formulaire dans la{' '}
                  <Link href={Routes.Projet.details(identifiantProjet.formatter())}>
                    page projet
                  </Link>
                </div>
              </div>
            }
          />
        ),
      }}
    />
  );
};
