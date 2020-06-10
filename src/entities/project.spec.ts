import { buildApplyProjectUpdate, Project } from './'

describe('Project entity', () => {
  describe('applyProjectUpdate', () => {
    const applyProjectUpdate = buildApplyProjectUpdate(() => '1234')

    it('should add a history event with blank before and after when update is undefined', () => {
      const updatedProject = applyProjectUpdate({
        project: {} as Project,
        context: {
          userId: '5678',
          type: 'import',
        },
      })

      expect(updatedProject).toBeDefined()
      if (!updatedProject) return
      expect(updatedProject).toHaveProperty('history')
      expect(updatedProject.history).toHaveLength(1)
      if (!updatedProject.history?.length) return
      expect(updatedProject.history[0]).toEqual(
        expect.objectContaining({
          id: '1234',
          before: {},
          after: {},
          userId: '5678',
          type: 'import',
          isNew: true,
        })
      )
    })

    it('should update project and add a history event with before and after containing previous and latest values for change in top-level field', () => {
      const updatedProject = applyProjectUpdate({
        project: { appelOffreId: '1368', periodeId: '123' } as Project,
        update: { appelOffreId: '9876' },
        context: {
          userId: '5678',
          type: 'modification-request',
        },
      })

      expect(updatedProject).toBeDefined()
      if (!updatedProject) return

      expect(updatedProject.appelOffreId).toEqual('9876') // updated
      expect(updatedProject.periodeId).toEqual('123') // unchanged

      expect(updatedProject).toHaveProperty('history')
      expect(updatedProject.history).toHaveLength(1)
      if (!updatedProject.history?.length) return
      expect(updatedProject.history[0]).toEqual(
        expect.objectContaining({
          id: '1234',
          before: {
            appelOffreId: '1368',
          },
          after: {
            appelOffreId: '9876',
          },
          userId: '5678',
          type: 'modification-request',
          isNew: true,
        })
      )
    })

    it('should update project and add a history event with before and after containing previous and latest values for change in value inside object type value', () => {
      const updatedProject = applyProjectUpdate({
        project: ({
          details: {
            oldField: 'oldValue',
            untouchedField: 'untouchedValue',
            removedField: 'removedValue',
          },
        } as unknown) as Project,
        update: {
          details: {
            oldField: 'newValue',
            untouchedField: 'untouchedValue',
          },
        },
        context: {
          userId: '5678',
          type: 'modification-request',
        },
      })

      expect(updatedProject).toBeDefined()
      if (!updatedProject) return

      expect(updatedProject.details).toEqual({
        oldField: 'newValue',
        untouchedField: 'untouchedValue',
      }) // updated

      expect(updatedProject).toHaveProperty('history')
      expect(updatedProject.history).toHaveLength(1)
      if (!updatedProject.history?.length) return
      expect(updatedProject.history[0]).toEqual(
        expect.objectContaining({
          id: '1234',
          before: {
            details: {
              oldField: 'oldValue',
              removedField: 'removedValue',
              // ignore untouched value
            },
          },
          after: {
            details: {
              oldField: 'newValue',
            },
          },
          userId: '5678',
          type: 'modification-request',
          isNew: true,
        })
      )
    })
  })
})
