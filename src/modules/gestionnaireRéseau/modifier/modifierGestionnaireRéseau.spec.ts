describe('Modifier un gestionnaire de réseau', () => {
  it(`
    Etant donné un gestionnaire de réseau
    Lorsque un administrateur modifie la raison sociale du gestionnaire de réseau
    Alors la raison sociale du gestionnaire de réseau devrait être mise à jour
  `, async () => {
    // Arrange
    const codeEIC = '17X100A100A0001A';
    const aggregateId = `gestionnaire-réseau#${codeEIC}`;

    await publish(aggregateId, {
      type: 'GestionnaireRéseauAjouté',
      occuredAt: '2023-03-09T15:45:14+0000',
      payload: {
        codeEIC,
        raisonSociale: 'RTE',
      },
    });

    // Act
    await modifierGestionnaireRéseau({
      codeEIC,
      raisonSociale: 'ENEDIS',
    });

    const gestionnaireRéseau = await loadGestionnaireRéseauAggreagate(codeEIC);

    // Assert
    expect(gestionnaireRéseau.raisonSociale).toEqual('ENEDIS');
  });
});
