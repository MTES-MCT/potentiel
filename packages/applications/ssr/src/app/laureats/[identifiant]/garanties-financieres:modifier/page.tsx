import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  ModifierGarantiesFinancièresÀTraiter,
  ModifierGarantiesFinancièresÀTraiterProps,
} from '@/components/pages/garanties-financières/modifier/ModifierGarantiesFinancièresÀTraiter.page';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const metadata: Metadata = {
  title: 'Modifier des garanties financières en attente de validation - Potentiel',
  description: 'Formulaire de modification des garanties financières',
};

const getLabelByType = (type: GarantiesFinancières.TypeGarantiesFinancières.RawType) => {
  switch (type) {
    case 'consignation':
      return 'Consignation';
    case 'avec-date-échéance':
      return "Avec date d'échéance";
    case 'six-mois-après-achèvement':
      return 'Six mois après achèvement';
  }
};
export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  if (!process.env.FEATURE_FLAG_GARANTIES_FINANCIERES) {
    return notFound();
  }

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const candidature = await mediator.send<ConsulterCandidatureQuery>({
        type: 'CONSULTER_CANDIDATURE_QUERY',
        data: { identifiantProjet },
      });

      const garantiesFinancières =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'CONSULTER_GARANTIES_FINANCIÈRES_QUERY',
          data: { identifiantProjetValue: identifiantProjet },
        });

      if (!garantiesFinancières.àTraiter) {
        return notFound();
      }

      const props = mapToProps({
        identifiantProjet,
        candidature,
        statut: garantiesFinancières.statut.statut,
        garantiesFinancières: garantiesFinancières.àTraiter,
        utilisateur,
      });

      return <ModifierGarantiesFinancièresÀTraiter {...props} />;
    }),
  );
}

type MapToProps = (args: {
  identifiantProjet: string;
  candidature: ConsulterCandidatureReadModel;
  statut: GarantiesFinancières.ConsulterGarantiesFinancièresReadModel['statut']['statut'];
  garantiesFinancières: GarantiesFinancières.ConsulterGarantiesFinancièresReadModel['àTraiter'];
  utilisateur: Utilisateur.ValueType;
}) => ModifierGarantiesFinancièresÀTraiterProps;

const mapToProps: MapToProps = ({
  identifiantProjet,
  candidature,
  statut,
  garantiesFinancières,
  utilisateur,
}) => {
  const getActions = (
    utilisateur: Utilisateur.ValueType['role'],
  ): ModifierGarantiesFinancièresÀTraiterProps['actions'] => {
    if (utilisateur.estÉgaleÀ(Role.porteur)) {
      return ['supprimer'];
    }

    if (utilisateur.estÉgaleÀ(Role.dreal)) {
      return ['valider'];
    }

    return [];
  };

  return {
    projet: {
      ...candidature,
      identifiantProjet,
    },
    typesGarantiesFinancières: GarantiesFinancières.TypeGarantiesFinancières.types.map((type) => ({
      label: getLabelByType(type),
      value: type,
    })),
    statut,
    garantiesFinancières: {
      type: garantiesFinancières!.type.type,
      attestation: garantiesFinancières!.attestation.formatter(),
      dateConsitution: garantiesFinancières!.dateConstitution.formatter(),
      dateÉchéance: garantiesFinancières!.dateÉchéance?.formatter(),
    },
    actions: getActions(utilisateur.role),
    showWarning: utilisateur.role.estÉgaleÀ(Role.porteur) ? true : undefined,
  };
};
