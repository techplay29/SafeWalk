import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '../firebaseConfig';
export default function FamilyScreen() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Add YOUR own heartbeat to Firebase
    const myHeartbeat = async () => {
      await setDoc(doc(db, 'family', 'Naitika'), {
        name: 'Naitika',
        online: true,
        battery: '85%',
        lastSeen: serverTimestamp(),
      });
    };
    myHeartbeat();

    // Listen to ALL family members in real time
    const unsub = onSnapshot(collection(db, 'family'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setMembers(data);
    });

    return () => unsub();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.topTitle}>Family Status</Text>
        <Text style={styles.topSub}>Real-time phone reachability</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionLabel}>ACTIVE DEVICES</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countTxt}>
              {members.filter(m => m.online).length} of {members.length} online
            </Text>
          </View>
        </View>

        {members.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTxt}>No family members added yet</Text>
            <Text style={styles.emptySub}>Ask family to install SafeWalk and join your group</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {members.map((m, i) => (
              <View key={m.name} style={[styles.memberRow, i < members.length - 1 && styles.borderBottom]}>
                <View style={[styles.avatar, { backgroundColor: m.online ? '#fde8ed' : '#f5f5f5' }]}>
                  <Text style={{ fontSize: 13, color: m.online ? '#9C3B4A' : '#aaa' }}>
                    {m.name ? m.name[0] : '?'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={styles.memberSub}>🔋 {m.battery}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={styles.statusRow}>
                    <View style={[styles.dot, { backgroundColor: m.online ? '#4CAF50' : '#ccc' }]} />
                    <Text style={[styles.statusTxt, { color: m.online ? '#2e7d32' : '#aaa' }]}>
                      {m.online ? 'Online' : 'Offline'}
                    </Text>
                  </View>
                  <Text style={styles.battTxt}>🔋 {m.battery}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ How this works</Text>
          <Text style={styles.infoTxt}>
            Each family member's SafeWalk app sends a check-in every 2 minutes.
            Green dot means their phone is on and will receive your SOS alert.
          </Text>
        </View>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionLabel: { fontSize: 10, fontWeight: '600', color: '#999', letterSpacing: 0.5 },
  countBadge: { backgroundColor: '#fde8ed', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  countTxt: { fontSize: 10, color: '#9C3B4A', fontWeight: '500' },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 0.5, borderColor: '#e0ddd8', overflow: 'hidden' },
  emptyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 0.5, borderColor: '#e0ddd8' },
  emptyTxt: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  emptySub: { fontSize: 11, color: '#888', marginTop: 4, textAlign: 'center' },
  memberRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  borderBottom: { borderBottomWidth: 0.5, borderBottomColor: '#f0ede8' },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  memberName: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  memberSub: { fontSize: 11, color: '#888', marginTop: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  statusTxt: { fontSize: 11, fontWeight: '500' },
  battTxt: { fontSize: 10, color: '#888', marginTop: 2 },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: '#e0ddd8' },
  infoTitle: { fontSize: 13, fontWeight: '500', color: '#1a1a1a', marginBottom: 6 },
  infoTxt: { fontSize: 12, color: '#666', lineHeight: 18 },
});