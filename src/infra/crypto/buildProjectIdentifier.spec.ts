import { makeBuildProjectIdentifier } from './buildProjectIdentifier'

describe('crypto.buildProjectIdentifier', () => {
  const buildProjectIdentifier = makeBuildProjectIdentifier('')
  it('should build an identifier starting with appelOffreId', () => {
    expect(
      buildProjectIdentifier({
        appelOffreId: 'ABCD',
        periodeId: '',
        familleId: '',
        numeroCRE: '',
      }).indexOf('ABCD')
    ).toEqual(0)
  })

  it('should build an identifier with periodeId after appelOffreId', () => {
    expect(
      buildProjectIdentifier({
        appelOffreId: 'ABCD',
        periodeId: '1234',
        familleId: '',
        numeroCRE: '',
      }).indexOf('ABCD-P1234')
    ).toEqual(0)
  })

  describe('when given a familleId', () => {
    it('should build an identifier with familleId after periodeId', () => {
      expect(
        buildProjectIdentifier({
          appelOffreId: 'ABCD',
          periodeId: '1234',
          familleId: 'XYZ',
          numeroCRE: '',
        }).indexOf('ABCD-P1234-FXYZ')
      ).toEqual(0)
    })

    it('should build an identifier with numeroCRE after familleId', () => {
      expect(
        buildProjectIdentifier({
          appelOffreId: 'ABCD',
          periodeId: '1234',
          familleId: 'XYZ',
          numeroCRE: '678',
        }).indexOf('ABCD-P1234-FXYZ-678')
      ).toEqual(0)
    })
  })

  describe('when not given a familleId', () => {
    it('should build an identifier without familleId', () => {
      expect(
        buildProjectIdentifier({
          appelOffreId: 'ABCD',
          periodeId: '1234',
          familleId: '',
          numeroCRE: '',
        })
      ).not.toEqual(expect.stringContaining('-F'))
    })

    it('should build an identifier with numeroCRE after periodeId', () => {
      expect(
        buildProjectIdentifier({
          appelOffreId: 'ABCD',
          periodeId: '1234',
          familleId: '',
          numeroCRE: '678',
        }).indexOf('ABCD-P1234-678')
      ).toEqual(0)
    })
  })

  it('should add a "-" separated 3 character key at the end', () => {
    const identifier = buildProjectIdentifier({
      appelOffreId: 'ABCD',
      periodeId: '1234',
      familleId: 'XYZ',
      numeroCRE: '678',
    })
    expect(identifier).toHaveLength('ABCD-P1234-FXYZ-678'.length + 4)
    expect(identifier.lastIndexOf('-')).toEqual(identifier.length - 4)
  })

  it('should have a key that depends on the potentielIdentifierSecret', () => {
    const projectInfo = {
      appelOffreId: 'ABCD',
      periodeId: '1234',
      familleId: 'XYZ',
      numeroCRE: '678',
    }

    const buildProjectIdentifierA = makeBuildProjectIdentifier('A')
    const buildProjectIdentifierB = makeBuildProjectIdentifier('B')

    expect(extractKey(buildProjectIdentifierA(projectInfo))).not.toEqual(
      extractKey(buildProjectIdentifierB(projectInfo))
    )
  })

  it('should have a key that depends on the appelOffreId', () => {
    const projectInfo = {
      appelOffreId: 'ABCD',
      periodeId: '1234',
      familleId: 'XYZ',
      numeroCRE: '678',
    }

    expect(extractKey(buildProjectIdentifier({ ...projectInfo, appelOffreId: 'ABC' }))).not.toEqual(
      extractKey(buildProjectIdentifier(projectInfo))
    )
  })

  it('should have a key that depends on the periodeId', () => {
    const projectInfo = {
      appelOffreId: 'ABCD',
      periodeId: '1234',
      familleId: 'XYZ',
      numeroCRE: '678',
    }

    expect(extractKey(buildProjectIdentifier({ ...projectInfo, periodeId: '123' }))).not.toEqual(
      extractKey(buildProjectIdentifier(projectInfo))
    )
  })

  it('should have a key that depends on the familleId', () => {
    const projectInfo = {
      appelOffreId: 'ABCD',
      periodeId: '1234',
      familleId: 'XYZ',
      numeroCRE: '678',
    }

    expect(extractKey(buildProjectIdentifier({ ...projectInfo, familleId: 'XYZW' }))).not.toEqual(
      extractKey(buildProjectIdentifier(projectInfo))
    )
  })

  it('should have a key that depends on the numeroCRE', () => {
    const projectInfo = {
      appelOffreId: 'ABCD',
      periodeId: '1234',
      familleId: 'XYZ',
      numeroCRE: '678',
    }

    expect(extractKey(buildProjectIdentifier({ ...projectInfo, numeroCRE: 'abc' }))).not.toEqual(
      extractKey(buildProjectIdentifier(projectInfo))
    )
  })
})

function extractKey(identifier) {
  return identifier.substring(identifier.length - 3)
}
