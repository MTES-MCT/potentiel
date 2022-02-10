// import { Famille, ProjectAppelOffre } from '@entities'
// import { isSoumisAuxGFs } from './isSoumisAuxGFs'

// describe(`isSoumisAuxGFs`, () => {
//   describe(`when the AO property soumisAuxGarantiesFinancieres is true`, () => {
//     const fakeProjectAppelOffre: ProjectAppelOffre = {
//       soumisAuxGarantiesFinancieres: true,
//     } as ProjectAppelOffre

//     it(`should return true`, () => {
//       const actual = isSoumisAuxGFs(fakeProjectAppelOffre)
//       expect(actual).toBe(true)
//     })
//   })

//   describe(`when the AO property soumisAuxGarantiesFinancieres is false`, () => {
//     describe(`when the family property soumisAuxGarantiesFinancieres is true `, () => {
//       const fakeProjectAppelOffre: ProjectAppelOffre = {
//         soumisAuxGarantiesFinancieres: false,
//         famille: {
//           id: 'famille',
//           soumisAuxGarantiesFinancieres: true,
//         } as Famille,
//       } as ProjectAppelOffre

//       it(`should return true`, () => {
//         const actual = isSoumisAuxGFs(fakeProjectAppelOffre)

//         expect(actual).toBe(true)
//       })
//     })

//     describe(`when the family has no property soumisAuxGarantiesFinancieres`, () => {
//       describe(`when the family property garantieFinanciereEnMois is more than 0`, () => {
//         const fakeProjectAppelOffre: ProjectAppelOffre = {
//           soumisAuxGarantiesFinancieres: false,
//           famille: {
//             id: 'famille',
//             garantieFinanciereEnMois: 3,
//           } as Famille,
//         } as ProjectAppelOffre

//         it(`should return true`, () => {
//           const actual = isSoumisAuxGFs(fakeProjectAppelOffre)
//           expect(actual).toBe(true)
//         })
//       })

//       describe(`when the family property garantieFinanciereEnMois is equal to 0`, () => {
//         const fakeProjectAppelOffre: ProjectAppelOffre = {
//           soumisAuxGarantiesFinancieres: false,
//           famille: {
//             id: 'famille',
//             garantieFinanciereEnMois: 0,
//           } as Famille,
//         } as ProjectAppelOffre

//         it(`should return false`, () => {
//           const actual = isSoumisAuxGFs(fakeProjectAppelOffre)
//           expect(actual).toBe(false)
//         })
//       })

//       describe(`when the family has no property garantieFinanciereEnMois`, () => {
//         const fakeProjectAppelOffre: ProjectAppelOffre = {
//           soumisAuxGarantiesFinancieres: false,
//           famille: {
//             id: 'famille',
//           } as Famille,
//         } as ProjectAppelOffre

//         it(`should return false`, () => {
//           const actual = isSoumisAuxGFs(fakeProjectAppelOffre)
//           expect(actual).toBe(false)
//         })
//       })
//     })
//   })
// })
