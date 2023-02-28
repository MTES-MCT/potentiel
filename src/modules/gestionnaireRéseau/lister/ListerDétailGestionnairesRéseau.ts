import { ConsulterGestionnaireRéseauReadModel } from '../consulter';

export type ListeDétailGestionnairesRéseauReadModel = Array<ConsulterGestionnaireRéseauReadModel>;

export type ListerDétailGestionnairesRéseauQueryHandler =
  () => Promise<ListeDétailGestionnairesRéseauReadModel>;
