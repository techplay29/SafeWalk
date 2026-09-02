import { Audio } from 'expo-av';
import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function HomeScreen() {
  const [magnitude, setMagnitude] = useState(0);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState('Fetching location...');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [alertCount, setAlertCount] = useState(0);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [unsafeZones, setUnsafeZones] = useState([]);
  const { username } = useLocalSearchParams();
  const spikeCount = useRef(0);
  const countdownRef = useRef(null);
  const soundRef = useRef(null);
  const THRESHOLD = 2.5;

  useEffect(() => {
    getLocation();
    setupBatteryMonitor();
    loadFamilyMembers();
    loadUnsafeZones();
    loadAlertCount();

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

  function loadFamilyMembers() {
    const unsub = onSnapshot(collection(db, 'family'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFamilyMembers(data);
    });
    return unsub;
  }

  function loadUnsafeZones() {
    const unsub = onSnapshot(collection(db, 'unsafeZones'), (snapshot) => {
      setUnsafeZones(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }

  function loadAlertCount() {
    const unsub = onSnapshot(collection(db, 'sosAlerts'), (snapshot) => {
      setAlertCount(snapshot.docs.length);
    });
    return unsub;
  }

  async function setupBatteryMonitor() {
    try {
      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(Math.round(level * 100));
      Battery.addBatteryLevelListener(async ({ batteryLevel: newLevel }) => {
        const pct = Math.round(newLevel * 100);
        setBatteryLevel(pct);
        if (pct <= 10) {
          try {
            const loc = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = loc.coords;
            const link = `https://maps.google.com/?q=${latitude},${longitude}`;
            await addDoc(collection(db, 'batteryAlerts'), {
              location: link,
              battery: pct,
              timestamp: serverTimestamp(),
              sentBy: username || 'User',
              message: 'Battery critical! Last known location shared automatically.',
            });
            alert(`🔋 Battery at ${pct}%!\nYour location has been auto-shared with family.`);
          } catch (e) {
            console.log('Battery alert error', e);
          }
        }
      });
    } catch (e) {
      console.log('Battery error', e);
    }
  }

  async function getLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Location permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setLocation(`https://maps.google.com/?q=${latitude},${longitude}`);
    } catch (e) {
      setLocation('Could not fetch location');
    }
  }

  async function startCountdown() {
    let secs = 5;
    setCountdown(5);
    Vibration.vibrate([500, 500, 500, 500], true);
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg' },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      soundRef.current = sound;
    } catch (e) {
      console.log('sound error', e);
    }
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
    Vibration.cancel();
    if (soundRef.current) {
      soundRef.current.stopAsync();
      soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setAlertTriggered(false);
    setCountdown(5);
    spikeCount.current = 0;
  }

  async function sendSOS() {
    Vibration.cancel();
    if (soundRef.current) {
      soundRef.current.stopAsync();
      soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    try {
      await addDoc(collection(db, 'sosAlerts'), {
        location: location,
        timestamp: serverTimestamp(),
        sentBy: username || 'User',
        alertedContacts: ['Mom', 'Dad', 'Sister'],
        status: 'sent',
      });
    } catch (e) {
      console.log('Firebase error', e);
    }
    setAlertTriggered(false);
    setCountdown(5);
    spikeCount.current = 0;
    alert(`🚨 SOS SENT!\nLocation: ${location}\nAlert sent to trusted contacts`);
  }

  const onlineMembers = familyMembers.filter(m => m.online);

  if (alertTriggered) {
    return (
      <View style={styles.sosScreen}>
        <Text style={styles.sosIcon}>🚨</Text>
        <Text style={styles.sosTitle}>Threat Detected!</Text>
        <Text style={styles.sosSub}>Violent motion sensed</Text>
        <Text style={styles.countdown}>{countdown}</Text>
        <Text style={styles.sosInfo}>Sending SOS in {countdown} seconds...</Text>
        <Text style={styles.alerting}>Alerting trusted contacts...</Text>
        <View style={styles.locationBox}>
          <Text style={styles.locationTxt}>📍 {location}</Text>
        </View>
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
          <Text style={styles.welcome}>👋 Welcome, {username || 'User'}!</Text>
          <Text style={styles.topTitle}>SafeWalk 🛡️</Text>
          <Text style={styles.topSub}>Stay protected, always</Text>
        </View>
        <View style={styles.batteryBadge}>
          <Text style={styles.batteryTxt}>🔋 {batteryLevel}%</Text>
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
        <Text style={styles.sectionLabel}>YOUR LOCATION</Text>
        <View style={styles.locationCard}>
          <Text style={styles.locationCardTxt}>📍 {location}</Text>
        </View>
      </View>

      {batteryLevel <= 20 && (
        <View style={styles.section}>
          <View style={styles.batteryWarning}>
            <Text style={styles.batteryWarningTxt}>
              ⚠️ Battery at {batteryLevel}% — Location will auto-share at 10%
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>TODAY</Text>
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/family')}>
            <Text style={styles.statNum}>{onlineMembers.length}</Text>
            <Text style={styles.statLbl}>Family online</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => alert(`You have sent ${alertCount} SOS alerts`)}>
            <Text style={styles.statNum}>{alertCount}</Text>
            <Text style={styles.statLbl}>Alerts sent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/map')}>
            <Text style={styles.statNum}>{unsafeZones.length}</Text>
            <Text style={styles.statLbl}>Unsafe zones</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>FAMILY PHONES</Text>
        <View style={styles.familyCard}>
          <TouchableOpacity style={styles.familyHeader} onPress={() => router.push('/family')}>
            <Text style={styles.cardTitle}>Who's reachable now</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countTxt}>{onlineMembers.length} of {familyMembers.length} online ›</Text>
            </View>
          </TouchableOpacity>
          {familyMembers.length === 0 ? (
            <View style={styles.emptyFamily}>
              <Text style={styles.emptyFamilyTxt}>No family members connected yet</Text>
              <Text style={styles.emptyFamilySub}>Go to Family tab to add members</Text>
            </View>
          ) : (
            familyMembers.map((m) => (
              <View key={m.id} style={styles.memberRow}>
                <View style={[styles.avatar, { backgroundColor: m.online ? '#fde8ed' : '#f5f5f5' }]}>
                  <Text style={{ fontSize: 12, color: m.online ? '#9C3B4A' : '#aaa' }}>
                    {m.name ? m.name[0] : '?'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={styles.memberSub}>🔋 {m.battery || 'Unknown'}</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: m.online ? '#4CAF50' : '#ccc' }]} />
                <Text style={[styles.statusTxt, { color: m.online ? '#2e7d32' : '#aaa' }]}>
                  {m.online ? 'Online' : 'Offline'}
                </Text>
              </View>
            ))
          )}
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
  topbar: { backgroundColor: '#6B1F2A', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcome: { color: '#f0c0c8', fontSize: 12, marginBottom: 2 },
  topTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  topSub: { color: '#f0c0c8', fontSize: 12, marginTop: 2 },
  batteryBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  batteryTxt: { color: '#fff', fontSize: 12, fontWeight: '500' },
  section: { padding: 14, paddingBottom: 0 },
  sectionLabel: { fontSize: 10, fontWeight: '600', color: '#999', letterSpacing: 0.5, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 0.5, borderColor: '#e0ddd8' },
  pulseCircle: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50' },
  cardTitle: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  cardSub: { fontSize: 11, color: '#888', marginTop: 2 },
  liveBadge: { backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  liveTxt: { fontSize: 10, color: '#2e7d32', fontWeight: '500' },
  locationCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 0.5, borderColor: '#e0ddd8' },
  locationCardTxt: { fontSize: 11, color: '#444' },
  batteryWarning: { backgroundColor: '#fff8e1', borderRadius: 12, padding: 12, borderWidth: 0.5, borderColor: '#EF9F27' },
  batteryWarningTxt: { fontSize: 12, color: '#854F0B', fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 0.5, borderColor: '#e0ddd8' },
  statNum: { fontSize: 22, fontWeight: '500', color: '#6B1F2A' },
  statLbl: { fontSize: 9, color: '#888', marginTop: 2, textAlign: 'center' },
  familyCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 0.5, borderColor: '#e0ddd8', overflow: 'hidden' },
  familyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0ede8' },
  countBadge: { backgroundColor: '#fde8ed', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  countTxt: { fontSize: 10, color: '#9C3B4A', fontWeight: '500' },
  emptyFamily: { padding: 16, alignItems: 'center' },
  emptyFamilyTxt: { fontSize: 12, fontWeight: '500', color: '#1a1a1a' },
  emptyFamilySub: { fontSize: 11, color: '#888', marginTop: 4 },
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
  alerting: { color: '#fff', fontSize: 13, marginBottom: 10 },
  locationBox: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 8, marginBottom: 20, width: '100%' },
  locationTxt: { color: '#fff', fontSize: 10, textAlign: 'center' },
  cancelBtn: { backgroundColor: '#fff', borderRadius: 14, padding: 16, paddingHorizontal: 40 },
  cancelTxt: { color: '#6B1F2A', fontSize: 16, fontWeight: '700' },
});