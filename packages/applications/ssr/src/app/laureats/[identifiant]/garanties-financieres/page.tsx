import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Achèvement, GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { récupérerPorteursParIdentifiantProjetAdapter } from '@potentiel-infrastructure/domain-adapters';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';
import {
  DétailsGarantiesFinancièresPage,
  DétailsGarantiesFinancièresPageProps,
} from '@/components/pages/garanties-financières/détails/DétailsGarantiesFinancières.page';
import { projetSoumisAuxGarantiesFinancières } from '@/utils/garanties-financières/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '@/components/pages/garanties-financières/ProjetNonSoumisAuxGarantiesFinancières.page';

import { getHistoriqueMainlevéeRejetéesActions } from './helpers/getHistoriqueMainlevéeRejetéesActions';
import { getMainlevéeActions } from './helpers/getMainlevéeActions';
import { getGarantiesFinancièresActuellesActions } from './helpers/getGarantiesFinancièresActuellesActions';
import { getDépôtActions } from './helpers/getDépôtActions';

export const metadata: Metadata = {
  title: 'Détail des garanties financières - Potentiel',
  description: 'Page de détails des garanties financières',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const candidature = await mediator.send<Candidature.ConsulterProjetQuery>({
        type: 'Candidature.Query.ConsulterProjet',
        data: { identifiantProjet },
      });

      if (Option.isNone(candidature)) {
        return notFound();
      }

      const appelOffreDetails = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: { identifiantAppelOffre: candidature.appelOffre },
      });

      if (Option.isNone(appelOffreDetails)) {
        return notFound();
      }

      const soumisAuxGarantiesFinancières = await projetSoumisAuxGarantiesFinancières({
        appelOffre: candidature.appelOffre,
        famille: candidature.famille,
        periode: candidature.période,
      });

      if (!soumisAuxGarantiesFinancières) {
        return <ProjetNonSoumisAuxGarantiesFinancièresPage identifiantProjet={identifiantProjet} />;
      }

      const garantiesFinancièresActuelles =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet },
        });

      const peutAccéderAuxArchivesDesGfs =
        utilisateur.role.estÉgaleÀ(Role.admin) ||
        utilisateur.role.estÉgaleÀ(Role.dreal) ||
        utilisateur.role.estÉgaleÀ(Role.dgecValidateur);

      // les archives ne sont visibles que pour les DREAL et DGEC
      // on limite donc la query à ces utilisateurs pour gagner en perf
      const archivesGarantiesFinancières = peutAccéderAuxArchivesDesGfs
        ? await mediator.send<GarantiesFinancières.ConsulterArchivesGarantiesFinancièresQuery>({
            type: 'Lauréat.GarantiesFinancières.Query.ConsulterArchivesGarantiesFinancières',
            data: { identifiantProjetValue: identifiantProjet },
          })
        : Option.none;

      const dépôtEnCoursGarantiesFinancières =
        await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet },
        });

      const achèvement = await mediator.send<Achèvement.ConsulterAttestationConformitéQuery>({
        type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
        data: { identifiantProjetValue: identifiantProjet },
      });

      const mainlevée =
        await mediator.send<GarantiesFinancières.ConsulterDemandeMainlevéeGarantiesFinancièresQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
            data: { identifiantProjetValue: identifiantProjet },
          },
        );

      const historiqueMainlevée =
        await mediator.send<GarantiesFinancières.ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.ConsulterHistoriqueDemandeMainlevéeRejetée',
            data: {
              identifiantProjetValue: identifiantProjet,
            },
          },
        );

      const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(
        IdentifiantProjet.convertirEnValueType(identifiantProjet),
      );

      const props = mapToProps({
        identifiantProjet,
        utilisateur,
        garantiesFinancièresActuelles,
        dépôtEnCoursGarantiesFinancières,
        achèvement,
        mainlevée,
        appelOffreDetails,
        historiqueMainlevée,
        statut: candidature.statut,
        contactPorteurs: porteurs.map((porteur) => porteur.email),
        archivesGarantiesFinancières,
      });

      return (
        <DétailsGarantiesFinancièresPage
          identifiantProjet={identifiantProjet}
          contactPorteurs={props.contactPorteurs}
          actuelles={props.actuelles}
          dépôtEnCours={props.dépôtEnCours}
          archivesGarantiesFinancières={props.archivesGarantiesFinancières}
          dateLimiteSoummission={props.dateLimiteSoummission}
          mainlevée={props.mainlevée}
          historiqueMainlevée={props.historiqueMainlevée}
          infoBoxMainlevée={props.infoBoxMainlevée}
          infoBoxGarantiesFinancières={props.infoBoxGarantiesFinancières}
          action={props.action}
        />
      );
    }),
  );
}

