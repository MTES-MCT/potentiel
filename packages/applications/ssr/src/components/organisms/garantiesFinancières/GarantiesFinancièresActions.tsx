import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { DemanderMainlevéeGarantiesFinancières } from '../../pages/garanties-financières/mainlevée/demander/DemanderMainlevéeGarantiesFinancières.form';
import { SupprimerDépôtEnCoursGarantiesFinancières } from '../../pages/garanties-financières/dépôt/supprimer/SupprimerDépôtEnCoursGarantiesFinancières';
import { ValiderDépôtEnCoursGarantiesFinancières } from '../../pages/garanties-financières/dépôt/valider/validerDépôtEnCoursGarantiesFinancières';
import { InfoBoxDrealGarantiesFinancièreséÉchues } from '../../pages/garanties-financières/détails/components/InfoBoxDrealGarantiesFinancièresÉchues';

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
) & {
  identifiantProjet: GarantiesFinancièresProps['identifiantProjet'];
  contactPorteurs?: GarantiesFinancièresProps['contactPorteurs'];
};

export const GarantiesFinancièresActions = ({
  identifiantProjet,
  actions,
  isActuelle,
  contactPorteurs,
}: ActionsProps) => (
  <div className="flex flex-col md:flex-row gap-4">
    {isActuelle ? (
      <div className="flex flex-col gap-4">
        {actions.includes('contacter-porteur-pour-gf-échues') &&
          contactPorteurs &&
          contactPorteurs.length && (
            <InfoBoxDrealGarantiesFinancièreséÉchues contactPorteurs={contactPorteurs} />
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
