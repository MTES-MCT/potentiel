import { adminActions } from "."
import makeFakeProject from "../../../__tests__/fixtures/project"
import ROUTES from "../../../routes"


describe('adminActions', () => {
    describe('when project is notified and has a certificate file', () => {
        it('should return candidate certificate for admin link', () => {
            const fakeProject = makeFakeProject({notifiedOn: new Date(2/1/2022), certificateFile: {id: '1', filename: 'file-name'}})
            const result = adminActions(fakeProject)
            expect(result).toHaveLength(1)
            expect(result[0]).toMatchObject({
                title: 'Voir attestation',
                link: ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS({
                  id: fakeProject.id,
                  certificateFileId: fakeProject.certificateFile.id,
                  email: fakeProject.email,
                  potentielIdentifier: fakeProject.potentielIdentifier,
                }),
                isDownload: true,
              })
        })
    })
    describe('when project is not notified has no certificate file', () => {
        it('should return candidate certificate preview link', () => {
            const fakeProject = makeFakeProject({notifiedOn: null})
            const result = adminActions(fakeProject)
            expect(result).toHaveLength(1)
            expect(result[0]).toMatchObject({
                title: 'Aperçu attestation',
                link: ROUTES.PREVIEW_CANDIDATE_CERTIFICATE(fakeProject),
                isDownload: true,
              })
        })
    })
    describe('when project has an attestation designation proof file', () => {
        it('should return the link to get the attestation uploaded by the candidate', () => {
            const fakeProject = makeFakeProject({attestationDesignationProof: { file: { id: '1', filename: 'file-name' } }})
            const result = adminActions(fakeProject)
            expect(result).toHaveLength(2)
            expect(result[1]).toMatchObject({
                title: "Voir l'attestation de désignation fournie par le candidat",
                link: ROUTES.DOWNLOAD_PROJECT_FILE(
                    fakeProject.attestationDesignationProof.file.id,
                    fakeProject.attestationDesignationProof.file.filename
                ),
                isDownload: true,
            })
        })  

    })
})