import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [magnitude, setMagnitude] = useState(0);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const spikeCount = useRef(0);
  const countdownRef = useRef(null);
  const THRESHOLD = 2.5;

  useEffect(() => {
    // Accelerometer only works on real phone, not browser
    if (Platform.OS === 'web') return;

    const setupSensor = async () => {
      const { Accelerometer } = await import('expo-sensors');
      Accelerometer.setUpdateInterval(100);
      const sub = Accelerometer.addListener(({ x, y, z }) => {
        const mag = Math.sqrt(x * x + y * y + z * z);
        setMagnitude(parseFloat(mag.toFixed(2)));
        if (mag > THRESHOLD) {
          spikeCount.current += 1;
        } else {
          spikeCount.current = 0;
        }
        if (spikeCount.current >= 3 && !alertTriggered) {
          setAlertTriggered(true);
          startCountdown();
        }
      });
      return () => sub.remove();
    };

    setupSensor();
  }, [alertTriggered]);

  function startCountdown() {
    let secs = 5;
    setCountdown(5);
    countdownRef.current = setInterval(() => {
      secs -= 1;
      setCountdown(secs);
      if (secs <= 0) {
        clearInterval(countdownRef.current);
        sendSOS();
      }
    }, 1000);
  }

  function cancelAlert() {
    clearInterval(countdownRef.current);
    setAlertTriggered(false);
    setCountdown(5);
    spikeCount.current = 0;
  }

  function sendSOS() {
    setAlertTriggered(false);
    setCountdown(5);
    spikeCount.current = 0;
    alert('SOS SENT! Location shared with Mom, Dad, Sister');
  }

  const members = [
    { name: 'Mom', battery: '78%', online: true },
    { name: 'Dad', battery: '45%', online: true },
    { name: 'Sister', battery: '91%', online: true },
    { name: 'Brother', battery: 'Off', online: false },
  ];

  if (alertTriggered) {
    return (
      <View style={styles.sosScreen}>
        <Text style={styles.sosIcon}>🚨</Text>
        <Text style={styles.sosTitle}>Threat Detected!</Text>
        <Text style={styles.sosSub}>Violent motion sensed</Text>
        <Text style={styles.countdown}>{countdown}</Text>
        <Text style={styles.sosInfo}>Sending SOS in {countdown} seconds...</Text>
        <Text style={styles.alerting}>Alerting: Mom · Dad · Sister</Text>
        <TouchableOpacity style={styles.cancelBtn} onPress={cancelAlert}>
          <Text style={styles.cancelTxt}>✅ I'm Okay — Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topbar}>
        <View>
          <Text style={styles.topTitle}>SafeWalk 🛡️</Text>
          <Text style={styles.topSub}>Stay protected, always</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MONITORING STATUS</Text>
        <View style={styles.card}>
          <View style={styles.pulseCircle} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Motion sensor active</Text>
            <Text style={styles.cardSub}>
              {Platform.OS === 'web'
                ? 'Open on phone to activate sensor'
                : `Current force: ${magnitude}`}
            </Text>
          </View>
          <View style={styles.liveBadge}>
            <Text style={styles.liveTxt}>Live</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>TODAY</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>3</Text>
            <Text style={styles.statLbl}>Family online</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLbl}>Alerts sent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>2</Text>
            <Text style={styles.statLbl}>Unsafe zones</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>FAMILY PHONES</Text>
        <View style={styles.familyCard}>
          <View style={styles.familyHeader}>
            <Text style={styles.cardTitle}>Who's reachable now</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countTxt}>3 of 4 online</Text>
            </View>
          </View>
          {members.map((m) => (
            <View key={m.name} style={styles.memberRow}>
              <View style={[styles.avatar, { backgroundColor: m.online ? '#fde8ed' : '#f5f5f5' }]}>
                <Text style={{ fontSize: 12, color: m.online ? '#9C3B4A' : '#aaa' }}>{m.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{m.name}</Text>
                <Text style={styles.memberSub}>🔋 {m.battery}</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: m.online ? '#4CAF50' : '#ccc' }]} />
              <Text style={[styles.statusTxt, { color: m.online ? '#2e7d32' : '#aaa' }]}>
                {m.online ? 'Online' : 'Offline'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.sosBtn}
        onPress={() => { setAlertTriggered(true); startCountdown(); }}>
        <Text style={styles.sosBtnTxt}>🚨 SOS — Send Alert Now</Text>
        <Text style={styles.sosBtnSub}>Hold 2 sec · auto-triggers on motion</Text>
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 0.5, borderColor: '#e0ddd8' },
  pulseCircle: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50' },
  cardTitle: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  cardSub: { fontSize: 11, color: '#888', marginTop: 2 },
  liveBadge: { backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  liveTxt: { fontSize: 10, color: '#2e7d32', fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 0.5, borderColor: '#e0ddd8' },
  statNum: { fontSize: 22, fontWeight: '500', color: '#6B1F2A' },
  statLbl: { fontSize: 9, color: '#888', marginTop: 2, textAlign: 'center' },
  familyCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 0.5, borderColor: '#e0ddd8', overflow: 'hidden' },
  familyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0ede8' },
  countBadge: { backgroundColor: '#fde8ed', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  countTxt: { fontSize: 10, color: '#9C3B4A', fontWeight: '500' },
  memberRow: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 8, borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' },
  avatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  memberName: { fontSize: 12, fontWeight: '500', color: '#1a1a1a' },
  memberSub: { fontSize: 10, color: '#888' },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusTxt: { fontSize: 10 },
  sosBtn: { margin: 14, backgroundColor: '#6B1F2A', borderRadius: 14, padding: 16, alignItems: 'center' },
  sosBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '600' },
  sosBtnSub: { color: '#f0c0c8', fontSize: 11, marginTop: 4 },
  sosScreen: { flex: 1, backgroundColor: '#6B1F2A', alignItems: 'center', justifyContent: 'center', padding: 30 },
  sosIcon: { fontSize: 60, marginBottom: 10 },
  sosTitle: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 6 },
  sosSub: { color: '#f0c0c8', fontSize: 14, marginBottom: 20 },
  countdown: { color: '#fff', fontSize: 80, fontWeight: '700' },
  sosInfo: { color: '#f0c0c8', fontSize: 14, marginBottom: 8 },
  alerting: { color: '#fff', fontSize: 13, marginBottom: 30 },
  cancelBtn: { backgroundColor: '#fff', borderRadius: 14, padding: 16, paddingHorizontal: 40 },
  cancelTxt: { color: '#6B1F2A', fontSize: 16, fontWeight: '700' },
});