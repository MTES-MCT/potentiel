import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { DemanderMainlevéeGarantiesFinancières } from '../../pages/garanties-financières/mainlevée/demander/DemanderMainlevéeGarantiesFinancières';
import { SupprimerDépôtEnCoursGarantiesFinancières } from '../../pages/garanties-financières/dépôt/supprimer/SupprimerDépôtEnCoursGarantiesFinancières';
import { ValiderDépôtEnCoursGarantiesFinancières } from '../../pages/garanties-financières/dépôt/valider/validerDépôtEnCoursGarantiesFinancières';

import { GarantiesFinancièresProps } from './GarantiesFinancières';
import { DépôtGarantiesFinancières, GarantiesFinancièresActuelles } from './types';

type ActionsProps = (
  | {
      isActuelle: false;
      actions: DépôtGarantiesFinancières['actions'];
    }
  | {
      isActuelle: true;
      actions: GarantiesFinancièresActuelles['actions'];
    }
) & { identifiantProjet: GarantiesFinancièresProps['identifiantProjet']; contactPorteur?: string };

export const GarantiesFinancièresActions = ({
  identifiantProjet,
  actions,
  isActuelle,
  contactPorteur,
}: ActionsProps) => (
  <div className="flex flex-col md:flex-row gap-4">
    {isActuelle ? (
      <div className="flex flex-col gap-4">
        {actions.includes('contacter-porteur-pour-gf-échues') && (
          <p className="italic">
            La date d'échéance de ces garanties financières est dépassée, vous pouvez contacter le
            porteur{' '}
            <a href={`mailto:${contactPorteur}`} target="_blank">
              {contactPorteur}
            </a>{' '}
            pour l'inciter à en déposer de nouvelles.
          </p>
        )}
        <>
          {actions.includes('modifier') && (
            <Button
              linkProps={{
                href: Routes.GarantiesFinancières.actuelles.modifier(identifiantProjet),
              }}
            >
              Modifier les garanties financières actuelles
            </Button>
          )}
          {actions.includes('enregister-attestation') && (
            <div className="flex flex-col gap-1">
              <p className="italic">
                Les garanties financières sont incomplètes, merci de les compléter en enregistrant
                l'attestation de constitution
              </p>
              <Button
                linkProps={{
                  href: Routes.GarantiesFinancières.actuelles.enregistrerAttestation(
                    identifiantProjet,
                  ),
                }}
              >
                Enregistrer l'attestation de constitution
              </Button>
            </div>
          )}
          {(actions.includes('demander-mainlevée-gf-pour-projet-abandonné') ||
            actions.includes('demander-mainlevée-gf-pour-projet-achevé')) && (
            <DemanderMainlevéeGarantiesFinancières
              identifiantProjet={identifiantProjet}
              motif={
                actions.includes('demander-mainlevée-gf-pour-projet-abandonné')
                  ? 'projet-abandonné'
                  : 'projet-achevé'
              }
            />
          )}
        </>
      </div>
    ) : (
      <>
        {actions.includes('modifier') && (
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.GarantiesFinancières.dépôt.modifier(identifiantProjet),
            }}
          >
            Modifier
          </Button>
        )}
        {actions.includes('instruire') && (
          <ValiderDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
        )}
        {actions.includes('supprimer') && (
          <SupprimerDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
        )}
      </>
    )}
  </div>
);
