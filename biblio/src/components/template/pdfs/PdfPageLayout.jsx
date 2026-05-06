import React from 'react';
import { Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65, // Extra space at bottom for the footer
    paddingHorizontal: 35,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#1ea4e9', // Ajial Medias brand color (adjust as needed)
    paddingBottom: 10,
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 80,
    height: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  headerTextContainer: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubText: {
    fontSize: 10,
    color: '#4b5563',
    marginTop: 3,
  },
  content: {
    // flex: 1, // Takes up remaining space between header and footer
    paddingBottom: 20,
  },
  footer: {
    position: 'absolute',
    fontSize: 10,
    bottom: 25,
    left: 35,
    right: 35,
    textAlign: 'center',
    color: '#6b7280',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  }
});

// We accept standard Page props so you can still override orientation/size
const PdfPageLayout = ({ children, size = "A4", orientation = "portrait" }) => {

  // In the future, you can fetch these from your Laravel Settings API
  const settings = {
    companyName: "Ajial Medias",
    slogan: "Édition, Distribution et Robotique",
    address: "Marrakech, Maroc",
    email: "contact@ajial-medias.com",
    tel: "+212 600-000000"
  };

  return (
    <Page size={size} orientation={orientation} style={styles.page}>

      {/* --- HEADER (fixed makes it repeat on every page) --- */}
      <View style={styles.header} fixed>
        {/* When you have an actual logo URL from settings, use <Image src={settings.logoUrl} style={{ width: 80 }} /> */}
        <View style={styles.logoPlaceholder}>
          <Text style={{ fontSize: 10, color: '#9ca3af' }}>LOGO</Text>
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.companyName}>{settings.companyName}</Text>
          <Text style={styles.headerSubText}>{settings.slogan}</Text>
          <Text style={styles.headerSubText}>Édité le : {new Date().toLocaleDateString('fr-FR')}</Text>
        </View>
      </View>

      {/* --- MAIN CONTENT (Passed from parent component) --- */}
      <View style={styles.content}>
        {children}
      </View>

      {/* --- FOOTER (fixed makes it repeat on every page) --- */}
      {/* The 'render' prop dynamically injects the page number logic */}
      <Text
        style={styles.footer}
        fixed
        render={({ pageNumber, totalPages }) => (
          `${settings.companyName} • ${settings.address} • Tél: ${settings.tel} • Email: ${settings.email}\nPage ${pageNumber} sur ${totalPages}`
        )}
      />

    </Page>
  );
};

export default PdfPageLayout;