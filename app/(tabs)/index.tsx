import { Image, StyleSheet, Platform, Button, Pressable } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { forwardRef } from "react";

export default function HomeScreen() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            headerImage={
                <Image
                    source={require("@/assets/images/partial-react-logo.png")}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome!</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Scan a Passport</ThemedText>
                <Link href="/passport" asChild>
                    <MyButton title="Open Camera" />
                    {/* <Pressable>
                        <ThemedText>Home</ThemedText>
                    </Pressable> */}
                </Link>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const MyButton = forwardRef(({ title, ...props }: { title: string }, ref) => {
    return <Button {...props} title={title} />;
});

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
