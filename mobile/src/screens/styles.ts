import { StyleSheet } from "react-native";

export const colors = {
  background: "#f6f7f9",
  border: "#d9dee7",
  muted: "#667085",
  primary: "#2563eb",
  danger: "#dc2626",
  text: "#111827",
  white: "#ffffff"
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20
  },
  centered: {
    flex: 1,
    justifyContent: "center"
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    marginBottom: 28
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 14
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700"
  },
  linkButton: {
    alignItems: "center",
    marginTop: 18
  },
  linkText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600"
  },
  error: {
    color: colors.danger,
    marginBottom: 8
  }
});
