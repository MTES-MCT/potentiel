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
  DétailsGarantiesFinancièresPage,
  DétailsGarantiesFinancièresProps,
} from '@/components/pages/garanties-financières/détails/DétailsGarantiesFinancières.page';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const metadata: Metadata = {
  title: 'Transmettre des garanties financières - Potentiel',
  description: 'Formulaire de transmission des garanties financières',
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

      const props: DétailsGarantiesFinancièresProps = mapToProps({
        identifiantProjet,
        candidature,
        garantiesFinancières,
        utilisateur,
      });

      return <DétailsGarantiesFinancièresPage {...props} />;
    }),
  );
}

type MapToProps = (args: {
  identifiantProjet: string;
  candidature: ConsulterCandidatureReadModel;
  garantiesFinancières: GarantiesFinancières.ConsulterGarantiesFinancièresReadModel;
  utilisateur: Utilisateur.ValueType;
}) => DétailsGarantiesFinancièresProps;

const mapToProps: MapToProps = ({
  identifiantProjet,
  candidature,
  garantiesFinancières,
  utilisateur,
}) => ({
  projet: {
    ...candidature,
    identifiantProjet: identifiantProjet,
  },
  statut: garantiesFinancières.statut.statut,
  garantiesFinancières: {
    validées: garantiesFinancières.validées
      ? {
          type: garantiesFinancières.validées.type.type,
          dateConstitution: garantiesFinancières.validées.dateConstitution.formatter(),
          dateÉchéance: garantiesFinancières.validées.dateÉchéance?.formatter(),
          validéLe: garantiesFinancières.validées.validéLe.formatter(),
          // attestation: garantiesFinancières.validées.attestation,
          actions:
            utilisateur.role.estÉgaleÀ(Role.porteur) && !garantiesFinancières.àTraiter
              ? ['ajouter']
              : [],
          /**
           * @todo activer la page de modification des garanties financières quand le domain sera prêt
           
          actions: utilisateur.role.estÉgaleÀ(Role.dreal)
            ? ['modifier']
            : utilisateur.role.estÉgaleÀ(Role.porteur) && !garantiesFinancières.àTraiter
            ? ['ajouter']
            : [],
           */
        }
      : undefined,
    àTraiter: garantiesFinancières.àTraiter
      ? {
          type: garantiesFinancières.àTraiter.type.type,
          dateConstitution: garantiesFinancières.àTraiter.dateConstitution.formatter(),
          dateÉchéance: garantiesFinancières.àTraiter.dateÉchéance?.formatter(),
          soumisLe: garantiesFinancières.àTraiter.soumisLe.formatter(),
          attestation: garantiesFinancières.àTraiter.attestation.formatter(),
          actions: [],
          /**
           * @todo activer la page de modification des garanties financières quand le domain sera prêt
           
          actions: utilisateur.role.estÉgaleÀ(Role.dreal) || utilisateur.role.estÉgaleÀ(Role.porteur)
              ? ['modifier']
              : [],
           */
        }
      : undefined,
    enAttente: garantiesFinancières.enAttente
      ? {
          dateLimiteSoumission: garantiesFinancières.enAttente.dateLimiteSoumission.formatter(),
          demandéLe: garantiesFinancières.enAttente.demandéLe.formatter(),
          actions: [],
          /**
         * @todo activer la page d'enregistrement des garanties financières quand le domain sera prêt
         * 
        actions: utilisateur.role.estÉgaleÀ(Role.porteur) ? ['enregistrer'] : [],
         */
        }
      : undefined,
  },
});
