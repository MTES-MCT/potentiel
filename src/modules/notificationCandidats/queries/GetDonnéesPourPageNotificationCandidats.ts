import { Project } from '../../../entities/project';
import { FiltreListeProjets, ProjectListItem } from "../../project/queries";
import { PaginatedList, Pagination } from "../../pagination";

export const PermissionListerProjetsÀNotifier = {
  nom: 'lister-projets-à-notifier',
  description: 'Lister les projets à notifier',
};

export type ListerProjetsNonNotifiés = (args: {
  pagination: Pagination;
  filtres?: FiltreListeProjets;
}) => Promise<PaginatedList<ProjectListItem>>;

export type GetDonnéesPourPageNotificationCandidats = (args: {
  pagination: Pagination;
  appelOffreId?: Project['appelOffreId'];
  periodeId?: Project['periodeId'];
  recherche?: string;
  classement?: 'classés' | 'éliminés';
}) => Promise<{
  listeAOs: Project['appelOffreId'][];
  AOSélectionné: Project['appelOffreId'];
  listePériodes: Project['periodeId'][];
  périodeSélectionnée: Project['periodeId'];
  projetsPériodeSélectionnée: PaginatedList<ProjectListItem>;
} | null>;
