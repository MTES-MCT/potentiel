import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getCahierDesCharges } from '@/app/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { DétailsCahierDesCharges } from './DétailsCahierDesCharges';

export type CahierDesChargesSectionProps = {
  identifiantProjet: string;
};

export const CahierDesChargesSection = ({
  identifiantProjet: identifiantProjetValue,
}: CahierDesChargesSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    const value = cahierDesCharges.cahierDesChargesModificatif
      ? {
          estInitial: false as const,
          estAlternatif: !!cahierDesCharges.cahierDesChargesModificatif.alternatif,
          doitChoisirUnCahierDesChargesModificatif: false as const,
          dateParution: cahierDesCharges.cahierDesChargesModificatif?.paruLe,
          cahierDesChargesURL: cahierDesCharges.appelOffre.cahiersDesChargesUrl,
          estSoumisAuxGarantiesFinancières: cahierDesCharges.estSoumisAuxGarantiesFinancières(),
        }
      : {
          estInitial: true as const,
          estAlternatif: false as const,
          doitChoisirUnCahierDesChargesModificatif:
            cahierDesCharges.doitChoisirUnCahierDesChargesModificatif(),
          cahierDesChargesURL: cahierDesCharges.appelOffre.cahiersDesChargesUrl,
          estSoumisAuxGarantiesFinancières: cahierDesCharges.estSoumisAuxGarantiesFinancières(),
        };

    const action = rôle.aLaPermission('cahierDesCharges.choisir')
      ? {
          label: 'Accéder au choix du cahier des charges',
          url: Routes.CahierDesCharges.choisir(identifiantProjet.formatter()),
        }
      : undefined;

    return <DétailsCahierDesCharges value={value} action={action} />;
  });
