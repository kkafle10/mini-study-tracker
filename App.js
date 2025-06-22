// Import React and React Native core components
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

// Import AsyncStorage to save/load course data locally
import AsyncStorage from '@react-native-async-storage/async-storage';

// Start of main app function
export default function App() {

  // --------------------- STATE VARIABLES ---------------------
  const [showWelcome, setShowWelcome] = useState(true); // toggles welcome screen
  const [course, setCourse] = useState(''); // course input
  const [hours, setHours] = useState(''); // hours input
  const [minutes, setMinutes] = useState(''); // minutes input
  const [note, setNote] = useState(''); // note input
  const [courses, setCourses] = useState([]); // array of all courses and their sessions

  // --------------------- LOAD COURSES ON START ---------------------
  useEffect(() => {
    loadCourses();
  }, []);

  // Load course data from AsyncStorage
  const loadCourses = async () => {
    try {
      const data = await AsyncStorage.getItem('courses');
      if (data) {
        const parsed = JSON.parse(data);
        setCourses(parsed.map(c => ({ name: c.name, sessions: c.sessions || [] })));
      }
    } catch (e) {
      console.error('Error loading courses:', e);
    }
  };

  // Save course data to AsyncStorage
  const saveCourses = async updated => {
    try {
      await AsyncStorage.setItem('courses', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving courses:', e);
    }
  };

  // --------------------- ADD COURSE / STUDY SESSION ---------------------
  const addCourse = () => {
    const name = course.trim();
    if (!name) return;

    const h = parseInt(hours, 10) || 0;
    const m = parseInt(minutes, 10) || 0;
    const totalMins = h * 60 + m;
    const text = note.trim();

    // Only create session if there's time or note
    const newSession = (totalMins > 0 || text) ? { time: totalMins, note: text } : null;

    // Check if course already exists
    const existingIndex = courses.findIndex(
      c => c.name.toLowerCase() === name.toLowerCase()
    );

    let updatedCourses;
    if (existingIndex >= 0) {
      // Append session to existing course
      updatedCourses = courses.map((c, i) =>
        i === existingIndex && newSession
          ? { ...c, sessions: [...c.sessions, newSession] }
          : c
      );
    } else {
      // Add new course
      updatedCourses = [
        ...courses,
        { name, sessions: newSession ? [newSession] : [] }
      ];
    }

    // Update state and storage
    setCourses(updatedCourses);
    saveCourses(updatedCourses);

    // Reset input fields
    setCourse('');
    setHours('');
    setMinutes('');
    setNote('');
  };

  // --------------------- DELETE SESSION ---------------------
  const deleteSession = (courseIdx, sessionIdx) => {
    const updatedCourses = courses.map((c, i) =>
      i === courseIdx
        ? { ...c, sessions: c.sessions.filter((_, j) => j !== sessionIdx) }
        : c
    );
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  // --------------------- DELETE ENTIRE COURSE ---------------------
  const deleteCourse = index => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated);
    saveCourses(updated);
  };

  // --------------------- FORMATTERS ---------------------
  // Convert minutes into "Xh Ym" format
  const formatTime = minutes => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  // Calculate total time spent in a course
  const totalCourseTime = sessions =>
    sessions.reduce((sum, s) => sum + s.time, 0);

  // --------------------- WELCOME SCREEN ---------------------
  if (showWelcome) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require('./assets/study.jpeg')}
            style={styles.banner}
            pointerEvents="none" // makes sure image doesn’t block touches
          />
          <Text style={styles.title}>Welcome to Mini Study Tracker</Text>

          <View style={styles.touchable}>
            <TouchableOpacity
              onPress={() => setShowWelcome(false)}
              activeOpacity={0.7}
              style={styles.getStartedButton}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // --------------------- MAIN APP SCREEN ---------------------
  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={courses}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            {/* App Title */}
            <Text style={styles.title}>Mini Study Tracker</Text>

            {/* Course Input Row */}
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 2 }]}
                placeholder="Course name"
                value={course}
                onChangeText={setCourse}
              />
              <Button title="Add" onPress={addCourse} color="#a8bba8" />
            </View>

            {/* Time and Note Input */}
            <Text style={styles.subHeading}>Log study time:</Text>
            <View style={styles.timeInputs}>
              <TextInput
                style={[styles.timeInput, { marginRight: 10 }]}
                placeholder="Hours"
                keyboardType="numeric"
                value={hours}
                onChangeText={setHours}
              />
              <TextInput
                style={styles.timeInput}
                placeholder="Minutes"
                keyboardType="numeric"
                value={minutes}
                onChangeText={setMinutes}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Add a note"
              value={note}
              onChangeText={setNote}
            />
          </>
        }

        // --------------------- COURSE CARDS ---------------------
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.course}>{item.name}</Text>

            {/* List of Sessions */}
            {item.sessions.length > 0 && (
              <View style={styles.notesSection}>
                {item.sessions.map((session, i) => (
                  <View key={i} style={styles.sessionRow}>
                    <Text style={styles.noteItem}>
                      • {formatTime(session.time)} — {session.note}
                    </Text>
                    <TouchableOpacity onPress={() => deleteSession(index, i)}>
                      <Text style={styles.deleteSession}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Total Time Display */}
            <Text style={styles.totalText}>
              Total: {formatTime(totalCourseTime(item.sessions))}
            </Text>

            {/* Delete Button */}
            <View style={styles.cardButtons}>
              <Button
                title="Delete"
                onPress={() => deleteCourse(index)}
                color="#6f8b6f"
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// --------------------- STYLES ---------------------
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fdf6f0' },
  container: { padding: 20, paddingBottom: 80 },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  banner: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5f4c4c',
    marginBottom: 15
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7d5c5c',
    marginTop: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#d3a29c',
    backgroundColor: '#fff8f3',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  timeInputs: { flexDirection: 'row', marginVertical: 10 },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d3a29c',
    backgroundColor: '#fff8f3',
    padding: 10,
    borderRadius: 8
  },
  card: {
    padding: 15,
    backgroundColor: '#fceae8',
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e4c2b5'
  },
  course: { fontSize: 18, fontWeight: '600', color: '#6b4c4c' },
  notesSection: {
    marginTop: 10,
    backgroundColor: '#f9f1ef',
    padding: 10,
    borderRadius: 6
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  noteItem: { fontSize: 14, color: '#6e5c6c', flex: 1 },
  deleteSession: { marginLeft: 10, fontSize: 16 },
  totalText: {
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'right',
    color: '#8b6a6a'
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  touchable: {
    marginTop: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  getStartedButton: {
    backgroundColor: '#a8bba8',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10
  },
  getStartedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

