import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { Colors } from "../constants/theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          header: () => <Header />,
          headerShown: true,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

function Header() {
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? "light"].tint;
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          /* Open sidebar */
        }}
      >
        <IconSymbol size={28} name="line.3.horizontal" color={iconColor} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.push("/");
        }}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.push("/login");
        }}
      >
        <IconSymbol size={28} name="person.circle.fill" color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 25,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 60,
    backgroundColor: "transparent",
  },
  logo: {
    height: 40,
    resizeMode: "contain",
  },
});
