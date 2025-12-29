import { router } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import NetInfo from "@react-native-community/netinfo";

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function Index() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchNotes = useCallback(
    async (searchTerm: string) => {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        Alert.alert(
          "Error fetching notes",
          "Please check your internet connection.",
        );
        return;
      }
      let query = supabase.from("notes").select("*").eq("user_id", user?.id);
      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`,
        );
      }
      const { data, error } = await query;
      if (error) {
        Alert.alert(
          "Error fetching notes",
          "Please check your internet connection.",
        );
      } else {
        setNotes(data as Note[]);
      }
    },
    [user],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    if (user) {
      fetchNotes(debouncedSearch);
    }
  }, [debouncedSearch, user, fetchNotes]);

  const deleteNote = async (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          const netInfo = await NetInfo.fetch();
          if (!netInfo.isConnected) {
            Alert.alert(
              "No internet connection",
              "Please check your internet connection and try again.",
            );
            return;
          }
          const { error } = await supabase.from("notes").delete().eq("id", id);
          if (error) {
            Alert.alert(
              "Error deleting note",
              "Please check your internet connection.",
            );
          } else {
            fetchNotes(debouncedSearch);
          }
        },
        style: "destructive",
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.email}!</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(home)/add")}
      >
        <Text style={styles.addButtonText}>Add Note</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.search}
        placeholder="Search notes..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent}>{item.content}</Text>
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/(home)/edit/${item.id}`)}
              >
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteNote(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000000",
  },
  addButton: {
    backgroundColor: "#000000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  search: {
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    color: "#000000",
  },
  note: {
    padding: 15,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  noteTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000000",
  },
  noteContent: {
    color: "#333333",
    marginTop: 5,
  },
  noteTextContainer: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#000000",
    padding: 8,
    borderRadius: 5,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#ff0000",
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 14,
  },
});