type MapToProps = (params: {
  identifiantProjet: string;
  contactPorteurs: string[];
  utilisateur: Utilisateur.ValueType;
  garantiesFinancièresActuelles: Option.Type<GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
  dépôtEnCoursGarantiesFinancières: Option.Type<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresReadModel>;
  achèvement: Option.Type<Achèvement.ConsulterAttestationConformitéReadModel>;
  mainlevée: Option.Type<GarantiesFinancières.ConsulterDemandeMainlevéeGarantiesFinancièresReadModel>;
  appelOffreDetails: AppelOffre.AppelOffreReadModel;
  historiqueMainlevée: Option.Type<GarantiesFinancières.ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresReadModel>;
  statut: StatutProjet.RawType;
  archivesGarantiesFinancières: Option.Type<GarantiesFinancières.ConsulterArchivesGarantiesFinancièresReadModel>;
}) => DétailsGarantiesFinancièresPageProps;

const mapToProps: MapToProps = ({
  identifiantProjet,
  contactPorteurs,
  utilisateur,
  garantiesFinancièresActuelles,
  dépôtEnCoursGarantiesFinancières,
  achèvement,
  mainlevée,
  appelOffreDetails,
  historiqueMainlevée,
  statut,
  archivesGarantiesFinancières,
}) => {
  const archives = Option.isSome(archivesGarantiesFinancières)
    ? archivesGarantiesFinancières.archives.map((garantiesFinancières) => ({
        ...mapGarantiesFinancièrestoProps({
          garantiesFinancières,
        }),
        motif: garantiesFinancières.motif.motif,
      }))
    : undefined;

  const gfActuellesExistante = Option.isSome(garantiesFinancièresActuelles)
    ? garantiesFinancièresActuelles
    : undefined;

  const dépôtExistant = Option.isSome(dépôtEnCoursGarantiesFinancières)
    ? dépôtEnCoursGarantiesFinancières
    : undefined;

  const mainlevéeExistante = Option.isSome(mainlevée) ? mainlevée : undefined;

  const achèvementExistant = Option.isSome(achèvement) ? achèvement : undefined;

  const historiqueMainlevéeExistant = Option.isSome(historiqueMainlevée)
    ? historiqueMainlevée
    : undefined;

  if (!gfActuellesExistante && !dépôtExistant) {
    return {
      identifiantProjet,
      action: utilisateur.role.estÉgaleÀ(Role.porteur)
        ? 'soumettre'
        : utilisateur.role.estÉgaleÀ(Role.admin) ||
            utilisateur.role.estÉgaleÀ(Role.dgecValidateur) ||
            utilisateur.role.estÉgaleÀ(Role.dreal)
          ? 'enregistrer'
          : undefined,
      infoBoxMainlevée: {
        afficher: utilisateur.role.estÉgaleÀ(Role.porteur) && Option.isNone(mainlevée),
      },
      infoBoxGarantiesFinancières: {
        afficher: false,
      },
      archivesGarantiesFinancières: archives,
    };
  }

  const actions = {
    dépôt: getDépôtActions(utilisateur.role),
    garantiesFinancièresActuelles: gfActuellesExistante
      ? getGarantiesFinancièresActuellesActions({
          role: utilisateur.role,
          garantiesFinancières: gfActuellesExistante.garantiesFinancières,
          dépôt: dépôtEnCoursGarantiesFinancières,
          achèvement,
          mainlevée,
          statutProjet: statut,
        })
      : [],
    mainlevée: getMainlevéeActions({ role: utilisateur.role, mainlevée }),
    historiqueMainlevée: getHistoriqueMainlevéeRejetéesActions({
      role: utilisateur.role,
      mainlevée,
      historiqueMainlevéeRejetée: historiqueMainlevée,
    }),
  };

  return {
    identifiantProjet,
    contactPorteurs,
    actuelles: gfActuellesExistante
      ? {
          ...mapGarantiesFinancièrestoProps({
            garantiesFinancières: gfActuellesExistante.garantiesFinancières,
          }),
          actions: actions.garantiesFinancièresActuelles,
          isActuelle: true,
        }
      : undefined,
    archivesGarantiesFinancières: archives,
    dépôtEnCours: dépôtExistant
      ? {
          type: getGarantiesFinancièresTypeLabel(dépôtExistant.dépôt.type.type),
          dateÉchéance: dépôtExistant.dépôt.dateÉchéance?.formatter(),
          dateConstitution: dépôtExistant.dépôt.dateConstitution.formatter(),
          soumisLe: dépôtExistant.dépôt.soumisLe.formatter(),
          dernièreMiseÀJour: {
            date: dépôtExistant.dépôt.dernièreMiseÀJour.date.formatter(),
            par: dépôtExistant.dépôt.dernièreMiseÀJour.par.formatter(),
          },
          attestation: dépôtExistant.dépôt.attestation.formatter(),
          actions: actions.dépôt,
          isActuelle: false,
        }
      : undefined,
    action:
      !dépôtExistant && !mainlevéeExistante && utilisateur.role.estÉgaleÀ(Role.porteur)
        ? 'soumettre'
        : undefined,
    infoBoxGarantiesFinancières: {
      afficher: Boolean(
        !mainlevéeExistante && utilisateur.role.estÉgaleÀ(Role.porteur) && gfActuellesExistante,
      ),
    },
    mainlevée: mainlevéeExistante
      ? {
          motif: mainlevéeExistante.motif.motif,
          statut: mainlevéeExistante.statut.statut,
          demande: {
            date: mainlevéeExistante.demande.demandéeLe.formatter(),
            par: mainlevéeExistante.demande.demandéePar.formatter(),
          },
          ...(mainlevéeExistante.instruction && {
            instruction: {
              date: mainlevéeExistante.instruction?.démarréeLe.formatter(),
              par: mainlevéeExistante.instruction?.démarréePar.formatter(),
            },
          }),
          ...(mainlevéeExistante.accord && {
            accord: {
              date: mainlevéeExistante.accord?.accordéeLe.formatter(),
              par: mainlevéeExistante.accord?.accordéePar.formatter(),
              courrierAccord: mainlevéeExistante.accord?.courrierAccord.formatter(),
            },
          }),
          dernièreMiseÀJour: {
            date: mainlevéeExistante.dernièreMiseÀJour.date.formatter(),
            par: mainlevéeExistante.dernièreMiseÀJour.par.formatter(),
          },
          actions: actions.mainlevée,
          urlAppelOffre: appelOffreDetails.cahiersDesChargesUrl,
        }
      : undefined,
    historiqueMainlevée: historiqueMainlevéeExistant
      ? {
          historique: historiqueMainlevéeExistant.historique.map((mainlevée) => ({
            motif: mainlevée.motif.motif,
            demande: {
              date: mainlevée.demande.demandéeLe.formatter(),
              par: mainlevée.demande.demandéePar.formatter(),
            },
            rejet: {
              date: mainlevée.rejet.rejetéLe.formatter(),
              par: mainlevée.rejet.rejetéPar.formatter(),
              courrierRejet: mainlevée.rejet.courrierRejet.formatter(),
            },
          })),
          actions: actions.historiqueMainlevée,
        }
      : undefined,
    infoBoxMainlevée: {
      afficher: Boolean(
        utilisateur.role.estÉgaleÀ(Role.porteur) &&
          !mainlevéeExistante &&
          !gfActuellesExistante?.garantiesFinancières.statut.estÉchu(),
      ),
      actions:
        statut !== 'abandonné' && !achèvementExistant?.attestation
          ? 'transmettre-attestation-conformité'
          : undefined,
    },
  };
};

type MapGarantiesFinancièrestoProps = {
  garantiesFinancières: GarantiesFinancières.GarantiesFinancièresReadModel;
};

const mapGarantiesFinancièrestoProps = ({
  garantiesFinancières,
}: MapGarantiesFinancièrestoProps) => ({
  type: getGarantiesFinancièresTypeLabel(garantiesFinancières.type.type),
  statut: garantiesFinancières.statut.statut,
  dateÉchéance: garantiesFinancières.dateÉchéance?.formatter(),
  dateConstitution: garantiesFinancières.dateConstitution?.formatter(),
  soumisLe: garantiesFinancières.soumisLe?.formatter(),
  validéLe: garantiesFinancières.validéLe?.formatter(),
  attestation: garantiesFinancières.attestation?.formatter(),
  dernièreMiseÀJour: {
    date: garantiesFinancières.dernièreMiseÀJour.date.formatter(),
    par: garantiesFinancières.dernièreMiseÀJour.par?.formatter(),
  },
});
