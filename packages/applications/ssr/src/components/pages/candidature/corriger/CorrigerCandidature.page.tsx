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
  aUneAttestation,
}) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(candidature.identifiantProjet);

  return (
    <ColumnPageTemplate
      banner={
        <ProjetBannerTemplate
          identifiantProjet={identifiantProjet}
          nom={candidature.nomProjet}
          href={Routes.Projet.details(identifiantProjet.formatter())}
          badge={
            <div className="flex gap-2">
              {candidature.statut && <StatutProjetBadge statut={candidature.statut} />}
              <NotificationBadge estNotifié={estNotifiée} />
            </div>
          }
        />
      }
      leftColumn={{
        children: (
          <CorrigerCandidatureForm
            candidature={candidature}
            estNotifiée={estNotifiée}
            aUneAttestation={aUneAttestation}
          />
        ),
      }}
      rightColumn={{
        children: (
          <Alert
            severity="info"
            small
            description={
              <div className="flex flex-col gap-2">
                <div>
                  Ce formulaire sert à corriger des erreurs importées ou transmises à la
                  candidature.
                </div>
                <div>
                  Pour un changement au cours de la vie du projet, veuillez utiliser le formulaire
                  dans la{' '}
                  <Link href={Routes.Projet.details(identifiantProjet.formatter())}>
                    page projet
                  </Link>
                  .
                </div>
                <div>
                  Pour un changement par lot (fichier CSV), veuillez utiliser la{' '}
                  <Link href={Routes.Candidature.corrigerParLot}>page de correction par lot</Link>
                </div>
              </div>
            }
          />
        ),
      }}
    />
  );
};
