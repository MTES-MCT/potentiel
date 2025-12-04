import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ChampAvecAction } from '../../_helpers/types';
import { getCahierDesCharges } from '../../../../_helpers';

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export type CahierDesChargesData = ChampAvecAction<
  | {
      estInitial: true;
      estAlternatif: false;
      doitChoisirUnCahierDesChargesModificatif: boolean;
      cahierDesChargesURL: string;
      estSoumisAuxGarantiesFinancières: boolean;
    }
  | {
      estInitial: false;
      estAlternatif: boolean;
      doitChoisirUnCahierDesChargesModificatif: false;
      dateParution: AppelOffre.CahierDesChargesModifié['paruLe'];
      cahierDesChargesURL: string;
      estSoumisAuxGarantiesFinancières: boolean;
    }
>;

export const getCahierDesChargesData = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<CahierDesChargesData> => {
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

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

  return {
    value,
    action,
  };
};
