import Notice from '@codegouvfr/react-dsfr/Notice';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Link } from '@/components/atoms/LinkNoPrefetch';
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
            volumeRéservéDisponible={volumeRéservéDisponible}
          />
        ),
      }}
      rightColumn={{
        children: (
          <div className="flex flex-col gap-4">
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
            <Notice
              severity="info"
              title=""
              description={
                <>
                  <span>
                    Ce formulaire sert à{' '}
                    <span className="font-semibold">
                      corriger des erreurs importées ou transmises à la candidature.
                    </span>
                  </span>
                  <br />

                  <span>
                    Pour une correction par lot (fichier CSV), veuillez utiliser la{' '}
                    <Link href={Routes.Candidature.corrigerParLot}>page de correction par lot</Link>
                    .
                  </span>
                </>
              }
            />
          </div>
        ),
      }}
    />
  );
};
