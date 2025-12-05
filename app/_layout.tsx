import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Fragment, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sidebar } from "../components/sidebar";
import { IconSymbol } from "../components/ui/icon-symbol";
import { Colors } from "../constants/theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    // <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
    <Fragment>
      <Stack
        screenOptions={{
          header: () => <Header setIsSidebarOpen={setIsSidebarOpen} />,
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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {/* </ThemeProvider> */}
    </Fragment>
  );
}

function Header({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? "light"].tint;
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setIsSidebarOpen((prev) => !prev);
          }}
        >
          <IconSymbol size={36} name="line.3.horizontal" color={"#FFA143"} />
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
          <IconSymbol size={36} name="person.circle.fill" color={"#FFA143"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "transparent",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 60,
    backgroundColor: "transparent",
  },
  logo: {
    height: 50,
    aspectRatio: 1,
    resizeMode: "contain",
    maxWidth: 70,
  },
});
