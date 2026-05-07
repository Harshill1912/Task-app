import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import { LogoMark } from "../components/LogoMark";
import { RootStackParamList } from "../navigation/RootNavigator";
import { colors } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      return;
    }

    const timeout = setTimeout(() => {
      navigation.replace("Tasks");
    }, 900);

    return () => clearTimeout(timeout);
  }, [navigation, token]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoBox}>
          <LogoMark size={74} />
        </View>

        <Text style={styles.appName}>TaskFlow</Text>
        <Text style={styles.heading}>Master your productivity.</Text>
        <Text style={styles.description}>
          The frictionless, high-performance workspace designed for students
          and professionals.
        </Text>

        <View style={styles.previewCard}>
          <View style={styles.previewSurface}>
            <View style={styles.taskPreview}>
              <View style={styles.previewCheckbox} />
              <View style={styles.previewTextGroup}>
                <Text style={styles.previewTitle}>Complete project tasks</Text>
                <Text style={styles.previewDescription}>Plan, track, finish</Text>
              </View>
              <Text style={styles.previewDelete}>Delete</Text>
            </View>
          </View>
        </View>

        {token ? (
          <Text style={styles.loadingText}>Opening your task list...</Text>
        ) : (
          <View style={styles.actions}>
            <Pressable
              onPress={() => navigation.navigate("Login")}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Signup")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Create an account</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.footer}>Join high-achievers today.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f8ff"
  },
  content: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 26
  },
  logoBox: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 20,
    height: 112,
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    width: 112
  },
  appName: {
    color: "#0b55d9",
    fontSize: 38,
    fontWeight: "800",
    marginTop: 24
  },
  heading: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "800",
    marginTop: 38,
    textAlign: "center"
  },
  description: {
    color: "#3f4657",
    fontSize: 18,
    lineHeight: 29,
    marginTop: 18,
    maxWidth: 360,
    textAlign: "center"
  },
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginTop: 36,
    maxWidth: 560,
    padding: 10,
    shadowColor: "#1d2939",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    width: "100%"
  },
  previewSurface: {
    backgroundColor: "#f1f3f7",
    borderRadius: 12,
    minHeight: 210,
    padding: 18
  },
  taskPreview: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    padding: 14
  },
  previewCheckbox: {
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 2,
    height: 26,
    marginRight: 12,
    width: 26
  },
  previewTextGroup: {
    flex: 1
  },
  previewTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  previewDescription: {
    color: colors.muted,
    marginTop: 4
  },
  previewDelete: {
    color: colors.danger,
    fontWeight: "700"
  },
  actions: {
    marginTop: 44,
    maxWidth: 560,
    width: "100%"
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#0b55d9",
    borderRadius: 28,
    paddingVertical: 18,
    shadowColor: "#0b55d9",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 15
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 21,
    fontWeight: "800"
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#0b55d9",
    borderRadius: 28,
    borderWidth: 2,
    marginTop: 18,
    paddingVertical: 17
  },
  secondaryButtonText: {
    color: "#0b55d9",
    fontSize: 21,
    fontWeight: "800"
  },
  loadingText: {
    color: "#0b55d9",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 44
  },
  footer: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 32,
    textAlign: "center"
  }
});
