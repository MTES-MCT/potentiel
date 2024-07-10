import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { DemanderMainlevéeGarantiesFinancières } from '../../pages/garanties-financières/mainlevée/demander/DemanderMainlevéeGarantiesFinancières';

import { GarantiesFinancièresProps } from './GarantiesFinancières';

type Props = {
  identifiantProjet: GarantiesFinancièresProps['identifiantProjet'];
  actions: GarantiesFinancièresProps['actions'];
};

export const GarantiesFinancièresActions = ({ identifiantProjet, actions }: Props) => (
  <div className="flex flex-col md:flex-row gap-4">
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
            href: Routes.GarantiesFinancières.actuelles.enregistrerAttestation(identifiantProjet),
          }}
        >
          Enregistrer l'attestation de constitution
        </Button>
      </div>
    )}
    {(actions.includes('demander-mainlevée-gf-pour-projet-abandonné') ||
      actions.includes('demander-mainlevée-gf-pour-projet-achevé')) && (
      <>
        <DemanderMainlevéeGarantiesFinancières
          identifiantProjet={identifiantProjet}
          motif={
            actions.includes('demander-mainlevée-gf-pour-projet-abandonné')
              ? 'projet-abandonné'
              : 'projet-achevé'
          }
        />
      </>
    )}
  </div>
);
