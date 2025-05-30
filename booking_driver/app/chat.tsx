import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, icons, images, SIZES } from "../constants";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { useTheme } from "../theme/ThemeProvider";
import { Image } from "expo-image";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Modal } from "react-native";

// chat screen
const Chat = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [messages, setMessages] = useState<any>([]);
    const [inputMessage, setInputMessage] = useState("");
    const { colors, dark } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    const [status, setStatus] = useState("");
    const [statusStyle, setStatusStyle] = useState(styles.confirm);

    const handleInputText = (text: any) => {
        setInputMessage(text);
    };

    const renderMessage = (props: any) => {
        const { currentMessage } = props;

        if (currentMessage.user._id === 1) {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                    }}
                >
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            right: {
                                backgroundColor: COLORS.primary,
                                marginRight: 12,
                                marginVertical: 12,
                            },
                        }}
                        textStyle={{
                            right: {
                                color: COLORS.white,
                            },
                        }}
                    />
                </View>
            );
        } else {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                    }}
                >
                    <Image
                        source={images.user1}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            marginLeft: 8,
                        }}
                    />
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            left: {
                                backgroundColor: COLORS.secondary,
                                marginLeft: 12,
                            },
                        }}
                        textStyle={{
                            left: {
                                color: COLORS.white,
                            },
                        }}
                    />
                </View>
            );
        }
        return <Bubble {...props} />;
    };

    /***
     * Implementing chat functionality
     */
    const submitHandler = () => {
        const message = {
            _id: Math.random().toString(36).substring(7),
            text: inputMessage,
            createdAt: new Date(),
            user: { _id: 1 },
        };
        setMessages((previousMessage: any) =>
            GiftedChat.append(previousMessage, [message])
        );

        setInputMessage("");
    };

    const renderInputToolbar = () => {
        return null;
    };

    useEffect(() => {
        switch (status) {
            case "pending":
                setStatusStyle(styles.confirm_pending);
                break;
            case "confirmed":
                setStatusStyle(styles.confirmed);
                break;
            case "":
                setStatusStyle(styles.confirm);
                break;
            default:
                break;
        }
    }, [status]);

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar hidden={true} />
            <View
                style={[
                    styles.contentContainer,
                    { backgroundColor: colors.background },
                ]}
            >
                <View
                    style={[
                        styles.header,
                        { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
                    ]}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image
                                source={icons.arrowLeft}
                                contentFit="contain"
                                style={[
                                    styles.headerIcon,
                                    {
                                        tintColor: dark ? COLORS.white : COLORS.greyscale900,
                                    },
                                ]}
                            />
                        </TouchableOpacity>
                        <Text
                            style={[
                                styles.headerTitle,
                                {
                                    color: dark ? COLORS.white : COLORS.greyscale900,
                                },
                            ]}
                        >
                            Abhishek Raj
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={statusStyle}>
                                {status !== "confirmed" ? "Confirm" : "Pay Now"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={{ fontSize: 15 }}>Price Decided</Text>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "700",
                                    borderRadius: 6,
                                    paddingHorizontal: 16,
                                    paddingVertical: 6,
                                    marginTop: 8,
                                }}
                            >
                                Rs 4000
                            </Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.closeButton]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.saveButton]}
                                    onPress={() => {
                                        setStatus("confirmed");
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* Modal-end */}
                <View style={styles.chatContainer}>
                    <GiftedChat
                        messages={messages}
                        renderInputToolbar={renderInputToolbar}
                        user={{ _id: 1 }}
                        minInputToolbarHeight={0}
                        renderMessage={renderMessage}
                    />
                </View>
                <View
                    style={[
                        styles.inputContainer,
                        {
                            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.inputMessageContainer,
                            {
                                backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale100,
                            },
                        ]}
                    >
                        <TextInput
                            style={styles.input}
                            value={inputMessage}
                            onChangeText={handleInputText}
                            placeholderTextColor={COLORS.greyscale900}
                            placeholder="Enter your message..."
                        />
                    </View>
                    <TouchableOpacity style={styles.microContainer} onPress={submitHandler}>
                        <MaterialCommunityIcons
                            name="send"
                            size={24}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: COLORS.white,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "semiBold",
        color: COLORS.black,
        marginLeft: 22,
    },
    headerIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    confirmButton: {
        minWidth: 80, // Ensure enough width for the text
        alignItems: "center", // Center the text horizontally
        justifyContent: "center", // Center the text vertically
        marginLeft: 16,
    },
    chatContainer: {
        flex: 1,
        justifyContent: "center",
    },
    inputContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    inputMessageContainer: {
        flex: 1,
        flexDirection: "row",
        marginLeft: 10,
        backgroundColor: COLORS.grayscale100,
        paddingVertical: 8,
        marginRight: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    input: {
        color: COLORS.greyscale900,
        flex: 1,
        paddingHorizontal: 10,
    },
    microContainer: {
        height: 48,
        width: 48,
        borderRadius: 49,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
    },
    confirm: {
        backgroundColor: "gray",
        paddingHorizontal: 12, // Increased padding for more space
        paddingVertical: 8,
        borderRadius: 4,
        color: COLORS.white,
    },
    confirm_pending: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12, // Increased padding for more space
        paddingVertical: 8,
        borderRadius: 4,
        color: COLORS.white,
    },
    confirmed: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12, // Increased padding for more space
        paddingVertical: 8,
        borderRadius: 4,
        color: COLORS.white,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: SIZES.width - 40,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
    },
    closeButton: {
        backgroundColor: COLORS.gray,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    modalButtonText: {
        fontSize: 16,
        color: COLORS.white,
    },
});

export default Chat;