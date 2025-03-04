import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';
import { ProjetBannerTemplate } from '@/components/molecules/projet/ProjetBanner.template';
import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { CorrigerCandidatureForm, CorrigerCandidatureFormProps } from './CorrigerCandidature.form';

export type CorrigerCandidaturePageProps = CorrigerCandidatureFormProps & {
  estNotifiée: boolean;
  estLauréat: boolean;
  isCRE4ZNI: boolean;
};

export const CorrigerCandidaturePage: React.FC<CorrigerCandidaturePageProps> = ({
  candidature,
  estNotifiée,
  aUneAttestation,
  estLauréat,
  isCRE4ZNI,
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
          dateDésignation={Option.none}
        />
      }
      leftColumn={{
        children: (
          <CorrigerCandidatureForm
            candidature={candidature}
            estNotifiée={estNotifiée}
            aUneAttestation={aUneAttestation}
            isCRE4ZNI={isCRE4ZNI}
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
                severity="info"
                small
                description={
                  <div className="flex flex-col gap-2 text-justify">
                    <span>
                      Cette candidature étant déjà notifiée, la modification des champs suivants{' '}
                      <span className="font-semibold">ne mettra pas à jour le projet</span> :
                      <ul className="p-4 list-disc">
                        <li>Nom du projet</li>
                        <li>Localité (adresse, commune, code postal, département, région)</li>
                        <li>Actionnaire (société mère)</li>
                        <li>Nom du représentant légal</li>
                        <li>Puissance</li>
                      </ul>
                    </span>
                    <span>
                      Pour les modifier <b>après notification</b>, utilisez le{' '}
                      <a href={Routes.Lauréat.modifier(identifiantProjet.formatter())}>
                        formulaire de modification
                      </a>{' '}
                      du projet.
                    </span>
                  </div>
                }
              />
            )}
          </>
        ),
      }}
    />
  );
};
