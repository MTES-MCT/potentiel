export const getRégionAndDépartementFromCodePostal = (codePostals: string) => {
  // return codePostals
  //   .split('/')
  //   .map((str) => str.trim())
  //   .map(getDepartementRegionFromCodePostal);

  console.log(codePostals);
  // return undefined;

  return {
    région: 'test',
    département: 'test',
  };

  getRégionAndDépartementFromCodePostal;
};

const getGeoPropertiesFromCodePostal = (codePostalValues) => {
  return codePostalValues
    .map((codePostalValue) => {
      return getDepartementRegionFromCodePostal(codePostalValue);
    })
    .filter((item) => !!item)
    .reduce(
      (geoInfo, departementRegion) => {
        const { codePostal, region, departement } = departementRegion;
        return geoInfo;
      },
      {
        codePostalProjet: '',
        departementProjet: '',
        regionProjet: '',
      },
    );
};
