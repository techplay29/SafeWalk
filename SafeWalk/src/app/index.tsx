import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);

  useEffect(() => {
    checkAlreadyLoggedIn();
    loadSavedProfiles();
  }, []);

 async function checkAlreadyLoggedIn() {
  try {
    const savedName = await AsyncStorage.getItem('username');
    const savedEmail = await AsyncStorage.getItem('email');
    const savedPhone = await AsyncStorage.getItem('phone');
    if (savedName) {
      setName(savedName || '');
      setEmail(savedEmail || '');
      setPhone(savedPhone || '');
      setLoading(false);
      router.replace({ pathname: '/home', params: { username: savedName } });
    } else {
      setLoading(false);
    }
  } catch (e) {
    setLoading(false);
  }
}

  async function loadSavedProfiles() {
    try {
      const profiles = await AsyncStorage.getItem('savedProfiles');
      if (profiles) {
        setSavedProfiles(JSON.parse(profiles));
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function saveProfile(n, em, ph) {
    try {
      const existing = await AsyncStorage.getItem('savedProfiles');
      let profiles = existing ? JSON.parse(existing) : [];
      const alreadyExists = profiles.find(p => p.email === em);
      if (!alreadyExists) {
        profiles.push({ name: n, email: em, phone: ph });
        await AsyncStorage.setItem('savedProfiles', JSON.stringify(profiles));
        setSavedProfiles(profiles);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function selectProfile(profile) {
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setShowNameDropdown(false);
    setShowEmailDropdown(false);
    setShowPhoneDropdown(false);
  }

  function handleLogin() {
    if (!name || !email || !phone) {
      alert('Please fill all fields!');
      return;
    }
    setShowLocationPopup(true);
  }

  async function handleLocationOn() {
    await AsyncStorage.setItem('username', name);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('phone', phone);
    await saveProfile(name, email, phone);
    setShowLocationPopup(false);
    router.replace({ pathname: '/home', params: { username: name } });
  }

  async function handleRemindLater() {
    await AsyncStorage.setItem('username', name);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('phone', phone);
    await saveProfile(name, email, phone);
    setShowLocationPopup(false);
    router.replace({ pathname: '/home', params: { username: name } });
  }

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingIcon}>🛡️</Text>
        <Text style={styles.loadingTxt}>SafeWalk</Text>
        <Text style={styles.loadingSub}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* LOCATION POPUP */}
      <Modal visible={showLocationPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalIcon}>📍</Text>
            <Text style={styles.modalTitle}>Turn On Location</Text>
            <Text style={styles.modalSub}>
              SafeWalk needs your location to send accurate SOS alerts to your trusted contacts in case of an emergency.
            </Text>
            <TouchableOpacity style={styles.modalBtnOn} onPress={handleLocationOn}>
              <Text style={styles.modalBtnOnTxt}>Turn On Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtnLater} onPress={handleRemindLater}>
              <Text style={styles.modalBtnLaterTxt}>Remind Me Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* TOP SECTION */}
      <View style={styles.topSection}>
        <Text style={styles.logo}>🛡️</Text>
        <Text style={styles.appName}>SafeWalk</Text>
        <Text style={styles.tagline}>Your personal safety companion</Text>
      </View>

      {/* FORM */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Get Started</Text>
        <Text style={styles.formSub}>Enter your details to continue</Text>

        {/* NAME FIELD */}
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={(t) => { setName(t); setShowNameDropdown(true); }}
            onFocus={() => setShowNameDropdown(savedProfiles.length > 0)}
            onBlur={() => setTimeout(() => setShowNameDropdown(false), 200)}
          />
          {showNameDropdown && savedProfiles.length > 0 && (
            <View style={styles.dropdown}>
              {savedProfiles.map((p, i) => (
                <TouchableOpacity key={i} style={styles.dropdownItem} onPress={() => selectProfile(p)}>
                  <Text style={styles.dropdownName}>{p.name}</Text>
                  <Text style={styles.dropdownSub}>{p.email}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* EMAIL FIELD */}
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={(t) => { setEmail(t); setShowEmailDropdown(true); }}
            onFocus={() => setShowEmailDropdown(savedProfiles.length > 0)}
            onBlur={() => setTimeout(() => setShowEmailDropdown(false), 200)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {showEmailDropdown && savedProfiles.length > 0 && (
            <View style={styles.dropdown}>
              {savedProfiles.map((p, i) => (
                <TouchableOpacity key={i} style={styles.dropdownItem} onPress={() => selectProfile(p)}>
                  <Text style={styles.dropdownName}>{p.email}</Text>
                  <Text style={styles.dropdownSub}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* PHONE FIELD */}
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="+91 XXXXX XXXXX"
            value={phone}
            onChangeText={(t) => { setPhone(t); setShowPhoneDropdown(true); }}
            onFocus={() => setShowPhoneDropdown(savedProfiles.length > 0)}
            onBlur={() => setTimeout(() => setShowPhoneDropdown(false), 200)}
            keyboardType="phone-pad"
          />
          {showPhoneDropdown && savedProfiles.length > 0 && (
            <View style={styles.dropdown}>
              {savedProfiles.map((p, i) => (
                <TouchableOpacity key={i} style={styles.dropdownItem} onPress={() => selectProfile(p)}>
                  <Text style={styles.dropdownName}>{p.phone}</Text>
                  <Text style={styles.dropdownSub}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnTxt}>Enter SafeWalk 🛡️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>@SafeWalk with Us</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6B1F2A' },
  loadingScreen: { flex: 1, backgroundColor: '#6B1F2A', alignItems: 'center', justifyContent: 'center' },
  loadingIcon: { fontSize: 60, marginBottom: 10 },
  loadingTxt: { color: '#fff', fontSize: 28, fontWeight: '700' },
  loadingSub: { color: '#f0c0c8', fontSize: 14, marginTop: 8 },
  topSection: { alignItems: 'center', paddingTop: 70, paddingBottom: 30 },
  logo: { fontSize: 60, marginBottom: 10 },
  appName: { color: '#fff', fontSize: 32, fontWeight: '700', letterSpacing: 1 },
  tagline: { color: '#f0c0c8', fontSize: 14, marginTop: 6 },
  formCard: { backgroundColor: '#f7f5f2', borderRadius: 24, margin: 16, padding: 24 },
  formTitle: { fontSize: 20, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  formSub: { fontSize: 13, color: '#888', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '500', color: '#444', marginBottom: 6 },
  inputWrapper: { position: 'relative', marginBottom: 14, zIndex: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 14, borderWidth: 0.5, borderColor: '#e0ddd8' },
  dropdown: { position: 'absolute', top: 46, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 10, borderWidth: 0.5, borderColor: '#e0ddd8', zIndex: 999, elevation: 5 },
  dropdownItem: { padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0ede8' },
  dropdownName: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  dropdownSub: { fontSize: 11, color: '#888', marginTop: 2 },
  loginBtn: { backgroundColor: '#6B1F2A', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 6 },
  loginBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '600' },
  footer: { color: '#f0c0c8', fontSize: 13, textAlign: 'center', marginTop: 16, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, margin: 30, alignItems: 'center' },
  modalIcon: { fontSize: 40, marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 10 },
  modalSub: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  modalBtnOn: { backgroundColor: '#6B1F2A', borderRadius: 12, padding: 14, width: '100%', alignItems: 'center', marginBottom: 10 },
  modalBtnOnTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
  modalBtnLater: { backgroundColor: '#f7f5f2', borderRadius: 12, padding: 14, width: '100%', alignItems: 'center', borderWidth: 0.5, borderColor: '#e0ddd8' },
  modalBtnLaterTxt: { color: '#6B1F2A', fontSize: 14, fontWeight: '500' },
});