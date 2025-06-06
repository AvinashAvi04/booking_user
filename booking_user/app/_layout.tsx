import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { FONTS } from "@/constants/fonts";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { LogBox } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//Ignore all log notifications
LogBox.ignoreAllLogs();

export default function RootLayout() {
  const [loaded] = useFonts(FONTS);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="addnewaddress" />
        <Stack.Screen name="addnewcard" />
        <Stack.Screen name="addpromo" />
        <Stack.Screen name="address" />
        <Stack.Screen name="call" />
        <Stack.Screen name="cancelbooking" />
        <Stack.Screen name="cancelbookingpaymentmethods" />
        <Stack.Screen name="changeemail" />
        <Stack.Screen name="changepassword" />
        <Stack.Screen name="changepin" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="createnewpassword" />
        <Stack.Screen name="createnewpin" />
        <Stack.Screen name="customerservice" />
        <Stack.Screen name="driverdetails" />
        <Stack.Screen name="editprofile" />
        <Stack.Screen name="fillyourprofile" />
        <Stack.Screen name="fingerprint" />
        <Stack.Screen name="forgotpasswordemail" />
        <Stack.Screen name="forgotpasswordmethods" />
        <Stack.Screen name="forgotpasswordphonenumber" />
        <Stack.Screen name="phonelogin" />
        <Stack.Screen name="emailloginRegister" />
        <Stack.Screen name="emaillogin" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="pricediscussion" />
        {/* <Stack.Screen name="onboarding2" />
        <Stack.Screen name="onboarding3" />
        <Stack.Screen name="onboarding4" /> */}
        <Stack.Screen name="otpverification" />
        <Stack.Screen name="paymentmethods" />
        <Stack.Screen name="search" />
        <Stack.Screen name="searchingdriver" />
        <Stack.Screen name="settingshelpcenter" />
        <Stack.Screen name="settingsinvitefriends" />
        <Stack.Screen name="settingslanguage" />
        <Stack.Screen name="settingsnotifications" />
        <Stack.Screen name="settingspayment" />
        <Stack.Screen name="settingsprivacypolicy" />
        <Stack.Screen name="settingssecurity" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="topupconfirmpin" />
        <Stack.Screen name="topupewalletamount" />
        <Stack.Screen name="topupmethods" />
        <Stack.Screen name="transactionhistory" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="inbox" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
