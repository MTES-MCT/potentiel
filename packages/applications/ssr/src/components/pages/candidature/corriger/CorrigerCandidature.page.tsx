import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { ColumnTemplate } from '@/components/templates/Column.template';

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
    <ColumnTemplate
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
