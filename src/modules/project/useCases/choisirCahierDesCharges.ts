import { EventStore, Repository, UniqueEntityID } from '@core/domain';
import { errAsync, okAsync, ResultAsync, wrapInfra } from '@core/utils';
import {
  User,
  CahierDesChargesRéférenceParsed,
  AppelOffre,
  CahierDesChargesModifié,
} from '@entities';
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '../../shared';
import { CahierDesChargesChoisi } from '../events';
import { Project } from '../Project';
import { NouveauCahierDesChargesDéjàSouscrit } from '../errors/NouveauCahierDesChargesDéjàSouscrit';
import { AppelOffreRepo } from '@dataAccess';
import {
  CahierDesChargesNonDisponibleError,
  PasDeChangementDeCDCPourCetAOError,
  CahierDesChargesInitialNonDisponibleError,
} from '../errors';

type Commande = {
  projetId: string;
  utilisateur: User;
  cahierDesCharges: CahierDesChargesRéférenceParsed;
};

type ChoisirCahierDesCharges = (
  commande: Commande,
) => ResultAsync<
  null,
  | UnauthorizedError
  | InfraNotAvailableError
  | NouveauCahierDesChargesDéjàSouscrit
  | CahierDesChargesInitialNonDisponibleError
  | PasDeChangementDeCDCPourCetAOError
  | CahierDesChargesNonDisponibleError
>;

type MakeChoisirCahierDesCharges = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>;
  publishToEventStore: EventStore['publish'];
  projectRepo: Repository<Project>;
  findAppelOffreById: AppelOffreRepo['findById'];
}) => ChoisirCahierDesCharges;

export const makeChoisirCahierDesCharges: MakeChoisirCahierDesCharges = ({
  shouldUserAccessProject,
  publishToEventStore,
  projectRepo,
  findAppelOffreById,
}) => {
  const vérifierAccèsProjet = (commande: Commande) => {
    const { projetId, utilisateur } = commande;
    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: utilisateur })).andThen(
      (utilisateurALesDroits) =>
        utilisateurALesDroits ? okAsync(commande) : errAsync(new UnauthorizedError()),
    );
  };

  const chargerProjet = (commande: Commande) =>
    projectRepo
      .load(new UniqueEntityID(commande.projetId))
      .andThen((projet) => okAsync({ commande, projet }));

  const chargerAppelOffre = (arg: { commande: Commande; projet: Project }) =>
    wrapInfra(findAppelOffreById(arg.projet.appelOffreId)).andThen((appelOffre) =>
      appelOffre ? okAsync({ ...arg, appelOffre }) : errAsync(new EntityNotFoundError()),
    );

  const chargerCahierDesChargesChoisi = (arg: {
    commande: Commande;
    projet: Project;
    appelOffre: AppelOffre;
  }) => {
    const {
      commande: { cahierDesCharges },
      projet,
      appelOffre,
    } = arg;

    if (cahierDesCharges.type === 'initial') {
      return okAsync({ ...arg, cahierDesChargesChoisi: { type: 'initial' } });
    }

    const périodeDétails = appelOffre.periodes.find((période) => période.id === projet.periodeId);

    const cahiersDesChargesModifiésDisponibles =
      (périodeDétails && périodeDétails.cahiersDesChargesModifiésDisponibles) ||
      appelOffre.cahiersDesChargesModifiésDisponibles;

    if (cahiersDesChargesModifiésDisponibles.length === 0) {
      return errAsync(new PasDeChangementDeCDCPourCetAOError());
    }

    const cahierDesChargesModifié = cahiersDesChargesModifiésDisponibles.find(
      (c) => c.paruLe === cahierDesCharges.paruLe && c.alternatif === cahierDesCharges.alternatif,
    );

    return cahierDesChargesModifié
      ? okAsync({ ...arg, cahierDesChargesChoisi: cahierDesChargesModifié })
      : errAsync(new CahierDesChargesNonDisponibleError());
  };

  const vérifierSiPasDéjàSouscrit = (arg: {
    commande: Commande;
    projet: Project;
    appelOffre: AppelOffre;
    cahierDesChargesChoisi: CahierDesChargesModifié | { type: 'initial' };
  }) => {
    const { commande, projet } = arg;
    const { cahierDesCharges } = commande;

    const estDéjàSouscrit =
      cahierDesCharges.type === 'modifié' &&
      projet.cahierDesCharges.type === 'modifié' &&
      projet.cahierDesCharges.paruLe === cahierDesCharges.paruLe &&
      projet.cahierDesCharges.alternatif === cahierDesCharges.alternatif;

    return estDéjàSouscrit ? errAsync(new NouveauCahierDesChargesDéjàSouscrit()) : okAsync(arg);
  };

  const vérifierSiLInitialPeutÊtreChoisi = (arg: {
    commande: Commande;
    projet: Project;
    appelOffre: AppelOffre;
    cahierDesChargesChoisi: CahierDesChargesModifié | { type: 'initial' };
  }) => {
    const { commande, appelOffre } = arg;
    const { cahierDesCharges } = commande;

    if (cahierDesCharges.type === 'initial') {
      if (!appelOffre.doitPouvoirChoisirCDCInitial) {
        return errAsync(new CahierDesChargesInitialNonDisponibleError());
      }

      return okAsync(arg);
    }

    return okAsync(arg);
  };

  const enregistrerLeChoix = ({
    commande: { cahierDesCharges, projetId, utilisateur },
  }: {
    commande: Commande;
  }) =>
    publishToEventStore(
      cahierDesCharges.type === 'initial'
        ? new CahierDesChargesChoisi({
            payload: {
              projetId,
              choisiPar: utilisateur.id,
              type: 'initial',
            },
          })
        : new CahierDesChargesChoisi({
            payload: {
              projetId,
              choisiPar: utilisateur.id,
              type: 'modifié',
              paruLe: cahierDesCharges.paruLe,
              alternatif: cahierDesCharges.alternatif,
            },
          }),
    );

  return (commande) =>
    vérifierAccèsProjet(commande)
      .andThen(chargerProjet)
      .andThen(chargerAppelOffre)
      .andThen(chargerCahierDesChargesChoisi)
      .andThen(vérifierSiPasDéjàSouscrit)
      .andThen(vérifierSiLInitialPeutÊtreChoisi)
      .andThen(enregistrerLeChoix);
};
