import { useState, useEffect } from "react";

import {
  Alert,
  StyleSheet,
  View,
  AppState,
  TextInput,
  Button,
  Text,
} from "react-native";
import { supabase } from "../../lib/supabase";

import { Link, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

AppState.addEventListener("change", (nextAppState) => {
  if (nextAppState === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session } = useAuth();

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (session) {
      router.replace("/(home)");
    }
  }, [session]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
            style={styles.input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Sign up"
            disabled={loading}
            onPress={() => signUpWithEmail()}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Link href="/(auth)/login" asChild>
            <Button title="Sign in" disabled={loading} />
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000000",
  },
  form: {
    width: "100%",
    maxWidth: 300,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderColor: "#cccccc",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    color: "#000000",
  },
  buttonContainer: {
    marginBottom: 10,
  },
});
