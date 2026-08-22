import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [motionDetection, setMotionDetection] = useState(true);
  const [evidenceBuffer, setEvidenceBuffer] = useState(true);
  const [batteryShare, setBatteryShare] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.topTitle}>Settings</Text>
        <Text style={styles.topSub}>Customise SafeWalk</Text>
      </View>

      {/* DETECTION SETTINGS */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>DETECTION</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: '#fde8ed' }]}>
              <Text>📡</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Motion detection</Text>
              <Text style={styles.rowSub}>Auto-sense struggle or fall</Text>
            </View>
            <Switch
              value={motionDetection}
              onValueChange={setMotionDetection}
              trackColor={{ false: '#ddd', true: '#6B1F2A' }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.row, styles.borderTop]}>
            <View style={[styles.icon, { backgroundColor: '#e8f5e9' }]}>
              <Text>🎙️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Evidence buffer</Text>
              <Text style={styles.rowSub}>Record 20s before SOS</Text>
            </View>
            <Switch
              value={evidenceBuffer}
              onValueChange={setEvidenceBuffer}
              trackColor={{ false: '#ddd', true: '#6B1F2A' }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.row, styles.borderTop]}>
            <View style={[styles.icon, { backgroundColor: '#faeeda' }]}>
              <Text>🔋</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Battery auto-share</Text>
              <Text style={styles.rowSub}>Send location at 10% battery</Text>
            </View>
            <Switch
              value={batteryShare}
              onValueChange={setBatteryShare}
              trackColor={{ false: '#ddd', true: '#6B1F2A' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* SENSITIVITY */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SENSITIVITY</Text>
        <View style={styles.card}>
          <View style={styles.sensitivityBox}>
            <Text style={styles.rowTitle}>Motion threshold</Text>
            <Text style={styles.rowSub}>How easily the app detects a threat</Text>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Low</Text>
              <View style={styles.sliderTrack}>
                <View style={styles.sliderFill} />
                <View style={styles.sliderThumb} />
              </View>
              <Text style={styles.sliderLabel}>High</Text>
            </View>
          </View>
        </View>
      </View>

      {/* PRIVACY */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PRIVACY</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: '#e3effe' }]}>
              <Text>👥</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Family group code</Text>
              <Text style={styles.rowSub}>Invite family members</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={[styles.row, styles.borderTop]}>
            <View style={[styles.icon, { backgroundColor: '#fde8ed' }]}>
              <Text>🔒</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Privacy mode</Text>
              <Text style={styles.rowSub}>Hide app from recent apps</Text>
            </View>
            <Switch
              value={privacyMode}
              onValueChange={setPrivacyMode}
              trackColor={{ false: '#ddd', true: '#6B1F2A' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* TRUSTED CONTACTS */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>TRUSTED CONTACTS</Text>
        <View style={styles.card}>
          {['Mom', 'Dad', 'Sister'].map((name, i) => (
            <View key={name} style={[styles.row, i > 0 && styles.borderTop]}>
              <View style={[styles.avatar]}>
                <Text style={styles.avatarTxt}>{name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{name}</Text>
                <Text style={styles.rowSub}>Will receive SOS alert</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.deleteTxt}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnTxt}>+ Add Trusted Contact</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f5f2' },
  topbar: { backgroundColor: '#6B1F2A', padding: 16 },
  topTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  topSub: { color: '#f0c0c8', fontSize: 12, marginTop: 2 },
  section: { padding: 14, paddingBottom: 0 },
  sectionLabel: { fontSize: 10, fontWeight: '600', color: '#999', letterSpacing: 0.5, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 0.5, borderColor: '#e0ddd8', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  borderTop: { borderTopWidth: 0.5, borderTopColor: '#f0ede8' },
  icon: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  rowSub: { fontSize: 11, color: '#888', marginTop: 1 },
  chevron: { fontSize: 20, color: '#ccc' },
  sensitivityBox: { padding: 12 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  sliderLabel: { fontSize: 11, color: '#888' },
  sliderTrack: { flex: 1, height: 4, backgroundColor: '#e0ddd8', borderRadius: 2, position: 'relative' },
  sliderFill: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '60%', backgroundColor: '#6B1F2A', borderRadius: 2 },
  sliderThumb: { position: 'absolute', left: '58%', top: -6, width: 16, height: 16, backgroundColor: '#6B1F2A', borderRadius: 8, borderWidth: 2, borderColor: '#fff' },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fde8ed', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 13, color: '#9C3B4A', fontWeight: '500' },
  deleteTxt: { fontSize: 16 },
  addBtn: { marginTop: 8, backgroundColor: '#6B1F2A', borderRadius: 12, padding: 14, alignItems: 'center' },
  addBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },
});