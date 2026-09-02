import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExploreScreen() {
  const features = [
    { icon: '📡', title: 'Passive Threat Detection', desc: 'Unlike every other safety app, SafeWalk detects danger automatically using your phone\'s motion sensors — no button press needed, even if your hands are restrained.', color: '#fde8ed' },
    { icon: '🚨', title: 'Instant SOS with Evidence', desc: 'Sends your live GPS location AND audio evidence from the 20 seconds before the trigger — so help arrives with proof, not just a location ping.', color: '#fde8ed' },
    { icon: '👨‍👩‍👧', title: 'Real-Time Family Reachability', desc: 'Know before an emergency who will actually receive your SOS. See which family members\' phones are on, their battery level, and when they were last active.', color: '#e3effe' },
    { icon: '🗺️', title: 'Crowdsourced Safety Map', desc: 'A living, community-built map of dangerous areas — reported by real users with risk levels and reasons. Avoid unsafe routes before you even enter them.', color: '#faeeda' },
    { icon: '🔋', title: 'Dead Phone Protection', desc: 'Most safety apps fail when your battery dies. SafeWalk automatically shares your last known location the moment battery hits 10% — before the phone shuts off.', color: '#faeeda' },
    { icon: '🎙️', title: 'Pre-Event Evidence Buffer', desc: 'A rolling 20-second audio recording runs silently in the background. When SOS triggers, it saves what happened BEFORE the button — not just after.', color: '#e8f5e9' },
    { icon: '⏱️', title: '5-Second Safety Net', desc: 'A cancellable countdown before every SOS fires — so accidental triggers from running, dropping the phone, or kids playing never send a false alarm.', color: '#f5f5f5' },
    { icon: '🔒', title: 'Privacy by Design', desc: 'Your location is never shared publicly. Only your chosen trusted contacts receive it, only during an active SOS — never stored or sold to third parties.', color: '#f5f5f5' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.topTitle}>🛡️ About SafeWalk</Text>
        <Text style={styles.topSub}>Built different. Built for real emergencies.</Text>
      </View>

      {/* MISSION */}
      <View style={styles.section}>
        <View style={styles.missionCard}>
          <Text style={styles.missionTitle}>Why SafeWalk exists</Text>
          <Text style={styles.missionTxt}>
            Every existing safety app has one fatal flaw — it assumes you can press a button when danger strikes. In reality, the most critical moment is exactly when you cannot act. SafeWalk was built to close that gap: a system that detects threats on its own, preserves evidence automatically, and ensures your family knows where you are — even if your phone is about to die.
          </Text>
        </View>
      </View>

      {/* HOW IT WORKS */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
        <View style={styles.stepsCard}>
          {[
            { num: '1', title: 'Always watching', sub: 'Motion sensors run silently in the background the moment you open SafeWalk' },
            { num: '2', title: 'Threat detected', sub: 'Violent, irregular motion triggers a 5-second cancellable countdown automatically' },
            { num: '3', title: 'SOS fires', sub: 'Live GPS location + pre-event audio sent instantly to all trusted contacts' },
            { num: '4', title: 'Family responds', sub: 'Contacts see your exact location in real time and know you need help' },
          ].map((s, i) => (
            <View key={i} style={[styles.step, i > 0 && styles.borderTop]}>
              <View style={styles.stepNum}><Text style={styles.stepNumTxt}>{s.num}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepSub}>{s.sub}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* FEATURES */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>WHAT MAKES IT DIFFERENT</Text>
        {features.map((f, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: f.color }]}>
              <Text style={{ fontSize: 22 }}>{f.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* STATS */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>BY THE NUMBERS</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>5s</Text>
            <Text style={styles.statLbl}>Cancel window before SOS fires</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>20s</Text>
            <Text style={styles.statLbl}>Pre-event audio preserved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>10%</Text>
            <Text style={styles.statLbl}>Battery level for auto location share</Text>
          </View>
        </View>
      </View>

      {/* TECH STACK */}
      <View style={styles.section}>
        <View style={styles.techCard}>
          <Text style={styles.techTitle}>⚙️ Built With</Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}><Text style={styles.tagTxt}>React Native</Text></View>
            <View style={styles.tag}><Text style={styles.tagTxt}>Firebase</Text></View>
            <View style={styles.tag}><Text style={styles.tagTxt}>Expo</Text></View>
            <View style={styles.tag}><Text style={styles.tagTxt}>GPS Sensors</Text></View>
            <View style={styles.tag}><Text style={styles.tagTxt}>Accelerometer</Text></View>
            <View style={styles.tag}><Text style={styles.tagTxt}>Gyroscope</Text></View>
            <View style={styles.tag}><Text style={styles.tagTxt}>Cloud Storage</Text></View>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.homeBtn} onPress={() => router.push('/home')}>
        <Text style={styles.homeBtnTxt}>Back to Home 🏠</Text>
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
  section: { padding: 14, paddingBottom: 0 },
  sectionLabel: { fontSize: 10, fontWeight: '600', color: '#999', letterSpacing: 0.5, marginBottom: 8 },
  missionCard: { backgroundColor: '#6B1F2A', borderRadius: 16, padding: 18 },
  missionTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  missionTxt: { color: '#f0c0c8', fontSize: 13, lineHeight: 20 },
  stepsCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 0.5, borderColor: '#e0ddd8', overflow: 'hidden' },
  step: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  borderTop: { borderTopWidth: 0.5, borderTopColor: '#f0ede8' },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#6B1F2A', alignItems: 'center', justifyContent: 'center' },
  stepNumTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  stepTitle: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  stepSub: { fontSize: 11, color: '#888', marginTop: 2 },
  featureCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderWidth: 0.5, borderColor: '#e0ddd8', marginBottom: 8 },
  featureIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureTitle: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  featureDesc: { fontSize: 11, color: '#666', lineHeight: 17 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 0.5, borderColor: '#e0ddd8' },
  statNum: { fontSize: 22, fontWeight: '700', color: '#6B1F2A' },
  statLbl: { fontSize: 9, color: '#888', marginTop: 4, textAlign: 'center', lineHeight: 13 },
  techCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: '#e0ddd8' },
  techTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 12 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#fde8ed', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  tagTxt: { fontSize: 11, color: '#6B1F2A', fontWeight: '500' },
  homeBtn: { margin: 14, backgroundColor: '#6B1F2A', borderRadius: 14, padding: 16, alignItems: 'center' },
  homeBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
});