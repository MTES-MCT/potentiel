import { TâcheMiseAJourDatesMiseEnServiceTerminée } from '@modules/imports/gestionnaireRéseau/events'
import { resetDatabase } from '../../../helpers'
import { Tâches } from '../tâches.model'
import onTâcheMiseAJourDatesMiseEnServiceTerminée from './onTâcheMiseAJourDatesMiseEnServiceTerminée'

describe('Handler onTâcheMiseAJourDatesMiseEnServiceTerminée', () => {
  const occurredAt = new Date('2022-01-05')
  const gestionnaire = 'Enedis'

  beforeEach(async () => {
    await resetDatabase()
  })

  it(`Étant donnée une tâche 'en cours' de mise a jour de date de mise en service avec :
        - le gestionnaire Enedis
        - la date de début au 2022-01-05
      Lorsque un évènement de type 'TâcheMiseAJourDatesMiseEnServiceTerminée' survient avec 
        - le gestionnaire Enedis
      Alors la tâche devrait être 'terminée' avec :
        - une date de fin, 
        - et le détail`, async () => {
    await Tâches.create({
      id: 1,
      type: 'maj-date-mise-en-service',
      gestionnaire,
      état: 'en cours',
      dateDeDébut: new Date(),
    })

    await onTâcheMiseAJourDatesMiseEnServiceTerminée(
      new TâcheMiseAJourDatesMiseEnServiceTerminée({
        payload: {
          gestionnaire,
          résultat: [
            { identifiantGestionnaireRéseau: 'Enedis', état: 'succès', projetId: 'projet-id' },
            { identifiantGestionnaireRéseau: 'Enedis', état: 'succès', projetId: 'projet-id' },
            { identifiantGestionnaireRéseau: 'Enedis', état: 'échec', raison: 'raison' },
            {
              identifiantGestionnaireRéseau: 'Enedis',
              état: 'échec',
              projetId: 'projet-1',
              raison: 'raison',
            },
            {
              identifiantGestionnaireRéseau: 'Enedis',
              état: 'ignoré',
              projetId: 'projet-2',
              raison: 'raison',
            },
          ],
        },
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const tâche = await Tâches.findOne({
      where: {
        id: 1,
      },
    })

    expect(tâche).not.toBeNull()
    expect(tâche).toMatchObject({
      état: 'terminée',
      dateDeFin: occurredAt,
      résultat: {
        succès: [
          { identifiantGestionnaireRéseau: 'Enedis', projetId: 'projet-id' },
          { identifiantGestionnaireRéseau: 'Enedis', projetId: 'projet-id' },
        ],
        ignorés: [
          {
            identifiantGestionnaireRéseau: 'Enedis',
            projetId: 'projet-2',
            raison: 'raison',
          },
        ],
        erreurs: [
          { identifiantGestionnaireRéseau: 'Enedis', raison: 'raison' },
          {
            identifiantGestionnaireRéseau: 'Enedis',
            projetId: 'projet-1',
            raison: 'raison',
          },
        ],
      },
    })
  })

  it(`Étant donnée une tâche 'en cours' de mise a jour de date de mise en service avec :
        - le gestionnaire Enedis
        - la date de début au 2022-01-05
        Et une autre tâche 'en cours' de mise a jour de date de mise en service avec :
        - le gestionnaire 'autre-gestionnaire'
        - la date de début au 2022-01-05
      Lorsque un évènement de type 'TâcheMiseAJourDatesMiseEnServiceTerminée' survient avec 
        - le gestionnaire Enedis
      Alors seulement la tâche du gestionnaire Enedis devrait être 'terminée' avec :
        - une date de fin, 
        - et le détail`, async () => {
    await Tâches.bulkCreate([
      {
        id: 1,
        type: 'maj-date-mise-en-service',
        gestionnaire,
        état: 'en cours',
        dateDeDébut: new Date('2022-01-05'),
      },
      {
        id: 2,
        type: 'maj-date-mise-en-service',
        gestionnaire: 'autre-gestionnaire',
        état: 'en cours',
        dateDeDébut: new Date('2022-01-05'),
      },
    ])

    await onTâcheMiseAJourDatesMiseEnServiceTerminée(
      new TâcheMiseAJourDatesMiseEnServiceTerminée({
        payload: {
          gestionnaire,
          résultat: [
            { identifiantGestionnaireRéseau: 'Enedis', état: 'succès', projetId: 'projet-id' },
            { identifiantGestionnaireRéseau: 'Enedis', état: 'succès', projetId: 'projet-id' },
            { identifiantGestionnaireRéseau: 'Enedis', état: 'échec', raison: 'raison' },
            {
              identifiantGestionnaireRéseau: 'Enedis',
              état: 'échec',
              projetId: 'projet-1',
              raison: 'raison',
            },
            {
              identifiantGestionnaireRéseau: 'Enedis',
              état: 'ignoré',
              projetId: 'projet-2',
              raison: 'raison',
            },
          ],
        },
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const tâcheEnedis = await Tâches.findOne({
      where: {
        id: 1,
      },
    })
    expect(tâcheEnedis).toMatchObject({
      état: 'terminée',
      dateDeFin: occurredAt,
      résultat: {
        succès: [
          { identifiantGestionnaireRéseau: 'Enedis', projetId: 'projet-id' },
          { identifiantGestionnaireRéseau: 'Enedis', projetId: 'projet-id' },
        ],
        ignorés: [
          {
            identifiantGestionnaireRéseau: 'Enedis',
            projetId: 'projet-2',
            raison: 'raison',
          },
        ],
        erreurs: [
          { identifiantGestionnaireRéseau: 'Enedis', raison: 'raison' },
          {
            identifiantGestionnaireRéseau: 'Enedis',
            projetId: 'projet-1',
            raison: 'raison',
          },
        ],
      },
    })

    const tâcheAutreGestionnaire = await Tâches.findOne({
      where: {
        id: 2,
      },
    })
    expect(tâcheAutreGestionnaire).toMatchObject({
      état: 'en cours',
    })
  })
})
