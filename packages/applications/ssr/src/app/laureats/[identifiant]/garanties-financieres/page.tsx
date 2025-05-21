import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Abandon, GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Accès, Lauréat } from '@potentiel-domain/projet';

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
import { récupérerLauréat } from '@/app/_helpers';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';

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
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      await récupérerLauréat(identifiantProjet.formatter());

      const { appelOffres } = await getPériodeAppelOffres(identifiantProjet);
      const soumisAuxGarantiesFinancières =
        await projetSoumisAuxGarantiesFinancières(identifiantProjet);

      if (!soumisAuxGarantiesFinancières) {
        return (
          <ProjetNonSoumisAuxGarantiesFinancièresPage
            identifiantProjet={identifiantProjet.formatter()}
          />
        );
      }

      const garantiesFinancièresActuelles =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet.formatter() },
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
            data: { identifiantProjetValue: identifiantProjet.formatter() },
          })
        : Option.none;

      const dépôtEnCoursGarantiesFinancières =
        await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet.formatter() },
        });

      const achèvement =
        await mediator.send<Lauréat.Achèvement.ConsulterAttestationConformitéQuery>({
          type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
          data: { identifiantProjetValue: identifiantProjet.formatter() },
        });

      const mainlevéesList = await mediator.send<GarantiesFinancières.ListerMainlevéesQuery>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const accèsProjet = await mediator.send<Accès.ConsulterAccèsQuery>({
        type: 'Projet.Accès.Query.ConsulterAccès',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

      const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'Lauréat.Abandon.Query.ConsulterAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const props = mapToProps({
        identifiantProjet: identifiantProjet.formatter(),
        utilisateur,
        garantiesFinancièresActuelles,
        dépôtEnCoursGarantiesFinancières,
        achèvement,
        appelOffres,
        mainlevée: mainlevéesList.items.filter(
          (item) =>
            !item.statut.estÉgaleÀ(GarantiesFinancières.StatutMainlevéeGarantiesFinancières.rejeté),
        ),
        historiqueMainlevée: mainlevéesList.items.filter((item) =>
          item.statut.estÉgaleÀ(GarantiesFinancières.StatutMainlevéeGarantiesFinancières.rejeté),
        ),
        estAbandonné: Option.isSome(abandon) && abandon.statut.estAccordé(),
        contactPorteurs: Option.match(accèsProjet)
          .some(({ utilisateursAyantAccès }) =>
            utilisateursAyantAccès.map((porteur) => porteur.email),
          )
          .none(() => []),
        archivesGarantiesFinancières,
      });

      return (
        <DétailsGarantiesFinancièresPage
          identifiantProjet={identifiantProjet.formatter()}
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
  achèvement: Option.Type<Lauréat.Achèvement.ConsulterAttestationConformitéReadModel>;
  mainlevée: GarantiesFinancières.ListerMainlevéesReadModel['items'];
  appelOffres: AppelOffre.AppelOffreReadModel;
  historiqueMainlevée: GarantiesFinancières.ListerMainlevéesReadModel['items'];
  estAbandonné: boolean;
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
  appelOffres,
  historiqueMainlevée,
  estAbandonné,
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

  const mainlevéeEnCours = mainlevée.length ? mainlevée[0] : undefined;

  const historiqueMainlevéeExistant = historiqueMainlevée.length ? historiqueMainlevée : undefined;

  const achèvementExistant = Option.isSome(achèvement) ? achèvement : undefined;

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
          mainlevée: mainlevéeEnCours,
          estAbandonné,
        })
      : [],
    mainlevée: getMainlevéeActions({ role: utilisateur.role, mainlevée: mainlevéeEnCours }),
    historiqueMainlevée: getHistoriqueMainlevéeRejetéesActions({
      role: utilisateur.role,
      mainlevée: mainlevéeEnCours,
      historiqueMainlevéeRejetée: historiqueMainlevéeExistant,
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
      !dépôtExistant && !mainlevéeEnCours && utilisateur.role.estÉgaleÀ(Role.porteur)
        ? 'soumettre'
        : undefined,
    infoBoxGarantiesFinancières: {
      afficher: Boolean(
        !mainlevéeEnCours && utilisateur.role.estÉgaleÀ(Role.porteur) && gfActuellesExistante,
      ),
    },
    mainlevée: mainlevéeEnCours
      ? {
          motif: mainlevéeEnCours.motif.motif,
          statut: mainlevéeEnCours.statut.statut,
          demande: {
            date: mainlevéeEnCours.demande.demandéeLe.formatter(),
            par: mainlevéeEnCours.demande.demandéePar.formatter(),
          },
          ...(mainlevéeEnCours.instruction && {
            instruction: {
              date: mainlevéeEnCours.instruction?.démarréeLe.formatter(),
              par: mainlevéeEnCours.instruction?.démarréePar.formatter(),
            },
          }),
          ...(mainlevéeEnCours.accord && {
            accord: {
              date: mainlevéeEnCours.accord?.accordéeLe.formatter(),
              par: mainlevéeEnCours.accord?.accordéePar.formatter(),
              courrierAccord: mainlevéeEnCours.accord?.courrierAccord.formatter(),
            },
          }),
          dernièreMiseÀJour: {
            date: mainlevéeEnCours.dernièreMiseÀJour.date.formatter(),
            par: mainlevéeEnCours.dernièreMiseÀJour.par.formatter(),
          },
          actions: actions.mainlevée,
          urlAppelOffre: appelOffres.cahiersDesChargesUrl,
        }
      : undefined,
    historiqueMainlevée: historiqueMainlevéeExistant
      ? {
          historique: historiqueMainlevéeExistant.map((mainlevée) => ({
            motif: mainlevée.motif.motif,
            demande: {
              date: mainlevée.demande.demandéeLe.formatter(),
              par: mainlevée.demande.demandéePar.formatter(),
            },
            rejet: {
              date: mainlevée.rejet!.rejetéLe.formatter(),
              par: mainlevée.rejet!.rejetéPar.formatter(),
              courrierRejet: mainlevée.rejet!.courrierRejet.formatter(),
            },
          })),
          actions: actions.historiqueMainlevée,
        }
      : undefined,
    infoBoxMainlevée: {
      afficher: Boolean(
        utilisateur.role.estÉgaleÀ(Role.porteur) &&
          !mainlevéeEnCours &&
          !gfActuellesExistante?.garantiesFinancières.statut.estÉchu(),
      ),
      actions:
        !estAbandonné && !achèvementExistant?.attestation
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
