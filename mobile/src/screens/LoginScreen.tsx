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
import { login } from "../api/auth";
import { getErrorMessage } from "../api/error";
import { useAuth } from "../auth/AuthContext";
import { LogoMark } from "../components/LogoMark";
import { RootStackParamList } from "../navigation/RootNavigator";
import { colors, styles as sharedStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => signIn(data.token, data.user)
  });

  const submit = () => {
    mutation.mutate({ email: email.trim(), password });
  };

  return (
    <SafeAreaView style={screenStyles.safeArea}>
      <ScrollView
        contentContainerStyle={screenStyles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={screenStyles.inner}>
          <View style={screenStyles.brandRow}>
            <LogoMark size={42} />
            <Text style={screenStyles.brandText}>TaskFlow</Text>
          </View>

          <View style={screenStyles.card}>
            <Text style={screenStyles.title}>Welcome back</Text>
            <Text style={screenStyles.subtitle}>
              Please enter your details to sign in.
            </Text>

            <Text style={screenStyles.label}>Email Address</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="name@company.com"
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

            {mutation.isError && (
              <Text style={sharedStyles.error}>
                {getErrorMessage(
                  mutation.error,
                  "Could not log in. Check your email and password."
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
                <Text style={screenStyles.buttonText}>Sign In</Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Signup")}
              style={screenStyles.createLink}
            >
              <Text style={screenStyles.createText}>
                Don't have an account?{" "}
                <Text style={screenStyles.createTextStrong}>
                  Create an Account
                </Text>
              </Text>
            </Pressable>
          </View>
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
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 24
  },
  inner: {
    alignSelf: "center",
    maxWidth: 560,
    width: "100%"
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 4
  },
  brandText: {
    color: "#0b55d9",
    fontSize: 34,
    fontWeight: "900",
    marginLeft: 12
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginTop: 72,
    padding: 28,
    shadowColor: "#1d2939",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12
  },
  subtitle: {
    color: "#3f4657",
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 34
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
    marginBottom: 22,
    paddingHorizontal: 18,
    paddingVertical: 17
  },
  button: {
    alignItems: "center",
    backgroundColor: "#0b55d9",
    borderRadius: 10,
    marginTop: 8,
    paddingVertical: 20
  },
  disabledButton: {
    opacity: 0.7
  },
  buttonText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800"
  },
  createLink: {
    alignItems: "center",
    marginTop: 34
  },
  createText: {
    color: "#30364a",
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center"
  },
  createTextStrong: {
    color: "#0b55d9",
    fontWeight: "800"
  }
});
