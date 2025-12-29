import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";

export default function EditNote() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchNote = async () => {
        setLoadingFetch(true);
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          Alert.alert(
            "Error fetching note",
            "Please check your internet connection.",
          );
          setLoadingFetch(false);
          return;
        }
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          Alert.alert(
            "Error fetching note",
            "Please check your internet connection.",
          );
        } else if (data) {
          setTitle(data.title);
          setContent(data.content);
        }
        setLoadingFetch(false);
      };
      fetchNote();
    }
  }, [id]);

  const updateNote = async () => {
    setLoadingUpdate(true);
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Alert.alert(
        "No internet connection",
        "Please check your internet connection and try again.",
      );
      setLoadingUpdate(false);
      return;
    }
    const { error } = await supabase
      .from("notes")
      .update({ title, content })
      .eq("id", id);
    if (error) {
      Alert.alert("Error updating note", error.message);
      setLoadingUpdate(false);
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
        <Text style={styles.headerTitle}>Edit Note</Text>
      </View>
      {loadingFetch ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      ) : (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#888888"
          />
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Content"
            value={content}
            onChangeText={setContent}
            multiline
            placeholderTextColor="#888888"
          />
          <TouchableOpacity
            style={[styles.updateButton, loadingUpdate && { opacity: 0.5 }]}
            onPress={loadingUpdate ? undefined : updateNote}
          >
            {loadingUpdate ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.updateButtonText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  updateButton: {
    backgroundColor: "#000000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
