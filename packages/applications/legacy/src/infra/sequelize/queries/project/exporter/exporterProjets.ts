import { ExporterProjets, FiltreListeProjets } from '../../../../../modules/project';
import { exporterProjetsPourDGEC } from './requêtes/exporterProjetsPourDGEC';
import { exporterProjetsPourCRE } from './requêtes/exporterProjetsPourCRE';
import { exporterProjetsPourCaisseDesDépôts } from './requêtes/exporterProjetsPourCaisseDesDépôts';
import { exporterProjetsPourPorteurDeProjet } from './requêtes/exporterProjetsPourPorteurDeProjet';
import { exporterProjetsPourDREAL } from './requêtes/exporterProjetsPourDREAL';
import { exporterProjetsPourADEME } from './requêtes/exporterProjetsPourADEME';
import { exporterProjetsPourCocontractant } from './requêtes/exporterProjetsPourCocontractant';
import { User } from '../../../../../entities';
import { UnauthorizedError } from '../../../../../modules/shared';
import { getProjetUtilisateurScopeAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Email } from '@potentiel-domain/common';
import { getLegacyProjetsIdsByIdentifiantsProjet } from '../getLegacyProjetByIdentifiantProjet';
import { IdentifiantProjet } from '@potentiel-domain/projet';

type ExporterProjetsProps = {
  user: User;
  filtres?: FiltreListeProjets;
};

export const exporterProjets: ExporterProjets = async ({ user, filtres }: ExporterProjetsProps) => {
  const scope = await getProjetUtilisateurScopeAdapter(Email.convertirEnValueType(user.email));
  switch (user.role) {
    case 'admin':
    case 'dgec-validateur':
      return exporterProjetsPourDGEC({ filtres });
    case 'cre':
      return exporterProjetsPourCRE({ filtres });
    case 'caisse-des-dépôts':
      return exporterProjetsPourCaisseDesDépôts({ filtres });
    case 'porteur-projet':
      const identifiantsProjets = scope.type === 'projet' ? scope.identifiantProjets : [];
      const projets = await getLegacyProjetsIdsByIdentifiantsProjet(
        identifiantsProjets.map(IdentifiantProjet.convertirEnValueType),
      );
      return exporterProjetsPourPorteurDeProjet({
        filtres: {
          ...filtres,
          projets,
        },
      });
    case 'dreal':
      return exporterProjetsPourDREAL({
        filtres: {
          ...filtres,
          régions: scope.type === 'région' ? scope.régions : [],
        },
      });
    case 'ademe':
      return exporterProjetsPourADEME({ filtres });
    case 'cocontractant':
      return exporterProjetsPourCocontractant({
        filtres: {
          ...filtres,
          régions: scope.type === 'région' ? scope.régions : [],
        },
      });
    default:
      throw new UnauthorizedError();
  }
};
