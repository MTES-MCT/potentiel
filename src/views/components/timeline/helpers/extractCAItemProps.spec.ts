import { ProjectEventListDTO, ProjectImportedDTO, ProjectNotifiedDTO } from '@modules/frise'
import { extractCAItemProps } from './extractCAItemProps'

describe('extractCAItemProps', () => {
  describe(`Cas d'un utilisateur n'ayant pas accès aux contrats d'achat`, () => {
    const project = {
      status: 'Classé',
    } as ProjectEventListDTO['project']

    it(`le retour devrait être null`, () => {
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'cre',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ]

      const result = extractCAItemProps(events, project)
      expect(result).toEqual(null)
    })
  })
  describe(`Projet Eliminé`, () => {
    const project = {
      status: 'Eliminé',
    } as ProjectEventListDTO['project']

    it(`le retour devrait être null`, () => {
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ]
      const result = extractCAItemProps(events, project)
      expect(result).toEqual(null)
    })
  })
  describe('Projet lauréat', () => {
    const project = {
      status: 'Classé',
    } as ProjectEventListDTO['project']

    describe(`S'il n'y a pas d'événement`, () => {
      it('le retour doit être null', () => {
        const events = []
        const result = extractCAItemProps(events, project)
        expect(result).toBeNull()
      })
    })
    describe(`s'il n'y a pas encore de contrat d'achat`, () => {
      it('alors des props devraient être retournées avec un CA non-envoyé', () => {
        const events = [
          {
            type: 'ProjectImported',
            variant: 'admin',
            date: 11,
          } as ProjectImportedDTO,
        ]

        const result = extractCAItemProps(events, project)

        expect(result).toEqual({
          type: 'contrat-achat',
          status: 'not-submitted',
        })
      })
    })
  })
})
