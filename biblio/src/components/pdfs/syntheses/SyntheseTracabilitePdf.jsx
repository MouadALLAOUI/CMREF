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
  footerBox: { marginTop: 10, padding: 10, backgroundColor: '#f0fdf4', borderRadius: 4, alignSelf: 'flex-end', width: '50%' },
  kpiSection: { marginBottom: 12, padding: 8, backgroundColor: '#eff6ff', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  kpiLabel: { fontSize: 9, color: '#374151' },
  kpiValue: { fontSize: 9, fontWeight: 'bold' },
});

const SyntheseTracabilitePdf = ({ rows, kpis, repLabel, seasonLabel }) => (
  <Document>
    <PdfPageLayout>
      <Text style={styles.title}>Synthèse Traçabilité</Text>
      {seasonLabel && <Text style={styles.subtitle}>{seasonLabel}</Text>}
      {repLabel && repLabel !== 'Tous' && <Text style={styles.subtitle}>Représentant : {repLabel}</Text>}

      <View style={styles.kpiSection}>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Clients actifs :</Text>
          <Text style={styles.kpiValue}>{kpis.clientsActifs}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Total ventes :</Text>
          <Text style={[styles.kpiValue, { color: '#059669' }]}>{currencyFormat(kpis.ventes)}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Total remboursé :</Text>
          <Text style={[styles.kpiValue, { color: '#2563eb' }]}>{currencyFormat(kpis.remboursements)}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Solde :</Text>
          <Text style={[styles.kpiValue, { color: '#111827' }]}>{currencyFormat(kpis.solde)}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]} fixed>
          <View style={{ width: '28%' }}><Text style={styles.tableCellHeader}>Client</Text></View>
          <View style={{ width: '18%' }}><Text style={styles.tableCellHeader}>Crédit (DH)</Text></View>
          <View style={{ width: '18%' }}><Text style={styles.tableCellHeader}>Avance (DH)</Text></View>
          <View style={{ width: '18%' }}><Text style={styles.tableCellHeader}>Reste (DH)</Text></View>
          <View style={{ width: '18%' }}><Text style={styles.tableCellHeader}>Recouvrement</Text></View>
        </View>
        {rows.map((row, idx) => (
          <View key={idx} style={styles.tableRow} wrap={false}>
            <View style={{ width: '28%' }}><Text style={styles.tableCell}>{row.client}</Text></View>
            <View style={{ width: '18%' }}><Text style={styles.tableCell}>{currencyFormat(row.totalVentes)}</Text></View>
            <View style={{ width: '18%' }}><Text style={styles.tableCell}>{currencyFormat(row.totalRemb)}</Text></View>
            <View style={{ width: '18%' }}><Text style={styles.tableCell}>{currencyFormat(row.solde)}</Text></View>
            <View style={{ width: '18%' }}><Text style={styles.tableCell}>{row.recouvrement.toFixed(1)}%</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.footerBox}>
        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL VENTES : {currencyFormat(kpis.ventes)}</Text>
        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL REMBOURSÉ : {currencyFormat(kpis.remboursements)}</Text>
        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>SOLDE : {currencyFormat(kpis.solde)}</Text>
      </View>
    </PdfPageLayout>
  </Document>
);

export default SyntheseTracabilitePdf;
