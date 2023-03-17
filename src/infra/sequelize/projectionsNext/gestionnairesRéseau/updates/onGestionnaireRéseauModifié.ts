import { GestionnaireRéseau } from '../gestionnairesRéseau.model';
import { GestionnaireRéseauProjector } from '../gestionnaireRéseau.projector';
import { BaseDomainEvent, DomainEvent } from '@core/domain';

/**
 * @deprecated do not use this event, we gonna delete it soon. It's here only for compatibility with the DomainEvent classes !!!
 */
export class GestionnaireRéseauModifié
  extends BaseDomainEvent<{
    streamId: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
  }>
  implements DomainEvent
{
  public static type: 'GestionnaireRéseauModifié' = 'GestionnaireRéseauModifié';
  public type = GestionnaireRéseauModifié.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: {
    streamId: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
  }) {
    return payload.streamId;
  }
}

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
