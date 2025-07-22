import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { DemanderMainlevéeForm } from '../(mainlevée)/demander/DemanderMainlevée.form';
import { GarantiesFinancièresProps } from '../components/GarantiesFinancières';

import { InfoBoxDrealGarantiesFinancièreséÉchues } from './components/InfoBoxDrealGarantiesFinancièresÉchues';
import { GarantiesFinancièresActuelles } from './garantiesFinancièresActuelles.type';

type GarantiesFinancièresActuellesActionsProps = {
  actions: GarantiesFinancièresActuelles['actions'];
  identifiantProjet: GarantiesFinancièresProps['identifiantProjet'];
  contactPorteurs?: GarantiesFinancièresProps['contactPorteurs'];
};

export const GarantiesFinancièresActuellesActions = ({
  identifiantProjet,
  actions,
  contactPorteurs,
}: GarantiesFinancièresActuellesActionsProps) => (
  <div className="flex flex-col md:flex-row gap-4">
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
          <DemanderMainlevéeForm
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
  </div>
);
