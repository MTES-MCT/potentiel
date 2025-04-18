import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  removeProjection,
  upsertProjection,
  updateManyProjections,
} from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Where } from '@potentiel-domain/entity';
import { Candidature } from '@potentiel-domain/projet';
import { Raccordement } from '@potentiel-domain/laureat';

export type SubscriptionEvent = (Raccordement.RaccordementEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Réseau.Raccordement', SubscriptionEvent>;

export type DossierRaccordement = Omit<Raccordement.DossierRaccordementEntity, 'type'>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeRaccordementProjections(event.payload.id);
    } else {
      const identifiantProjet = payload.identifiantProjet;
      const misÀJourLe = DateTime.convertirEnValueType(event.created_at).formatter();

      const raccordement = await getRaccordementToUpsert(identifiantProjet);

      if (
        type === 'GestionnaireRéseauRaccordementModifié-V1' ||
        type === 'GestionnaireRéseauInconnuAttribué-V1' ||
        type === 'GestionnaireRéseauAttribué-V1'
      ) {
        const identifiantGestionnaireRéseau =
          type === 'GestionnaireRéseauInconnuAttribué-V1'
            ? GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.formatter()
            : payload.identifiantGestionnaireRéseau;
        await upsertProjection<Raccordement.RaccordementEntity>(
          `raccordement|${event.payload.identifiantProjet}`,
          {
            ...raccordement,
            dossiers: raccordement.dossiers.map((dossier) => ({
              ...dossier,
              identifiantGestionnaireRéseau,
            })),
            identifiantGestionnaireRéseau,
          },
        );

        await updateManyProjections<Raccordement.DossierRaccordementEntity>(
          'dossier-raccordement',
          { identifiantProjet: Where.equal(identifiantProjet) },
          { identifiantGestionnaireRéseau },
        );
      } else if (
        event.type === 'DemandeComplèteDeRaccordementTransmise-V1' ||
        event.type === 'DemandeComplèteDeRaccordementTransmise-V2'
      ) {
        const référence = event.payload.référenceDossierRaccordement;

        const candidature = await findProjection<Candidature.CandidatureEntity>(
          `candidature|${identifiantProjet}`,
        );

        const projetNotifiéLe = Option.match(candidature)
          .some((candidature) =>
            candidature.estNotifiée ? candidature.notification.notifiéeLe : undefined,
          )
          .none(() => undefined);
        const dossier: DossierRaccordement = (() => {
          switch (event.type) {
            case 'DemandeComplèteDeRaccordementTransmise-V1':
              return {
                identifiantProjet,
                identifiantGestionnaireRéseau: event.payload.identifiantGestionnaireRéseau,
                référence,
                demandeComplèteRaccordement: {
                  dateQualification: event.payload.dateQualification,
                },
                projetNotifiéLe,
                misÀJourLe,
              };
            case 'DemandeComplèteDeRaccordementTransmise-V2':
              return {
                identifiantProjet,
                identifiantGestionnaireRéseau: event.payload.identifiantGestionnaireRéseau,
                référence,
                demandeComplèteRaccordement: {
                  dateQualification: event.payload.dateQualification,
                  accuséRéception: {
                    format: event.payload.accuséRéception.format,
                  },
                },
                projetNotifiéLe,
                misÀJourLe,
              };
          }
        })();

        await upsertProjection<Raccordement.RaccordementEntity>(
          `raccordement|${event.payload.identifiantProjet}`,
          {
            ...raccordement,
            identifiantGestionnaireRéseau: event.payload.identifiantGestionnaireRéseau,
            dossiers: [dossier, ...raccordement.dossiers],
          },
        );

        await upsertProjection<Raccordement.DossierRaccordementEntity>(
          `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
          dossier,
        );
      } else if (event.type === 'DossierDuRaccordementSupprimé-V1') {
        const { identifiantProjet, référenceDossier } = event.payload;

        const raccordement = await findProjection<Raccordement.RaccordementEntity>(
          `raccordement|${identifiantProjet}`,
        );

        if (Option.isSome(raccordement)) {
          const dossiersMisÀJour = raccordement.dossiers.filter(
            (dossier) => dossier.référence !== référenceDossier,
          );

          await upsertProjection<Raccordement.RaccordementEntity>(
            `raccordement|${identifiantProjet}`,
            {
              ...raccordement,
              dossiers: dossiersMisÀJour,
            },
          );
          await removeProjection<Raccordement.DossierRaccordementEntity>(
            `dossier-raccordement|${identifiantProjet}#${référenceDossier}`,
          );
        }
      } else if (event.type === 'RaccordementSupprimé-V1') {
        const { identifiantProjet } = event.payload;

        const raccordement = await findProjection<Raccordement.RaccordementEntity>(
          `raccordement|${identifiantProjet}`,
        );

        if (Option.isSome(raccordement)) {
          const référencesDossiers = raccordement.dossiers.map((d) => d.référence);

          for (const référence of référencesDossiers) {
            await removeProjection<Raccordement.DossierRaccordementEntity>(
              `dossier-raccordement|${identifiantProjet}#${référence}`,
            );
          }
          await removeProjection<Raccordement.RaccordementEntity>(
            `raccordement|${identifiantProjet}`,
          );
        }
      } else {
        const référence = match(event)
          .with(
            { type: 'DemandeComplèteRaccordementModifiée-V1' },
            ({ payload }) => payload.referenceActuelle,
          )
          .with(
            P.union(
              { type: 'RéférenceDossierRacordementModifiée-V1' },
              { type: 'RéférenceDossierRacordementModifiée-V2' },
            ),
            ({ payload }) => payload.référenceDossierRaccordementActuelle,
          )
          .otherwise(({ payload }) => payload.référenceDossierRaccordement);

        const dossier = raccordement.dossiers.find((d) => d.référence === référence);

        if (dossier) {
          const updatedDossier: DossierRaccordement = (() => {
            switch (event.type) {
              case 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1':
                return {
                  ...dossier,
                  demandeComplèteRaccordement: {
                    ...dossier.demandeComplèteRaccordement,
                    accuséRéception: {
                      format: event.payload.format,
                    },
                  },
                  misÀJourLe,
                };
              case 'DateMiseEnServiceTransmise-V1':
              case 'DateMiseEnServiceTransmise-V2':
                return {
                  ...dossier,
                  miseEnService: {
                    dateMiseEnService: event.payload.dateMiseEnService,
                    transmiseLe:
                      event.type === 'DateMiseEnServiceTransmise-V2'
                        ? event.payload.transmiseLe
                        : misÀJourLe,
                    tranmisePar:
                      event.type === 'DateMiseEnServiceTransmise-V2'
                        ? event.payload.transmisePar
                        : undefined,
                  },
                  misÀJourLe,
                };
              case 'DemandeComplèteRaccordementModifiée-V1':
                return {
                  ...dossier,
                  référence: event.payload.nouvelleReference,
                  demandeComplèteRaccordement: {
                    ...dossier.demandeComplèteRaccordement,
                    dateQualification: event.payload.dateQualification,
                  },
                  misÀJourLe,
                };
              case 'DemandeComplèteRaccordementModifiée-V2':
                return {
                  ...dossier,
                  demandeComplèteRaccordement: {
                    ...dossier.demandeComplèteRaccordement,
                    dateQualification: event.payload.dateQualification,
                  },
                  misÀJourLe,
                };
              case 'DemandeComplèteRaccordementModifiée-V3':
                return {
                  ...dossier,
                  demandeComplèteRaccordement: {
                    ...dossier.demandeComplèteRaccordement,
                    dateQualification: event.payload.dateQualification,
                    accuséRéception: {
                      format: event.payload.accuséRéception.format,
                    },
                  },
                  misÀJourLe,
                };
              case 'PropositionTechniqueEtFinancièreModifiée-V1':
                return {
                  ...dossier,
                  propositionTechniqueEtFinancière: {
                    dateSignature: event.payload.dateSignature,
                    propositionTechniqueEtFinancièreSignée: {
                      format:
                        dossier.propositionTechniqueEtFinancière
                          ?.propositionTechniqueEtFinancièreSignée?.format || '',
                    },
                  },
                  misÀJourLe,
                };
              case 'PropositionTechniqueEtFinancièreModifiée-V2':
                return {
                  ...dossier,
                  propositionTechniqueEtFinancière: {
                    dateSignature: event.payload.dateSignature,
                    propositionTechniqueEtFinancièreSignée: {
                      format: event.payload.propositionTechniqueEtFinancièreSignée.format,
                    },
                  },
                  misÀJourLe,
                };
              case 'PropositionTechniqueEtFinancièreSignéeTransmise-V1':
                return {
                  ...dossier,
                  propositionTechniqueEtFinancière: {
                    dateSignature: dossier.propositionTechniqueEtFinancière?.dateSignature || '',
                    propositionTechniqueEtFinancièreSignée: {
                      format: event.payload.format,
                    },
                  },
                  misÀJourLe,
                };
              case 'PropositionTechniqueEtFinancièreTransmise-V1':
                return {
                  ...dossier,
                  propositionTechniqueEtFinancière: {
                    dateSignature: event.payload.dateSignature,
                    propositionTechniqueEtFinancièreSignée: {
                      format: '',
                    },
                  },
                  misÀJourLe,
                };
              case 'PropositionTechniqueEtFinancièreTransmise-V2':
                return {
                  ...dossier,
                  propositionTechniqueEtFinancière: {
                    dateSignature: event.payload.dateSignature,
                    propositionTechniqueEtFinancièreSignée: {
                      format: event.payload.propositionTechniqueEtFinancièreSignée.format,
                    },
                  },
                  misÀJourLe,
                };
              case 'RéférenceDossierRacordementModifiée-V1':
              case 'RéférenceDossierRacordementModifiée-V2':
                return {
                  ...dossier,
                  référence: event.payload.nouvelleRéférenceDossierRaccordement,
                  misÀJourLe,
                };
            }
          })();

          await upsertProjection<Raccordement.RaccordementEntity>(
            `raccordement|${event.payload.identifiantProjet}`,
            {
              ...raccordement,
              dossiers: [
                updatedDossier,
                ...raccordement.dossiers.filter((d) => d.référence !== référence),
              ],
            },
          );

          if (
            event.type === 'DemandeComplèteRaccordementModifiée-V1' ||
            event.type === 'RéférenceDossierRacordementModifiée-V1' ||
            event.type === 'RéférenceDossierRacordementModifiée-V2'
          ) {
            await removeProjection<Raccordement.DossierRaccordementEntity>(
              `dossier-raccordement|${event.payload.identifiantProjet}#${référence}`,
            );
          }

          await upsertProjection<Raccordement.DossierRaccordementEntity>(
            `dossier-raccordement|${event.payload.identifiantProjet}#${updatedDossier.référence}`,
            updatedDossier,
          );
        } else {
          getLogger().warn('[PROJECTOR] - Event skipped: Dossier inconnu', {
            event,
          });
        }
      }
    }
  };

  mediator.register('System.Projector.Réseau.Raccordement', handler);
};

const removeRaccordementProjections = async (identifiantProjet: string) => {
  const raccordement = await findProjection<Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  if (!Option.isNone(raccordement)) {
    for (const référence of raccordement.dossiers.map((d) => d.référence)) {
      await removeProjection<Raccordement.DossierRaccordementEntity>(
        `dossier-raccordement|${identifiantProjet}#${référence}`,
      );
    }

    await removeProjection<Raccordement.RaccordementEntity>(`raccordement|${identifiantProjet}`);
  }
};

const getRaccordementToUpsert = async (
  identifiantProjet: IdentifiantProjet.RawType,
): Promise<Omit<Raccordement.RaccordementEntity, 'type'>> => {
  const raccordement = await findProjection<Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  const raccordementDefaultValue: Omit<Raccordement.RaccordementEntity, 'type'> = {
    identifiantProjet,
    dossiers: [],
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.formatter(),
  };

  return Option.isSome(raccordement) ? raccordement : raccordementDefaultValue;
};
