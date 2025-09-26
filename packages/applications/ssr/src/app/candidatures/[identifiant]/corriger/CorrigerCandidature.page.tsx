import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';
import { ProjetBannerTemplate } from '@/components/molecules/projet/ProjetBanner.template';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { StatutCandidatureBadge } from '@/components/molecules/candidature/StatutCandidatureBadge';

import { CorrigerCandidatureForm, CorrigerCandidatureFormProps } from './CorrigerCandidature.form';

export type CorrigerCandidaturePageProps = CorrigerCandidatureFormProps & {
  estNotifiée: boolean;
  estLauréat: boolean;
};

export const CorrigerCandidaturePage: React.FC<CorrigerCandidaturePageProps> = ({
  candidature,
  estNotifiée,
  aUneAttestation,
  estLauréat,
  champsSupplémentaires,
  unitéPuissance,
  typesActionnariatDisponibles,
  typesGarantiesFinancièresDisponibles,
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
              {candidature.statut && <StatutCandidatureBadge statut={candidature.statut} />}
              <NotificationBadge estNotifié={estNotifiée} />
            </div>
          }
          dateDésignation={Option.none}
        />
      }
      leftColumn={{
        children: (
          <CorrigerCandidatureForm
            candidature={candidature}
            estNotifiée={estNotifiée}
            aUneAttestation={aUneAttestation}
            champsSupplémentaires={champsSupplémentaires}
            unitéPuissance={unitéPuissance}
            typesActionnariatDisponibles={typesActionnariatDisponibles}
            typesGarantiesFinancièresDisponibles={typesGarantiesFinancièresDisponibles}
          />
        ),
      }}
      rightColumn={{
        children: (
          <>
            <Alert
              severity="info"
              small
              description={
                <div className="flex flex-col gap-2">
                  <div>
                    Ce formulaire sert à{' '}
                    <span className="font-semibold">
                      corriger des erreurs importées ou transmises à la candidature.
                    </span>
                  </div>
                  <div>
                    Pour une correction par lot (fichier CSV), veuillez utiliser la{' '}
                    <Link href={Routes.Candidature.corrigerParLot}>page de correction par lot</Link>
                  </div>
                </div>
              }
            />
            {estLauréat && (
              <Alert
                severity="warning"
                small
                description={
                  <span>
                    Cette candidature étant déjà notifiée, veuillez utiliser la{' '}
                    <Link href={Routes.Lauréat.modifier(identifiantProjet.formatter())}>
                      page de correction du projet et de la candidature
                    </Link>
                    .
                  </span>
                }
              />
            )}
          </>
        ),
      }}
    />
  );
};
