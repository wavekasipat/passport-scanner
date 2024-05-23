import {
    Image,
    StyleSheet,
    Platform,
    Button,
    View,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import * as Clipboard from "expo-clipboard";

const { width, height } = Dimensions.get("window");

export default function PassportScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraRef, setCameraRef] = React.useState<CameraView | null>(null);
    const [base64, setBase64] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <ThemedView style={styles.container}>
                <ThemedText>
                    We need your permission to show the camera
                </ThemedText>
                <Button onPress={requestPermission} title="grant permission" />
            </ThemedView>
        );
    }

    if (base64) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>
                    Base64:
                </ThemedText>
                <ThemedText>
                    {base64.slice(0, 200)}
                </ThemedText>
                <Button onPress={()=>{
                    console.log("copied");
                    Clipboard.setStringAsync(base64);
                }} title="Copy" />
            </ThemedView>
        );
    }

    const takePicture = async () => {
        if (cameraRef) {
            setLoading(true);

            // Take the picture
            const photo = await cameraRef.takePictureAsync({
                base64: true,
            });
            console.log(photo);
            setBase64(photo?.base64 || "");

            setLoading(false);
        }
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            <CameraView
                style={styles.camera}
                facing={"back"}
                ref={(ref) => {
                    // Save a reference to the camera view
                    setCameraRef(ref);
                }}
            >
                <View style={styles.passportOverlay} />
                <View style={styles.pictureOverlay} />
                <View style={styles.mrzOverlay} />
                {!loading && (
                    <TouchableOpacity
                        style={styles.snapButtonContainer}
                        onPress={takePicture}
                    >
                        <View style={styles.snapButton}></View>
                    </TouchableOpacity>
                )}
            </CameraView>
        </ThemedView>
    );
}

const passportHeight = width * 0.9;
const passportWidth = (passportHeight * 125) / 88;
const pictureHeight = (passportHeight * 45) / 88;
const pictureWidth = (passportWidth * 35) / 125;
const mrzWidth = passportWidth;
const mrzHeight = (passportHeight * 23.2) / 88;

const passportPositionTop = (height - passportWidth) / 2.5;
const passportPositionLeft = (width - passportHeight) / 2;

const pictureMarginLeft = (passportWidth * 2) / 125;
const pictureMarginBottom = (passportHeight * 25.2) / 88;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
    },
    camera: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 24,
    },
    passportOverlay: {
        position: "absolute",
        left: passportPositionLeft,
        top: passportPositionTop,
        width: passportHeight,
        height: passportWidth,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 8,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    mrzOverlay: {
        position: "absolute",
        left: passportPositionLeft,
        top: passportPositionTop,
        width: mrzHeight,
        height: mrzWidth,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 0,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    pictureOverlay: {
        position: "absolute",
        left: passportPositionLeft + pictureMarginBottom,
        top: passportPositionTop + pictureMarginLeft,
        width: pictureHeight,
        height: pictureWidth,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 8,
    },
    snapButtonContainer: {
        backgroundColor: "white",
        borderRadius: 52,
        height: 52,
        width: 52,
        justifyContent: "center",
        alignItems: "center",
    },
    snapButton: {
        // soft red circle
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        borderRadius: 50,
        height: 50,
        width: 50,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
});
