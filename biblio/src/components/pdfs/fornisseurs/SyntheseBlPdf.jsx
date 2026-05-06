import { Document, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import PdfPageLayout from '../../template/pdfs/PdfPageLayout';
import { currencyFormat, dateFormat, schoolYearFormat } from '../../../lib/utilities';

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minHeight: 25,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#111827',
  },
  tableCol: {
    width: '20%', // Adjust based on your columns
    padding: 5,
  },
  tableCellHeader: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 9,
    color: '#374151',
  },
  summaryBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    alignSelf: 'flex-end',
    width: '40%',
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  }
});

const SyntheseBlPdf = ({ data, annee, totalMontant }) => (
  <Document>
    <PdfPageLayout orientation="landscape">
      <Text style={styles.title}>Synthèse des Bons de Livraison - {annee === 'all' ? 'Toutes Années' : schoolYearFormat(annee)}</Text>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCellHeader}>Fournisseur</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>BL N°</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Date</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Qté</Text></View>
          <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCellHeader}>Total HT</Text></View>
        </View>

        {/* Table Rows */}
        {data.map((row, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{row.fournisseur}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{row.bl_number}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{dateFormat(row.date_reception)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{row.quantite}</Text></View>
            <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{currencyFormat(row.total_ht)}</Text></View>
          </View>
        ))}
      </View>

      {/* Financial Summary */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryLine}>
          <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Total Général HT:</Text>
          <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{currencyFormat(totalMontant)}</Text>
        </View>
      </View>
    </PdfPageLayout>
  </Document>
);

export default SyntheseBlPdf;