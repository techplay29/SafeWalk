import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function MapScreen() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'unsafeZones'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    });
    return () => unsub();
  }, []);

  async function reportArea() {
    try {
      await addDoc(collection(db, 'unsafeZones'), {
        area: 'Current Location',
        level: 'High',
        color: '#e24b4a',
        count: 1,
        timestamp: serverTimestamp(),
        reportedBy: 'Naitika',
      });
      Alert.alert('Reported!', 'This area has been marked as unsafe.');
    } catch (e) {
      Alert.alert('Error', 'Could not report area.');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.topTitle}>🗺️ Unsafe Zone Map</Text>
        <Text style={styles.topSub}>Tap to report a dangerous area</Text>
      </View>

      <View style={styles.mapBox}>
        <View style={styles.roadH} />
        <View style={styles.roadV} />
        <Text style={[styles.pin, { top: '25%', left: '20%' }]}>🔴</Text>
        <Text style={[styles.pin, { top: '55%', left: '60%' }]}>🔴</Text>
        <Text style={[styles.pin, { top: '20%', left: '55%' }]}>🟡</Text>
        <Text style={[styles.pin, { top: '65%', left: '30%' }]}>🟡</Text>
        <Text style={[styles.pin, { top: '42%', left: '40%' }]}>📍</Text>
        <View style={styles.legend}>
          <Text style={styles.legTxt}>🔴 High risk</Text>
          <Text style={styles.legTxt}>🟡 Moderate</Text>
          <Text style={styles.legTxt}>📍 You</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>REPORTED AREAS (LIVE FROM FIREBASE)</Text>
        {reports.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTxt}>No reports yet</Text>
            <Text style={styles.emptySub}>Be the first to report an unsafe area</Text>
          </View>
        ) : (
          reports.map((r) => (
            <View key={r.id} style={styles.reportCard}>
              <View style={[styles.badge, { backgroundColor: r.color || '#e24b4a' }]}>
                <Text style={styles.badgeTxt}>{r.level}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.areaName}>{r.area}</Text>
                <Text style={styles.areaSub}>Reported by {r.reportedBy}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.reportBtn} onPress={reportArea}>
        <Text style={styles.reportBtnTxt}>⚠️ Report This Area as Unsafe</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f5f2' },
  topbar: { backgroundColor: '#6B1F2A', padding: 16 },
  topTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  topSub: { color: '#f0c0c8', fontSize: 12, marginTop: 2 },
  mapBox: { height: 220, backgroundColor: '#e8f0f8', position: 'relative' },
  roadH: { position: 'absolute', top: '48%', left: 0, right: 0, height: 10, backgroundColor: '#fff' },
  roadV: { position: 'absolute', left: '38%', top: 0, bottom: 0, width: 10, backgroundColor: '#fff' },
  pin: { position: 'absolute', fontSize: 18 },
  legend: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: 6, gap: 2 },
  legTxt: { fontSize: 10, color: '#333' },
  section: { padding: 14, paddingBottom: 0 },
  sectionLabel: { fontSize: 10, fontWeight: '600', color: '#999', letterSpacing: 0.5, marginBottom: 8 },
  emptyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 0.5, borderColor: '#e0ddd8' },
  emptyTxt: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  emptySub: { fontSize: 11, color: '#888', marginTop: 4 },
  reportCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 0.5, borderColor: '#e0ddd8', marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeTxt: { color: '#fff', fontSize: 10, fontWeight: '600' },
  areaName: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  areaSub: { fontSize: 11, color: '#888', marginTop: 2 },
  reportBtn: { margin: 14, backgroundColor: '#6B1F2A', borderRadius: 14, padding: 16, alignItems: 'center' },
  reportBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
});