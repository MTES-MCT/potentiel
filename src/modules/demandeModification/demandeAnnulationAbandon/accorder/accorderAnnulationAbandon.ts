import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain';
import { errAsync } from '@core/utils';
import { User } from '@entities';
import { GetProjectAppelOffre } from '@modules/projectAppelOffre/queries';
import { DemandeAnnulationAbandon } from '../DemandeAnnulationAbandon';
import { Project } from '@modules/project';
import { StatutDemandeIncompatibleAvecAccordAnnulationAbandonError } from './StatutDemandeIncompatibleAvecAccordAnnulationAbandonError';
import { StatutProjetIncompatibleAvecAccordAnnulationAbandonError } from './StatutProjetIncompatibleAvecAccordAnnulationAbandonError';
import { CDCProjetIncompatibleAvecAccordAnnulationAbandonError } from './CDCProjetIncompatibleAvecAccordAnnulationAbandonError';
import { AnnulationAbandonAccordée } from '../events';
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file';
import { InfraNotAvailableError } from '@modules/shared';

type Commande = {
  utilisateur: User;
  demandeId: string;
  fichierRéponse: { contents: FileContents; filename: string };
};

type Dépendances = {
  demandeAnnulationAbandonRepo: TransactionalRepository<DemandeAnnulationAbandon> &
    Repository<DemandeAnnulationAbandon>;
  publishToEventStore: EventStore['publish'];
  getProjectAppelOffre: GetProjectAppelOffre;
  projectRepo: Repository<Project>;
  fileRepo: Repository<FileObject>;
};

export const makeAccorderAnnulationAbandon =
  ({
    demandeAnnulationAbandonRepo,
    publishToEventStore,
    getProjectAppelOffre,
    projectRepo,
    fileRepo,
  }: Dépendances) =>
  ({ utilisateur, demandeId, fichierRéponse }: Commande) =>
    demandeAnnulationAbandonRepo.load(new UniqueEntityID(demandeId)).andThen((demande) => {
      const { projetId } = demande;
      return projectRepo.load(new UniqueEntityID(projetId)).andThen((projet) => {
        if (projet.abandonedOn === 0) {
          return errAsync(
            new StatutProjetIncompatibleAvecAccordAnnulationAbandonError(projet.id.toString()),
          );
        }

        return demandeAnnulationAbandonRepo.transaction(
          new UniqueEntityID(demandeId),
          (demande) => {
            if (demande.statut !== 'envoyée') {
              return errAsync(
                new StatutDemandeIncompatibleAvecAccordAnnulationAbandonError(demande.statut),
              );
            }
            const appelOffre = getProjectAppelOffre({ ...projet });

            if (!appelOffre) {
              return errAsync(new InfraNotAvailableError());
            }

            const cahierDesCharges = appelOffre.cahiersDesChargesModifiésDisponibles.find(
              (cdc) =>
                cdc.type === projet.cahierDesCharges.type &&
                cdc.paruLe === projet.cahierDesCharges.paruLe &&
                cdc.alternatif === projet.cahierDesCharges.alternatif,
            );

            if (!cahierDesCharges) {
              return errAsync(new InfraNotAvailableError());
            }

            if (cahierDesCharges.type === 'modifié' && !cahierDesCharges.délaiAnnulationAbandon) {
              return errAsync(
                new CDCProjetIncompatibleAvecAccordAnnulationAbandonError(projet.id.toString()),
              );
            }
            return makeAndSaveFile({
              file: {
                designation: 'modification-request-response',
                forProject: projet.id,
                createdBy: new UniqueEntityID(utilisateur.id),
                filename: fichierRéponse.filename,
                contents: fichierRéponse.contents,
              },
              fileRepo,
            }).andThen((fichierRéponseId) =>
              publishToEventStore(
                new AnnulationAbandonAccordée({
                  payload: {
                    accordéPar: utilisateur.id,
                    projetId: projet.id.toString(),
                    demandeId,
                    fichierRéponseId,
                  },
                }),
              ),
            );
          },
        );
      });
    });
