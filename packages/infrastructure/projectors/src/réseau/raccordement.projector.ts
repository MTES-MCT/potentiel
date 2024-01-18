import { Raccordement } from '@potentiel-domain/reseau';
import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Message, MessageHandler, mediator } from 'mediateur';
import { removeProjection } from '../utils/removeProjection';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { isNone, isSome } from '@potentiel/monads';
import { IdentifiantGestionnaireRéseau } from '@potentiel-domain/reseau/src/gestionnaire';
import { upsertProjection } from '../utils/upsertProjection';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel/monitoring';

export type SubscriptionEvent = (Raccordement.RaccordementEvent & Event) | RebuildTriggered;

export type Execute = Message<'EXECUTE_RACCORDEMENT_PROJECTOR', SubscriptionEvent>;

export type DossierRaccordement = Omit<Raccordement.DossierRaccordementEntity, 'type'>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeRaccordementProjections(event.payload.id);
    } else {
      const identifiantProjet = payload.identifiantProjet;

      const raccordement = await getRaccordementToUpsert(identifiantProjet);

      if (event.type === 'GestionnaireRéseauRaccordementModifié-V1') {
        await upsertProjection(`raccordement|${event.payload.identifiantProjet}`, {
          ...raccordement,
          identifiantGestionnaireRéseau: event.payload.identifiantGestionnaireRéseau,
        });
      } else if (
        event.type === 'DemandeComplèteDeRaccordementTransmise-V1' ||
        event.type === 'DemandeComplèteDeRaccordementTransmise-V2'
      ) {
        const référence = event.payload.référenceDossierRaccordement;

        const dossier: DossierRaccordement = (() => {
          switch (event.type) {
            case 'DemandeComplèteDeRaccordementTransmise-V1':
              return {
                référence,
                demandeComplèteRaccordement: {
                  dateQualification: event.payload.dateQualification,
                },
                misÀJourLe: event.created_at,
              };
            case 'DemandeComplèteDeRaccordementTransmise-V2':
              return {
                référence,
                demandeComplèteRaccordement: {
                  dateQualification: event.payload.dateQualification,
                  accuséRéception: {
                    format: event.payload.accuséRéception.format,
                  },
                },
                misÀJourLe: event.created_at,
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

        await upsertProjection<Raccordement.RéférenceRaccordementIdentifiantProjetEntity>(
          `référence-raccordement-projet|${event.payload.référenceDossierRaccordement}`,
          {
            identifiantProjet: event.payload.identifiantProjet,
            référence: event.payload.référenceDossierRaccordement,
          },
        );
      } else {
        const référence =
          event.type === 'DemandeComplèteRaccordementModifiée-V1'
            ? event.payload.referenceActuelle
            : event.type === 'RéférenceDossierRacordementModifiée-V1'
            ? event.payload.référenceDossierRaccordementActuelle
            : event.payload.référenceDossierRaccordement;

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
                  misÀJourLe: event.created_at,
                };
              case 'DateMiseEnServiceTransmise-V1':
                return {
                  ...dossier,
                  miseEnService: {
                    dateMiseEnService: event.payload.dateMiseEnService,
                  },
                  misÀJourLe: event.created_at,
                };
              case 'DemandeComplèteRaccordementModifiée-V1':
                return {
                  ...dossier,
                  référence: event.payload.nouvelleReference,
                  demandeComplèteRaccordement: {
                    ...dossier.demandeComplèteRaccordement,
                    dateQualification: event.payload.dateQualification,
                  },
                  misÀJourLe: event.created_at,
                };
              case 'DemandeComplèteRaccordementModifiée-V2':
                return {
                  ...dossier,
                  demandeComplèteRaccordement: {
                    ...dossier.demandeComplèteRaccordement,
                    dateQualification: event.payload.dateQualification,
                  },
                  misÀJourLe: event.created_at,
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
                  misÀJourLe: event.created_at,
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
                  misÀJourLe: event.created_at,
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
                  misÀJourLe: event.created_at,
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
                  misÀJourLe: event.created_at,
                };
              case 'PropositionTechniqueEtFinancièreTransmise-V1':
                return {
                  ...dossier,
                  propositionTechniqueEtFinancière: {
                    dateSignature: event.payload.dateSignature,
                    format: '',
                  },
                  misÀJourLe: event.created_at,
                };
              case 'PropositionTechniqueEtFinancièreTransmise-V2':
                return {
                  ...dossier,
                  propositionTechniqueEtFinancière: {
                    dateSignature: event.payload.dateSignature,
                    format: event.payload.propositionTechniqueEtFinancièreSignée.format,
                  },
                  misÀJourLe: event.created_at,
                };
              case 'RéférenceDossierRacordementModifiée-V1':
                return {
                  ...dossier,
                  référence: event.payload.nouvelleRéférenceDossierRaccordement,
                  misÀJourLe: event.created_at,
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
            event.type === 'RéférenceDossierRacordementModifiée-V1'
          ) {
            await removeProjection(
              `dossier-raccordement|${event.payload.identifiantProjet}#${référence}`,
            );
            await removeProjection(`référence-raccordement-projet|${référence}`);
          }

          await upsertProjection<Raccordement.DossierRaccordementEntity>(
            `dossier-raccordement|${event.payload.identifiantProjet}#${updatedDossier.référence}`,
            updatedDossier,
          );

          await upsertProjection<Raccordement.RéférenceRaccordementIdentifiantProjetEntity>(
            `référence-raccordement-projet|${updatedDossier.référence}`,
            {
              identifiantProjet: event.payload.identifiantProjet,
              référence: updatedDossier.référence,
            },
          );
        } else {
          getLogger().warn('[PROJECTOR] - Event skipped: Dossier inconnu', {
            event,
          });
        }
      }
    }
  };

  mediator.register('EXECUTE_RACCORDEMENT_PROJECTOR', handler);
};

const removeRaccordementProjections = async (identifiantProjet: string) => {
  const raccordement = await findProjection<Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  if (!isNone(raccordement)) {
    for (const référence of raccordement.dossiers.map((d) => d.référence)) {
      await removeProjection<Raccordement.DossierRaccordementEntity>(
        `dossier-raccordement|${identifiantProjet}#${référence}`,
      );
      await removeProjection<Raccordement.RéférenceRaccordementIdentifiantProjetEntity>(
        `référence-raccordement-projet|${référence}`,
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
    nomProjet: '',
    appelOffre: '',
    période: '',
    famille: undefined,
    numéroCRE: '',
    dossiers: [],
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu.formatter(),
  };

  return isSome(raccordement) ? raccordement : raccordementDefaultValue;
};

function récupérerRéférence(
  event: Exclude<
    Raccordement.RaccordementEvent,
    Raccordement.GestionnaireRéseauRaccordementModifiéEvent
  >,
) {
  return event.type === 'DemandeComplèteRaccordementModifiée-V1'
    ? event.payload.referenceActuelle
    : event.type === 'RéférenceDossierRacordementModifiée-V1'
    ? event.payload.référenceDossierRaccordementActuelle
    : event.payload.référenceDossierRaccordement;
}
