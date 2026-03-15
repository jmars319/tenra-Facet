import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { APP_NAME } from "@facet/config";
import { colors } from "@facet/ui";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Future support</Text>
        <Text style={styles.title}>{APP_NAME} mobile</Text>
        <Text style={styles.body}>
          This scaffold keeps mobile support ready without activating search, reframing, or account
          flows yet.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    alignItems: "center",
    backgroundColor: colors.canvas,
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    maxWidth: 420,
    padding: 24,
    width: "100%"
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 36,
    fontWeight: "700",
    lineHeight: 38
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24
  }
});
