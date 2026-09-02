import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function MapScreen() {
  const [reports, setReports] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLocation, setReportLocation] = useState('');
  const [reportLevel, setReportLevel] = useState('');
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'unsafeZones'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    });
    return () => unsub();
  }, []);

  async function submitReport() {
    if (!reportLocation || !reportLevel) {
      Alert.alert('Missing Info', 'Please enter location and select risk level!');
      return;
    }
    try {
      await addDoc(collection(db, 'unsafeZones'), {
        area: reportLocation,
        level: reportLevel,
        reason: reportReason,
        color: reportLevel === 'High' ? '#e24b4a' : reportLevel === 'Moderate' ? '#EF9F27' : '#4CAF50',
        timestamp: serverTimestamp(),
        reportedBy: 'Naitika',
      });
      setShowReportModal(false);
      setReportLocation('');
      setReportLevel('');
      setReportReason('');
      Alert.alert('Reported!', 'This area has been marked as unsafe. Thank you for keeping the community safe!');
    } catch (e) {
      Alert.alert('Error', 'Could not submit report. Try again.');
    }
  }

  return (
    <ScrollView style={styles.container}>

      {/* REPORT MODAL */}
      <Modal visible={showReportModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>⚠️ Report Unsafe Area</Text>
            <Text style={styles.modalSub}>Help keep your community safe by reporting dangerous spots</Text>

            <Text style={styles.label}>Location / Area Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Station Road, Near Park..."
              value={reportLocation}
              onChangeText={setReportLocation}
            />

            <Text style={styles.label}>Risk Level</Text>
            <View style={styles.levelRow}>
              {['Low', 'Moderate', 'High'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelBtn,
                    reportLevel === level && styles.levelBtnSelected,
                    { borderColor: level === 'High' ? '#e24b4a' : level === 'Moderate' ? '#EF9F27' : '#4CAF50' },
                    reportLevel === level && { backgroundColor: level === 'High' ? '#e24b4a' : level === 'Moderate' ? '#EF9F27' : '#4CAF50' }
                  ]}
                  onPress={() => setReportLevel(level)}
                >
                  <Text style={[styles.levelBtnTxt, reportLevel === level && { color: '#fff' }]}>
                    {level === 'High' ? '🔴' : level === 'Moderate' ? '🟡' : '🟢'} {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Reason (optional)</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="e.g. Poor lighting, harassment reported, isolated area..."
              value={reportReason}
              onChangeText={setReportReason}
              multiline
            />

            <TouchableOpacity style={styles.submitBtn} onPress={submitReport}>
              <Text style={styles.submitBtnTxt}>Submit Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowReportModal(false)}>
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.topbar}>
        <Text style={styles.topTitle}>🗺️ Unsafe Zone Map</Text>
        <Text style={styles.topSub}>Community-reported dangerous areas</Text>
      </View>

      {/* MAP */}
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
          <Text style={styles.legTxt}>🟢 Low</Text>
          <Text style={styles.legTxt}>📍 You</Text>
        </View>
      </View>

      {/* REPORTS LIST */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>REPORTED AREAS (LIVE FROM FIREBASE)</Text>
        {reports.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyTxt}>No reports yet in your area</Text>
            <Text style={styles.emptySub}>Be the first to report an unsafe area and help keep your community safe</Text>
          </View>
        ) : (
          reports.map((r) => (
            <View key={r.id} style={styles.reportCard}>
              <View style={[styles.badge, { backgroundColor: r.color || '#e24b4a' }]}>
                <Text style={styles.badgeTxt}>{r.level}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.areaName}>{r.area}</Text>
                <Text style={styles.areaSub}>
                  {r.reason ? r.reason : 'Reported as unsafe'} · by {r.reportedBy}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.reportBtn} onPress={() => setShowReportModal(true)}>
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
  emptyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 0.5, borderColor: '#e0ddd8' },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyTxt: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  emptySub: { fontSize: 11, color: '#888', marginTop: 4, textAlign: 'center', lineHeight: 16 },
  reportCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 0.5, borderColor: '#e0ddd8', marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeTxt: { color: '#fff', fontSize: 10, fontWeight: '600' },
  areaName: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  areaSub: { fontSize: 11, color: '#888', marginTop: 2 },
  reportBtn: { margin: 14, backgroundColor: '#6B1F2A', borderRadius: 14, padding: 16, alignItems: 'center' },
  reportBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, margin: 0 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  modalSub: { fontSize: 12, color: '#888', marginBottom: 16, lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '500', color: '#444', marginBottom: 6 },
  input: { backgroundColor: '#f7f5f2', borderRadius: 10, padding: 12, fontSize: 14, borderWidth: 0.5, borderColor: '#e0ddd8', marginBottom: 14 },
  levelRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  levelBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1.5, alignItems: 'center' },
  levelBtnSelected: {},
  levelBtnTxt: { fontSize: 12, fontWeight: '500', color: '#444' },
  submitBtn: { backgroundColor: '#6B1F2A', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 8 },
  submitBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
  cancelBtn: { backgroundColor: '#f7f5f2', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: '#e0ddd8' },
  cancelBtnTxt: { color: '#6B1F2A', fontSize: 14 },
});