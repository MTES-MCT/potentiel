import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { CopyButton } from '@/components/molecules/CopyButton';

import { DétailsGarantiesFinancièresPageProps } from '../DétailsGarantiesFinancières.page';
import { DemanderMainlevéeForm } from '../(mainlevée)/demander/DemanderMainlevée.form';

type GarantiesFinancièresActuellesActionsProps = {
  actions: DétailsGarantiesFinancièresPageProps['actions'];
  infos: DétailsGarantiesFinancièresPageProps['infos'];
  identifiantProjet: string;
  contactPorteurs: string[];
  motif?: PlainType<Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.ValueType>;
  typeGfActuelles?: PlainType<Lauréat.GarantiesFinancières.GarantiesFinancières.ValueType>;
};

export const GarantiesFinancièresActuellesActions = ({
  identifiantProjet,
  actions,
  infos,
  contactPorteurs,
  motif,
  typeGfActuelles,
}: GarantiesFinancièresActuellesActionsProps) => (
  <div className="flex flex-col md:flex-row gap-4">
    <div className="flex flex-col gap-4">
      {infos.includes('échues') && (
        <p>
          La date d'échéance de ces garanties financières est dépassée. Vous pouvez contacter le ou
          les porteurs dont voici la ou les adresses emails :
          <br />
          <CopyButton textToCopy={contactPorteurs.join(',')} />
        </p>
      )}
      <div className="flex flex-col gap-1">
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
          <Button
            linkProps={{
              href: Routes.GarantiesFinancières.actuelles.enregistrerAttestation(identifiantProjet),
            }}
          >
            Enregistrer{' '}
            {typeGfActuelles?.type.type === 'exemption'
              ? 'la délibération approuvant le projet objet de l’offre'
              : "l'attestation de constitution"}
          </Button>
        )}
        {actions.includes('garantiesFinancières.mainlevée.demander') && motif && (
          <DemanderMainlevéeForm identifiantProjet={identifiantProjet} motif={motif.motif} />
        )}
      </div>
    </div>
  </div>
);
