import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { DemanderMainlevéeForm } from '../(mainlevée)/demander/DemanderMainlevée.form';

import { InfoBoxDrealGarantiesFinancièreséÉchues } from './components/InfoBoxDrealGarantiesFinancièresÉchues';
import { DétailsGarantiesFinancièresPageProps } from '../DétailsGarantiesFinancières.page';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

type GarantiesFinancièresActuellesActionsProps = {
  actions: DétailsGarantiesFinancièresPageProps['actions'];
  infos: DétailsGarantiesFinancièresPageProps['infos'];
  identifiantProjet: string;
  contactPorteurs: string[];
  motif?: PlainType<Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.ValueType>;
};

export const GarantiesFinancièresActuellesActions = ({
  identifiantProjet,
  actions,
  infos,
  contactPorteurs,
  motif,
}: GarantiesFinancièresActuellesActionsProps) => (
  <div className="flex flex-col md:flex-row gap-4">
    <div className="flex flex-col gap-4">
      {infos.includes('échues') && contactPorteurs && contactPorteurs.length && (
        <InfoBoxDrealGarantiesFinancièreséÉchues contactPorteurs={contactPorteurs} />
      )}
      <>
        {actions.includes('garantiesFinancières.actuelles.modifier') && (
          <Button
            linkProps={{
              href: Routes.GarantiesFinancières.actuelles.modifier(identifiantProjet),
            }}
          >
            Modifier les garanties financières actuelles
          </Button>
        )}
        {actions.includes('garantiesFinancières.actuelles.enregistrerAttestation') && (
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
        {actions.includes('garantiesFinancières.mainlevée.demander') && motif && (
          <DemanderMainlevéeForm identifiantProjet={identifiantProjet} motif={motif.motif} />
        )}
      </>
    </div>
  </div>
);
