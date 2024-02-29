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
import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';

export const metadata: Metadata = {
  title: 'Modifier des garanties financières en attente de validation - Potentiel',
  description: 'Formulaire de modification des garanties financières',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  if (!process.env.FEATURE_FLAG_GARANTIES_FINANCIERES) {
    return notFound();
  }

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const candidature = await mediator.send<ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: { identifiantProjet },
      });

      const garantiesFinancières =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
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
}) => ({
  projet: {
    ...candidature,
    identifiantProjet,
  },
  typesGarantiesFinancières: GarantiesFinancières.TypeGarantiesFinancières.types.map((type) => ({
    label: getGarantiesFinancièresTypeLabel(type),
    value: type,
  })),
  statut,
  garantiesFinancières: {
    type: garantiesFinancières!.type.type,
    attestation: garantiesFinancières!.attestation.formatter(),
    dateConsitution: garantiesFinancières!.dateConstitution.formatter(),
    dateÉchéance: garantiesFinancières!.dateÉchéance?.formatter(),
  },
  actions: utilisateur.role.estÉgaleÀ(Role.porteur)
    ? ['supprimer']
    : utilisateur.role.estÉgaleÀ(Role.dreal)
    ? /**
       * @todo Ajouter la possibilité de valider / modifier des Gfs quand le domaine sera prêt
       */
      []
    : [],
  showWarning: utilisateur.role.estÉgaleÀ(Role.porteur) ? true : undefined,
});
