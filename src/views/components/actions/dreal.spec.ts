import { drealActions } from "."
import ROUTES from "../../../routes"
import makeFakeProject from "../../../__tests__/fixtures/project"

describe('drealActions', () => {
    describe('when GF has no status', () => {
        it('should return a link for the action "Marquer la garantie financière comme validée"', () => {
            const fakeProject = makeFakeProject({id: '1', gf: {id: '1', status: null}})
            const result = drealActions(fakeProject)
            expect(result).toHaveLength(1)
            expect(result[0]).toMatchObject({
                title: 'Marquer la garantie financière comme validée',
                link: ROUTES.UPDATE_PROJECT_STEP_STATUS({
                  projectId: fakeProject.id,
                  projectStepId: fakeProject.gf.id,
                  newStatus: 'validé',
                })
            })    
        })
    })
    describe('when GF status is "à traiter"', () => {
        it('should return a link for the action "Marquer la garantie financière comme validée"', () => {
            const fakeProject = makeFakeProject({id: '1', gf: {id: '1', status: 'à traiter'}})
            const result = drealActions(fakeProject)
            expect(result).toHaveLength(1)
            expect(result[0]).toMatchObject({
                title: 'Marquer la garantie financière comme validée',
                link: ROUTES.UPDATE_PROJECT_STEP_STATUS({
                  projectId: fakeProject.id,
                  projectStepId: fakeProject.gf.id,
                  newStatus: 'validé',
                })
            })    
        })
    })
    describe('when GF status is "validé', () =>{
        it('should return a link for the action "Marquer la garantie financière comme à traiter"', () => {
            const fakeProject = makeFakeProject({id: '1', gf: {id: '1', status: 'validé'}})
            const result = drealActions(fakeProject)
            expect(result).toHaveLength(1)
            expect(result[0]).toMatchObject({
                title: 'Marquer la garantie financière comme à traiter',
                link: ROUTES.UPDATE_PROJECT_STEP_STATUS({
                  projectId: fakeProject.id,
                  projectStepId: fakeProject.gf.id,
                  newStatus: 'à traiter',
                })
            })  
        })
    })
    describe('when the project has no gf property', () => {
        it('should return an empty action array', () => {
            const fakeProject = makeFakeProject()
            const result = drealActions(fakeProject)
            expect(result).toEqual([])
        })
    })
})