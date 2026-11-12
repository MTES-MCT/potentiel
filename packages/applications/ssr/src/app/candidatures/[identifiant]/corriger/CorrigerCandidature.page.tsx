import Notice from '@codegouvfr/react-dsfr/Notice';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import {
  CorrigerCandidatureForm,
  type CorrigerCandidatureFormProps,
} from './CorrigerCandidature.form';

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
  volumeRéservéDisponible,
}) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(candidature.identifiantProjet);

  return (
    <ColumnPageTemplate
      leftColumn={
        <CorrigerCandidatureForm
          candidature={candidature}
          estNotifiée={estNotifiée}
          aUneAttestation={aUneAttestation}
          champsSupplémentaires={champsSupplémentaires}
          unitéPuissance={unitéPuissance}
          typesActionnariatDisponibles={typesActionnariatDisponibles}
          typesGarantiesFinancièresDisponibles={typesGarantiesFinancièresDisponibles}
          volumeRéservéDisponible={volumeRéservéDisponible}
        />
      }
      rightColumn={
        <>
          <Notice
            severity="info"
            title="Ce formulaire sert à corriger des erreurs importées ou transmises à la candidature."
            description={
              <span>
                <br />
                Pour une correction par lot (fichier CSV), veuillez utiliser la{' '}
                <Link href={Routes.Candidature.corrigerParLot}>page de correction par lot</Link>
              </span>
            }
          />
          {estLauréat && (
            <Notice
              severity="warning"
              title=""
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
      }
    />
  );
};
