import { TâcheMiseAJourDatesMiseEnServiceTerminée } from '@modules/imports/gestionnaireRéseau/events'
import { resetDatabase } from '../../../helpers'
import { Tâches } from '../tâches.model'
import onTâcheMiseAJourDatesMiseEnServiceTerminée from './onTâcheMiseAJourDatesMiseEnServiceTerminée'

describe('Handler onTâcheMiseAJourDatesMiseEnServiceTerminée', () => {
  const occurredAt = new Date('2022-01-05')

  beforeEach(async () => {
    await resetDatabase()
  })

  it(`Étant donné une tache en base de donnée
      Lorsque un énement de type 'TâcheMiseAJourDatesMiseEnServiceTerminée' survient
      Alors la tâche devrait être mise à jour avec le type avec une date de fin, 
      un nombre de succès et un nombre d'échecs`, async () => {
    await Tâches.create({
      id: 'tâche-id',
      type: 'maj-date-mise-en-service',
      dateDeDébut: new Date(),
    })

    await onTâcheMiseAJourDatesMiseEnServiceTerminée(
      new TâcheMiseAJourDatesMiseEnServiceTerminée({
        payload: {
          tâcheId: 'tâche-id',
          gestionnaire: 'Enedis',
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
      where: { id: 'tâche-id' },
    })

    expect(tâche).toMatchObject({
      id: 'tâche-id',
      dateDeFin: occurredAt,
      nombreDeSucces: 2,
      nombreDEchecs: 1,
    })
  })
})
