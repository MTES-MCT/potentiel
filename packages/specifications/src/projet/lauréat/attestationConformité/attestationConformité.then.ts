import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { Achèvement } from '@potentiel-domain/laureat';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { PotentielWorld } from '../../../potentiel.world';
import { convertStringToReadableStream } from '../../../helpers/convertStringToReadable';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { convertReadableStreamToString } from '../../../helpers/convertReadableToString';

Alors(
  'une attestation de conformité devrait être consultable pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const expectedAttestation = {
      content: exemple['contenu attestation']
        ? convertStringToReadableStream(exemple['contenu attestation'])
        : convertStringToReadableStream('contenu par défaut'),
      format: exemple['format attestation'] || 'application/pdf',
    };

    const expectedDateTransmissionAuCocontractant = exemple['date transmission au co-contractant']
      ? new Date(exemple['date transmission au co-contractant']).toISOString()
      : new Date().toISOString();

    const expectedPreuveTransmissionAuCocontractant = {
      content: exemple['contenu preuve transmission au co-contractant']
        ? convertStringToReadableStream(exemple['contenu preuve transmission au co-contractant'])
        : convertStringToReadableStream('contenu par défaut'),
      format: exemple['format preuve transmission au co-contractant'] || 'application/pdf',
    };

    const expectedDate = exemple['date']
      ? new Date(exemple['date']).toISOString()
      : new Date().toISOString();

    const expectedUtilisateur = exemple['utilisateur'] || 'utilisateur@test.test';

    await waitForExpect(async () => {
      // ASSERT ON READ MODEL
      const actualReadModel =
        await mediator.send<Achèvement.AttestationConformité.ConsulterAttestationConformitéQuery>({
          type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      expect(actualReadModel.attestation.format).to.deep.equal(expectedAttestation.format);
      expect(actualReadModel.preuveTransmissionAuCocontractant.format).to.deep.equal(
        expectedPreuveTransmissionAuCocontractant.format,
      );
      expect(actualReadModel.dateTransmissionAuCocontractant.date).to.deep.equal(
        new Date(expectedDateTransmissionAuCocontractant),
      );
      expect(actualReadModel.misÀJourLe.date).to.deep.equal(new Date(expectedDate));
      expect(actualReadModel.misÀJourPar.formatter()).to.deep.equal(expectedUtilisateur);

      // ASSERT ON FILES CONTENT
      //attestation
      if (actualReadModel.attestation) {
        console.log('test actual attestation');
        const actualAttestation = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: actualReadModel.attestation.formatter(),
          },
        });
        const actualAttestationContent = await convertReadableStreamToString(
          actualAttestation.content,
        );
        actualAttestationContent.should.be.equal(expectedAttestation.content);
      }

      // preuve transmission
      if (actualReadModel.preuveTransmissionAuCocontractant) {
        console.log('test actual preuve transmission');

        const preuveTransmission = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: actualReadModel.preuveTransmissionAuCocontractant.formatter(),
          },
        });
        const actualPreuveTransmissionContent = await convertReadableStreamToString(
          preuveTransmission.content,
        );
        actualPreuveTransmissionContent.should.be.equal(expectedAttestation.content);
      }
    });
  },
);
