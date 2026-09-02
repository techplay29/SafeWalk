import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [motionDetection, setMotionDetection] = useState(true);
  const [evidenceBuffer, setEvidenceBuffer] = useState(true);
  const [batteryShare, setBatteryShare] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [threshold, setThreshold] = useState(50);
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom', phone: '+91 98765 00001' },
    { id: 2, name: 'Dad', phone: '+91 98765 00002' },
    { id: 3, name: 'Sister', phone: '+91 98765 00003' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [familyCode] = useState('SAFE-2024-XK9');

  function addContact() {
    if (!newName || !newPhone) {
      alert('Please enter name and phone number!');
      return;
    }
    setContacts([...contacts, { id: Date.now(), name: newName, phone: newPhone }]);
    setNewName('');
    setNewPhone('');
    setShowAddModal(false);
    alert(`${newName} added as trusted contact!`);
  }

  function deleteContact(id) {
    setContacts(contacts.filter(c => c.id !== id));
  }

  async function confirmLogout() {
    setShowLogoutModal(false);
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('phone');
    router.replace('/');
  }

  return (
    <ScrollView style={styles.container}>

      {/* ADD CONTACT MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Trusted Contact</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={newName}
              onChangeText={setNewName}
            />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 XXXXX XXXXX"
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.modalAddBtn} onPress={addContact}>
              <Text style={styles.modalAddBtnTxt}>Add Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FAMILY CODE MODAL */}
      <Modal visible={showFamilyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Family Group Code</Text>
            <Text style={styles.modalSub}>Share this code with family members to connect them to your SafeWalk group</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{familyCode}</Text>
            </View>
            <TouchableOpacity style={styles.modalAddBtn} onPress={() => alert(`Code: ${familyCode}`)}>
              <Text style={styles.modalAddBtnTxt}>Copy Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowFamilyModal(false)}>
              <Text style={styles.modalCancelBtnTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>🚪 Logout</Text>
            <Text style={styles.modalSub}>Are you sure you want to logout? Your details will be remembered for next login.</Text>
            <TouchableOpacity style={styles.modalAddBtn} onPress={confirmLogout}>
              <Text style={styles.modalAddBtnTxt}>Yes, Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowLogoutModal(false)}>
              <Text style={styles.modalCancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* TOP BAR */}
      <View style={styles.topbar}>
        <View>
          <Text style={styles.topTitle}>⚙️ Settings</Text>
          <Text style={styles.topSub}>Customise SafeWalk</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowLogoutModal(true)}>
          <Text style={styles.logoutTxt}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      {/* DETECTION */}
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
            <Switch value={motionDetection} onValueChange={setMotionDetection}
              trackColor={{ false: '#ddd', true: '#6B1F2A' }} thumbColor="#fff" />
          </View>
          <View style={[styles.row, styles.borderTop]}>
            <View style={[styles.icon, { backgroundColor: '#e8f5e9' }]}>
              <Text>🎙️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Evidence buffer</Text>
              <Text style={styles.rowSub}>Record 20s before SOS</Text>
            </View>
            <Switch value={evidenceBuffer} onValueChange={setEvidenceBuffer}
              trackColor={{ false: '#ddd', true: '#6B1F2A' }} thumbColor="#fff" />
          </View>
          <View style={[styles.row, styles.borderTop]}>
            <View style={[styles.icon, { backgroundColor: '#faeeda' }]}>
              <Text>🔋</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Battery auto-share</Text>
              <Text style={styles.rowSub}>Send location at 10% battery</Text>
            </View>
            <Switch value={batteryShare} onValueChange={setBatteryShare}
              trackColor={{ false: '#ddd', true: '#6B1F2A' }} thumbColor="#fff" />
          </View>
        </View>
      </View>

      {/* SENSITIVITY */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SENSITIVITY</Text>
        <View style={styles.card}>
          <View style={styles.sensitivityBox}>
            <Text style={styles.rowTitle}>Motion threshold: {threshold}%</Text>
            <Text style={styles.rowSub}>How easily the app detects a threat</Text>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Low</Text>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${threshold}%` }]} />
              </View>
              <Text style={styles.sliderLabel}>High</Text>
            </View>
            <View style={styles.sliderBtns}>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => setThreshold(Math.max(10, threshold - 10))}>
                <Text style={styles.sliderBtnTxt}>− Less sensitive</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => setThreshold(Math.min(100, threshold + 10))}>
                <Text style={styles.sliderBtnTxt}>+ More sensitive</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* PRIVACY */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PRIVACY</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => setShowFamilyModal(true)}>
            <View style={[styles.icon, { backgroundColor: '#e3effe' }]}>
              <Text>👥</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Family group code</Text>
              <Text style={styles.rowSub}>Tap to invite family members</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={[styles.row, styles.borderTop]}>
            <View style={[styles.icon, { backgroundColor: '#fde8ed' }]}>
              <Text>🔒</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Privacy mode</Text>
              <Text style={styles.rowSub}>Hide app from recent apps</Text>
            </View>
            <Switch value={privacyMode} onValueChange={setPrivacyMode}
              trackColor={{ false: '#ddd', true: '#6B1F2A' }} thumbColor="#fff" />
          </View>
        </View>
      </View>

      {/* TRUSTED CONTACTS */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>TRUSTED CONTACTS</Text>
        <View style={styles.card}>
          {contacts.map((c, i) => (
            <View key={c.id} style={[styles.row, i > 0 && styles.borderTop]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarTxt}>{c.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{c.name}</Text>
                <Text style={styles.rowSub}>{c.phone}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteContact(c.id)} style={styles.deleteBtn}>
                <Text style={styles.deleteTxt}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addBtnTxt}>+ Add Trusted Contact</Text>
        </TouchableOpacity>
      </View>

      {/* LOGOUT SECTION */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutSection} onPress={() => setShowLogoutModal(true)}>
          <Text style={styles.logoutSectionTxt}>🚪 Logout from SafeWalk</Text>
          <Text style={styles.logoutSectionSub}>Your details will be remembered for next login</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f5f2' },
  topbar: { backgroundColor: '#6B1F2A', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  topSub: { color: '#f0c0c8', fontSize: 12, marginTop: 2 },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  logoutTxt: { color: '#fff', fontSize: 12, fontWeight: '500' },
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
  sliderTrack: { flex: 1, height: 6, backgroundColor: '#e0ddd8', borderRadius: 3 },
  sliderFill: { height: 6, backgroundColor: '#6B1F2A', borderRadius: 3 },
  sliderBtns: { flexDirection: 'row', gap: 8, marginTop: 12 },
  sliderBtn: { flex: 1, backgroundColor: '#fde8ed', borderRadius: 8, padding: 8, alignItems: 'center' },
  sliderBtnTxt: { fontSize: 11, color: '#6B1F2A', fontWeight: '500' },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fde8ed', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 13, color: '#9C3B4A', fontWeight: '500' },
  deleteBtn: { backgroundColor: '#fde8ed', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  deleteTxt: { fontSize: 11, color: '#e24b4a' },
  addBtn: { marginTop: 8, backgroundColor: '#6B1F2A', borderRadius: 12, padding: 14, alignItems: 'center' },
  addBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },
  logoutSection: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e24b4a' },
  logoutSectionTxt: { fontSize: 14, fontWeight: '600', color: '#e24b4a' },
  logoutSectionSub: { fontSize: 11, color: '#888', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, margin: 20, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 8, textAlign: 'center' },
  modalSub: { fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 16, lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '500', color: '#444', marginBottom: 6 },
  input: { backgroundColor: '#f7f5f2', borderRadius: 10, padding: 12, fontSize: 14, borderWidth: 0.5, borderColor: '#e0ddd8', marginBottom: 14 },
  modalAddBtn: { backgroundColor: '#6B1F2A', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 8 },
  modalAddBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
  modalCancelBtn: { backgroundColor: '#f7f5f2', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: '#e0ddd8' },
  modalCancelBtnTxt: { color: '#6B1F2A', fontSize: 14 },
  codeBox: { backgroundColor: '#fde8ed', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  codeText: { fontSize: 20, fontWeight: '700', color: '#6B1F2A', letterSpacing: 2 },
});