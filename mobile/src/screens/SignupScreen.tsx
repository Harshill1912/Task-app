import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { signup } from "../api/auth";
import { getErrorMessage } from "../api/error";
import { useAuth } from "../auth/AuthContext";
import { LogoMark } from "../components/LogoMark";
import { RootStackParamList } from "../navigation/RootNavigator";
import { colors, styles as sharedStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export function SignupScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => signIn(data.token, data.user)
  });

  const submit = () => {
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    mutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password
    });
  };

  return (
    <SafeAreaView style={screenStyles.safeArea}>
      <ScrollView
        contentContainerStyle={screenStyles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={screenStyles.card}>
          <View style={screenStyles.brandRow}>
            <LogoMark size={42} />
            <Text style={screenStyles.brandText}>TaskFlow</Text>
          </View>

          <Text style={screenStyles.title}>Create an account</Text>
          <Text style={screenStyles.subtitle}>
            Get started with your productivity journey today.
          </Text>

          <Text style={screenStyles.label}>Full Name</Text>
          <TextInput
            onChangeText={setName}
            placeholder="John Doe"
            style={screenStyles.input}
            value={name}
          />

          <Text style={screenStyles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="name@university.edu"
            style={screenStyles.input}
            value={email}
          />

          <Text style={screenStyles.label}>Password</Text>
          <TextInput
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            style={screenStyles.input}
            value={password}
          />

          <Text style={screenStyles.label}>Confirm Password</Text>
          <TextInput
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry
            style={screenStyles.input}
            value={confirmPassword}
          />

          {(formError || mutation.isError) && (
            <Text style={sharedStyles.error}>
              {formError ||
                getErrorMessage(
                  mutation.error,
                  "Could not create your account. Please check the form."
                )}
            </Text>
          )}

          <Pressable
            disabled={mutation.isPending}
            onPress={submit}
            style={[
              screenStyles.button,
              mutation.isPending && screenStyles.disabledButton
            ]}
          >
            {mutation.isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={screenStyles.buttonText}>Sign Up</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={screenStyles.loginText}>
              Already have an account?{" "}
              <Text style={screenStyles.loginTextStrong}>Log In</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const screenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f5fc"
  },
  content: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    padding: 18
  },
  card: {
    alignSelf: "center",
    backgroundColor: colors.white,
    borderRadius: 18,
    maxWidth: 620,
    padding: 24,
    shadowColor: "#1d2939",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20
  },
  brandText: {
    color: "#0b55d9",
    fontSize: 32,
    fontWeight: "900",
    marginLeft: 14
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    marginTop: 36,
    textAlign: "center"
  },
  subtitle: {
    color: "#3f4657",
    fontSize: 18,
    lineHeight: 27,
    marginBottom: 30,
    marginTop: 16,
    textAlign: "center"
  },
  label: {
    color: "#30364a",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8
  },
  input: {
    backgroundColor: "#fbfaff",
    borderColor: "#c7cbe0",
    borderRadius: 10,
    borderWidth: 1.5,
    color: colors.text,
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 18,
    paddingVertical: 17
  },
  button: {
    alignItems: "center",
    backgroundColor: "#0b55d9",
    borderRadius: 10,
    marginTop: 16,
    paddingVertical: 20,
    shadowColor: "#0b55d9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12
  },
  disabledButton: {
    opacity: 0.7
  },
  buttonText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800"
  },
  loginText: {
    color: "#30364a",
    fontSize: 16,
    lineHeight: 26,
    marginTop: 42,
    textAlign: "center"
  },
  loginTextStrong: {
    color: "#0b55d9",
    fontWeight: "800"
  }
});
