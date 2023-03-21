import { GestionnaireRéseau } from '../gestionnairesRéseau.model';
import { GestionnaireRéseauProjector } from '../gestionnaireRéseau.projector';
import { GestionnaireRéseauModifié } from './gestionnaireRéseauModifié.deprecated';

export default GestionnaireRéseauProjector.on(
  GestionnaireRéseauModifié,
  async (évènement, transaction) => {
    const {
      payload: {
        streamId,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement: { format, légende },
      },
    } = évènement;

    const [, codeEIC] = streamId.split('#');
    await GestionnaireRéseau.update(
      { format, légende, raisonSociale },
      {
        where: {
          codeEIC,
        },
        transaction,
      },
    );
  },
);
