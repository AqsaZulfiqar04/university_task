import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';

 const dummyNotices = [
    {
      id: '1',
      title: 'Semester Break Notice',
      date: '2025-05-10',
      content: 'University will be closed from 15th May to 25th May.',
      category: 'Academic',
      image:
        'https://img.freepik.com/free-vector/school-closed-background-design_23-2148495100.jpg',
    },
    {
      id: '2',
      title: 'Fee Submission Deadline',
      date: '2025-05-05',
      content: 'Submit semester fee by 20th May to avoid fines.',
      category: 'Academic',
      image:
        'https://img.freepik.com/free-vector/money-transfer-concept-illustration_114360-2176.jpg',
    },
    {
      id: '3',
      title: 'Workshop on AI',
      date: '2025-05-01',
      content: 'Join the 2-day workshop on latest AI trends.',
      category: 'Events',
      image:
        'https://img.freepik.com/free-vector/artificial-intelligence-concept_23-2147501742.jpg',
    },
    {
      id: '4',
      title: 'Hostel Maintenance',
      date: '2025-05-02',
      content: 'Hostel water supply maintenance on 4th May.',
      category: 'General',
      image:
        'https://img.freepik.com/free-vector/under-maintenance-concept-illustration_114360-747.jpg',
    },
  ];


const categories = ['All', 'Academic', 'Events', 'General'];

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  // Track if currently viewing admin or student panel
  const [isAdminPanel, setIsAdminPanel] = useState(false);

  // Student panel states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentContent, setAssignmentContent] = useState('');

  // Filter notices based on selected category
  const filteredNotices =
    selectedCategory === 'All'
      ? dummyNotices
      : dummyNotices.filter((notice) => notice.category === selectedCategory);

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      setLoggedIn(true);
    } else {
      alert('Please enter username and password.');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
    setIsAdminPanel(false);
  };

  const submitAssignment = () => {
    if (assignmentTitle.trim() && assignmentContent.trim()) {
      alert('Assignment submitted successfully!');
      setAssignmentTitle('');
      setAssignmentContent('');
    } else {
      alert('Please fill all fields before submitting.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate fetching new notices
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Notice item render
  const renderNotice = ({ item }) => (
    <View style={styles.noticeCard}>
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text style={styles.noticeDate}>{item.date}</Text>
      <Text style={styles.noticeContent}>{item.content}</Text>
      <View style={[styles.categoryChip, { backgroundColor: getCategoryColor(item.category) }]}>
        <Text style={styles.categoryChipText}>{item.category}</Text>
      </View>
    </View>
  );

  const getCategoryColor = (category) => {
    const colors = {
      Academic: '#4E89AE',
      Events: '#F4A261',
      General: '#2A9D8F',
      All: '#264653',
    };
    return colors[category] || colors.All;
  };

  // --- Student Panel UI ---
  const StudentPanel = () => (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Student Panel</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.switchButton, { marginRight: 8 }]}
            onPress={() => setIsAdminPanel(true)}
          >
            <Text style={styles.switchButtonText}>Switch to Admin Panel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, { backgroundColor: '#FF4C4C' }]}
            onPress={handleLogout}
          >
            <Text style={styles.switchButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Assignment Submission */}
      <View style={styles.panelCard}>
        <Text style={styles.cardTitle}>Submit Assignment</Text>
        <TextInput
          style={styles.input}
          placeholder="Assignment Title"
          value={assignmentTitle}
          onChangeText={setAssignmentTitle}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Assignment Content"
          value={assignmentContent}
          onChangeText={setAssignmentContent}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={submitAssignment}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Notices Section */}
      <View style={{ flex: 1, marginTop: 20 }}>
        <Text style={[styles.panelTitle, { marginBottom: 10 }]}>Notices</Text>

        {/* Horizontal scroll for categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryButton,
                selectedCategory === cat && { backgroundColor: '#264653' },
              ]}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === cat && { color: 'white' },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator size="large" color="#264653" />
        ) : (
          <FlatList
            data={filteredNotices}
            keyExtractor={(item) => item.id}
            renderItem={renderNotice}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </View>
  );

  // --- Admin Panel UI ---
  const AdminPanel = () => (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Admin Panel</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setIsAdminPanel(false)} style={[styles.switchButton, { marginRight: 8 }]}>
            <Text style={styles.switchButtonText}>Switch to Student Panel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={[styles.switchButton, { backgroundColor: '#FF4C4C' }]}>
            <Text style={styles.switchButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.panelCard}>
          <Text style={styles.cardTitle}>Post Announcement</Text>
          <TextInput
            placeholder="Write your announcement here..."
            multiline
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: '#28C76F' }]}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panelCard}>
          <Text style={styles.cardTitle}>Manage Students</Text>
          <Text style={styles.noticeItem}>• View student submissions</Text>
          <Text style={styles.noticeItem}>• Delete inappropriate content</Text>
          <Text style={styles.noticeItem}>• Monitor system usage</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // --- Login Screen ---
  if (!loggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // After login, show StudentPanel or AdminPanel based on toggle state
  return isAdminPanel ? <AdminPanel /> : <StudentPanel />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40,
    textAlign: 'center',
    color: '#264653',
    marginTop: 60,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
   
fontSize: 16,
marginBottom: 15,
backgroundColor: 'white',
},
button: {
backgroundColor: '#264653',
paddingVertical: 15,
borderRadius: 8,
marginTop: 10,
alignItems: 'center',
},
buttonText: {
color: 'white',
fontWeight: '600',
fontSize: 18,
},
panelHeader: {
paddingHorizontal: 16,
paddingVertical: 10,
backgroundColor: '#E9ECEF',
borderBottomWidth: 1,
borderColor: '#ddd',
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
},
panelTitle: {
fontSize: 22,
fontWeight: '700',
color: '#264653',
},
panelCard: {
backgroundColor: 'white',
borderRadius: 12,
padding: 15,
marginHorizontal: 16,
marginVertical: 10,
shadowColor: '#000',
shadowOpacity: 0.1,
shadowRadius: 8,
elevation: 3,
},
cardTitle: {
fontSize: 20,
fontWeight: '600',
marginBottom: 12,
color: '#264653',
},
noticeCard: {
backgroundColor: 'white',
marginHorizontal: 16,
marginVertical: 6,
padding: 15,
borderRadius: 12,
shadowColor: '#000',
shadowOpacity: 0.05,
shadowRadius: 6,
elevation: 2,
},
noticeTitle: {
fontSize: 18,
fontWeight: '700',
marginBottom: 4,
color: '#1B3B58',
},
noticeDate: {
fontSize: 12,
color: '#999',
marginBottom: 8,
},
noticeContent: {
fontSize: 15,
color: '#333',
marginBottom: 8,
},
categoryChip: {
alignSelf: 'flex-start',
paddingVertical: 4,
paddingHorizontal: 10,
borderRadius: 12,
},
categoryChipText: {
color: 'white',
fontWeight: '600',
},
categoryButton: {
backgroundColor: '#e4e4e4',
paddingHorizontal: 15,
paddingBottom: 15,
paddingVertical: 10,
borderRadius: 10,
marginRight: 10,
marginTop: 0,
},
categoryButtonText: {
fontSize: 14,
color: '#555',
fontWeight: '600',
},
switchButton: {
backgroundColor: '#264653',
paddingVertical: 6,
paddingHorizontal: 12,
borderRadius: 8,
},
switchButtonText: {
color: 'white',
fontWeight: '600',
},
noticeItem: {
fontSize: 16,
marginBottom: 6,
color: '#333',
},
});

export default App;
