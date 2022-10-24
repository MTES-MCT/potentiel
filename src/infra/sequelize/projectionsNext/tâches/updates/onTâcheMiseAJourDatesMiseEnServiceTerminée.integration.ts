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
        - un nombre de succès
        - et un nombre d'échecs`, async () => {
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
      dateDeFin: occurredAt,
      nombreDeSucces: 2,
      nombreDEchecs: 1,
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
        - un nombre de succès
        - et un nombre d'échecs`, async () => {
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
      nombreDeSucces: 2,
      nombreDEchecs: 1,
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
