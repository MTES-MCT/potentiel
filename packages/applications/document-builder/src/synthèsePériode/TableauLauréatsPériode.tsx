import { StyleSheet, Text, View } from '@react-pdf/renderer';
import type { FC } from 'react';

export type TableauLauréatPériodeProps = {
  unitéPuissance: string;
  lauréats: {
    nom: string;
    nomProjet: string;
    puissance: string;
    commune: string;
    département: string;
    région: string;
  }[];
};

const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: '#000',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    backgroundColor: '#eee',
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 4,
    fontSize: 9,
  },

  laureat: { flex: 2 },
  projet: { flex: 3 },
  puissance: { flex: 2 },
  commune: { flex: 2 },
  departement: { flex: 2 },
  region: { flex: 2 },
});

export const TableauLauréatPériode: FC<TableauLauréatPériodeProps> = ({
  lauréats,
  unitéPuissance,
}) => {
  return (
    <View style={styles.table}>
      {/* En-tête */}
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.laureat]}>Lauréat</Text>
        <Text style={[styles.cell, styles.projet]}>Nom projet</Text>
        <Text style={[styles.cell, styles.puissance]}>Puissance</Text>
        <Text style={[styles.cell, styles.commune]}>Commune</Text>
        <Text style={[styles.cell, styles.departement]}>Département</Text>
        <Text style={[styles.cell, styles.region]}>Région</Text>
      </View>

      {/* Lignes */}
      {lauréats.map((lauréat) => (
        <View key={lauréat.nomProjet} style={styles.row}>
          <Text style={[styles.cell, styles.laureat]}>{lauréat.nom}</Text>

          <Text style={[styles.cell, styles.projet]}>{lauréat.nomProjet}</Text>

          <Text style={[styles.cell, styles.puissance]}>
            {lauréat.puissance} {unitéPuissance}
          </Text>

          <Text style={[styles.cell, styles.commune]}>{lauréat.commune}</Text>

          <Text style={[styles.cell, styles.departement]}>
            {lauréat.département.replace(/-/g, '-\n')}
          </Text>

          <Text style={[styles.cell, styles.region]}>{lauréat.région.replace(/-/g, '-\n')}</Text>
        </View>
      ))}
    </View>
  );
};
