import React from 'react';
import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import PdfPageLayout from '../../template/pdfs/PdfPageLayout';
import { currencyFormat } from '../../../lib/utilities';

const styles = StyleSheet.create({
  title: { fontSize: 16, marginBottom: 8, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
  subtitle: { fontSize: 10, marginBottom: 15, textAlign: 'center', color: '#6b7280' },
  sectionTitle: { fontSize: 12, marginBottom: 8, fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: '#f3f4f6', padding: 6, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 15 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', minHeight: 22, alignItems: 'center' },
  tableHeader: { backgroundColor: '#111827' },
  tableCellHeader: { color: '#ffffff', fontSize: 8, fontWeight: 'bold', padding: 4 },
  tableCell: { fontSize: 8, padding: 4, color: '#374151' },
  totalRow: { backgroundColor: '#f9fafb', borderTopWidth: 1, borderTopColor: '#d1d5db', minHeight: 24 },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  kpiLabel: { fontSize: 9, color: '#374151' },
  kpiValue: { fontSize: 9, fontWeight: 'bold' },
  kpiSection: { marginBottom: 12, padding: 8, backgroundColor: '#f0fdf4', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#10b981' },
});

const VentesPdf = ({ categorySections, kpis, seasonLabel }) => (
  <Document>
    <PdfPageLayout orientation="landscape">
      <Text style={styles.title}>Synthèse des Ventes</Text>
      {seasonLabel && <Text style={styles.subtitle}>{seasonLabel}</Text>}

      <View style={styles.kpiSection}>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Articles vendus :</Text>
          <Text style={styles.kpiValue}>{kpis.articles}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Quantité totale :</Text>
          <Text style={styles.kpiValue}>{kpis.qte}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Total ventes :</Text>
          <Text style={[styles.kpiValue, { color: '#059669' }]}>{currencyFormat(kpis.total)}</Text>
        </View>
      </View>

      {categorySections.map((section) => (
        <View key={section.category} style={{ marginBottom: 15 }}>
          <Text style={styles.sectionTitle}>Ventes — Catégorie : {section.category}</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]} fixed>
              <View style={{ width: '30%' }}><Text style={styles.tableCellHeader}>Article</Text></View>
              <View style={{ width: '12%' }}><Text style={styles.tableCellHeader}>Code</Text></View>
              <View style={{ width: '12%' }}><Text style={styles.tableCellHeader}>Quantité</Text></View>
              <View style={{ width: '18%' }}><Text style={styles.tableCellHeader}>Prix unitaire</Text></View>
              <View style={{ width: '18%' }}><Text style={styles.tableCellHeader}>Total (DH)</Text></View>
            </View>
            {section.books.map((book, idx) => (
              <View key={idx} style={styles.tableRow} wrap={false}>
                <View style={{ width: '30%' }}><Text style={styles.tableCell}>{book.article}</Text></View>
                <View style={{ width: '12%' }}><Text style={styles.tableCell}>{book.code}</Text></View>
                <View style={{ width: '12%' }}><Text style={styles.tableCell}>{book.qte}</Text></View>
                <View style={{ width: '18%' }}><Text style={styles.tableCell}>{currencyFormat(book.prixUnit)}</Text></View>
                <View style={{ width: '18%' }}><Text style={[styles.tableCell, { fontWeight: 'bold', color: '#059669' }]}>{currencyFormat(book.total)}</Text></View>
              </View>
            ))}
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={{ width: '42%' }}><Text style={[styles.tableCell, { fontWeight: 'bold', textTransform: 'uppercase' }]}>Total {section.category}</Text></View>
              <View style={{ width: '12%' }}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{section.totalQte}</Text></View>
              <View style={{ width: '18%' }}><Text style={styles.tableCell}></Text></View>
              <View style={{ width: '18%' }}><Text style={[styles.tableCell, { fontWeight: 'bold', color: '#059669' }]}>{currencyFormat(section.totalMontant)}</Text></View>
            </View>
          </View>
        </View>
      ))}
    </PdfPageLayout>
  </Document>
);

export default VentesPdf;
