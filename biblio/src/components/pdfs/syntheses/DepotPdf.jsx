import React from 'react';
import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import PdfPageLayout from '../../template/pdfs/PdfPageLayout';
import { currencyFormat } from '../../../lib/utilities';

const styles = StyleSheet.create({
  title: { fontSize: 16, marginBottom: 8, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
  subtitle: { fontSize: 10, marginBottom: 15, textAlign: 'center', color: '#6b7280' },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 15 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', minHeight: 22, alignItems: 'center' },
  tableHeader: { backgroundColor: '#111827' },
  tableCellHeader: { color: '#ffffff', fontSize: 8, fontWeight: 'bold', padding: 4 },
  tableCell: { fontSize: 8, padding: 4, color: '#374151' },
  totalRow: { backgroundColor: '#f9fafb', borderTopWidth: 1, borderTopColor: '#d1d5db', minHeight: 24 },
  sectionTitle: { fontSize: 12, marginBottom: 8, fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: '#f3f4f6', padding: 6, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  kpiSection: { marginBottom: 12, padding: 8, backgroundColor: '#fffbeb', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#f59e0b' },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  kpiLabel: { fontSize: 9, color: '#374151' },
  kpiValue: { fontSize: 9, fontWeight: 'bold' },
});

const DepotPdf = ({ rows, kpis, seasonLabel }) => (
  <Document>
    <PdfPageLayout>
      <Text style={styles.title}>Synthèse du Dépôt</Text>
      {seasonLabel && <Text style={styles.subtitle}>{seasonLabel}</Text>}

      <View style={styles.kpiSection}>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Lignes :</Text>
          <Text style={styles.kpiValue}>{kpis.lignes}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Représentants :</Text>
          <Text style={styles.kpiValue}>{kpis.reps}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Quantité en dépôt :</Text>
          <Text style={[styles.kpiValue, { color: '#d97706' }]}>{kpis.quantite}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]} fixed>
          <View style={{ width: '25%' }}><Text style={styles.tableCellHeader}>Représentant</Text></View>
          <View style={{ width: '25%' }}><Text style={styles.tableCellHeader}>Ouvrage</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.tableCellHeader}>Qté en dépôt</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.tableCellHeader}>Statut</Text></View>
          <View style={{ width: '20%' }}><Text style={styles.tableCellHeader}>Dernière opération</Text></View>
        </View>
        {rows.map((row, idx) => (
          <View key={idx} style={styles.tableRow} wrap={false}>
            <View style={{ width: '25%' }}><Text style={styles.tableCell}>{row.rep}</Text></View>
            <View style={{ width: '25%' }}><Text style={styles.tableCell}>{row.livre}</Text></View>
            <View style={{ width: '15%' }}><Text style={styles.tableCell}>{row.qteDepot}</Text></View>
            <View style={{ width: '15%' }}><Text style={styles.tableCell}>{row.status}</Text></View>
            <View style={{ width: '20%' }}><Text style={styles.tableCell}>{row.date}</Text></View>
          </View>
        ))}
      </View>
    </PdfPageLayout>
  </Document>
);

export default DepotPdf;
