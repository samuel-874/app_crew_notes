import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";

export default function AddNote() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const saveNote = async () => {
    if (!user) return;
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Alert.alert(
        "No internet connection",
        "Please check your internet connection and try again.",
      );
      return;
    }
    const { error } = await supabase
      .from("notes")
      .insert([{ title, content, user_id: user.id }]);
    if (error) {
      Alert.alert("Error saving note", error.message);
    } else {
      router.replace("/(home)");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Note</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderColor: "#cccccc",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    color: "#000000",
  },
  contentInput: {
    height: 120,
  },
  saveButton: {
    backgroundColor: "#000000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
