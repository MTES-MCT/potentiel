import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Achèvement } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';

import { convertReadableStreamToString } from '../../../../../helpers/convertReadableToString';
import { PotentielWorld } from '../../../../../potentiel.world';

Alors(
  'une attestation de conformité devrait être consultable pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const expectedAttestationFormat = exemple['format attestation'] || 'application/pdf';
    const expectedAttestationContent = exemple['contenu attestation'] || 'contenu par défaut';

    const expectedPreuveTransmissionAuCocontractantFormat =
      exemple['format preuve transmission au co-contractant'] || 'application/pdf';

    const expectedPreuveTransmissionAuCocontractantContent =
      exemple['contenu preuve transmission au co-contractant'] || 'contenu par défaut';

    const expectedDate = exemple['date']
      ? new Date(exemple['date']).toISOString()
      : new Date().toISOString();

    const expectedDateTransmissionAuCocontractant = exemple['date transmission au co-contractant']
      ? new Date(exemple['date transmission au co-contractant']).toISOString()
      : new Date().toISOString();

    const expectedEmail = this.utilisateurWorld.récupérerEmailSelonRôle(exemple['email']);

    await waitForExpect(async () => {
      const actualReadModel = await mediator.send<Achèvement.ConsulterAttestationConformitéQuery>({
        type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      expect(Option.isSome(actualReadModel)).to.be.true;

      if (Option.isSome(actualReadModel)) {
        expect(actualReadModel.attestation.format).to.deep.equal(expectedAttestationFormat);
        expect(actualReadModel.preuveTransmissionAuCocontractant.format).to.deep.equal(
          expectedPreuveTransmissionAuCocontractantFormat,
        );
        expect(actualReadModel.dateTransmissionAuCocontractant.date).to.deep.equal(
          new Date(expectedDateTransmissionAuCocontractant),
        );
        expect(actualReadModel.misÀJourLe.date).to.deep.equal(new Date(expectedDate));
        expect(actualReadModel.misÀJourPar.formatter()).to.deep.equal(expectedEmail);

        if (actualReadModel.attestation) {
          const actualAttestation = await mediator.send<ConsulterDocumentProjetQuery>({
            type: 'Document.Query.ConsulterDocumentProjet',
            data: {
              documentKey: actualReadModel.attestation.formatter(),
            },
          });

          const actualAttestationContent = await convertReadableStreamToString(
            actualAttestation.content,
          );

          actualAttestationContent.should.be.equal(expectedAttestationContent);
        }

        if (actualReadModel.preuveTransmissionAuCocontractant) {
          const preuveTransmission = await mediator.send<ConsulterDocumentProjetQuery>({
            type: 'Document.Query.ConsulterDocumentProjet',
            data: {
              documentKey: actualReadModel.preuveTransmissionAuCocontractant.formatter(),
            },
          });
          const actualPreuveTransmissionContent = await convertReadableStreamToString(
            preuveTransmission.content,
          );
          actualPreuveTransmissionContent.should.be.equal(
            expectedPreuveTransmissionAuCocontractantContent,
          );
        }
      }
    });
  },
);
