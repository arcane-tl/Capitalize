import React from 'react';
import { Text, View, Dimensions } from 'react-native';

// Navigation components
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Get route
import { useRoute } from '@react-navigation/native';

// IonicIcons
import IonicIcon from 'react-native-vector-icons/Ionicons';

// Import screens
import Test from '../screens/TestScreen';
import Home from '../screens/HomeScreen';
import Events from '../screens/EventsScreen';
import Dashboard from '../screens/DashboardScreen';
import Assets from '../screens/AssetsScreen';
import Settings from '../screens/SettingsScreen';

// Import Firebase
import { signOut, getAuth } from '@firebase/auth';

// Import AddAssetModal
import { AddAssetModal } from '../components/AddAssetModal';

const auth = getAuth();
const fullScreenWidth = Dimensions.get('window').width;
const Stack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StackHome"
        component={Home}
        options={{
          headerTitle: (props) => <TopHeader {...props} />,
          headerLeft: (props) => <TopLeftButton {...props} />,
          headerRight: (props) => <SignOutButton {...props} />,
        }}
      />
    </Stack.Navigator>
  );
}

function AssetsStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StackAssets"
        component={Assets}
        options={{
          headerTitle: (props) => <TopHeader {...props} />,
          headerLeft: (props) => <TopLeftButton {...props} />,
          headerRight: (props) => <AddAssetButton {...props} />,
        }}
      />
    </Stack.Navigator>
  );
}

function EventsStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StackEvents"
        component={Events}
        options={{
          headerTitle: (props) => <TopHeader {...props} />,
          headerLeft: (props) => <TopLeftButton {...props} />,
        }}
      />
    </Stack.Navigator>
  );
}

function TestStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StackTest"
        component={Test}
        options={{
          headerTitle: (props) => <TopHeader {...props} />,
        }}
      />
    </Stack.Navigator>
  );
}

function DashboardStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StackDashboard"
        component={Dashboard}
        options={{
          headerTitle: (props) => <TopHeader {...props} />,
          headerLeft: (props) => <TopLeftButton {...props} />,
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StackSettings"
        component={Settings}
        options={{
          headerTitle: (props) => <TopHeader {...props} />,
          headerLeft: (props) => <TopLeftButton {...props} />,
        }}
      />
    </Stack.Navigator>
  );
}

function TopHeader() {
  const route = useRoute();
  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{route.name}</Text>
    </View>
  );
}

function TopLeftButton() {
  return (
    <IonicIcon
            name = "menu"
            size = {38}
            color = "black"
            onPress = {() => alert('Open a menu!')}
    />
  );
}

function SignOutButton() {
  return (
    <IonicIcon
            name = "log-out-outline"
            size = {38}
            color = "black"
            onPress = {
              () => {
                console.log('Signing user out.');
                signOut(auth)
                  .catch(() => {console.log('Error on function SignOutButton')});
              }
            }
    />
  );
}

function AddAssetButton() {
  return (
    <IonicIcon
      name = "add"
      size = {38}
      color = "black"
      onPress = {() => alert('Open form to add new item!')}
    />
  );
}

const Tab = createBottomTabNavigator();

export default function NavigationBar(props) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarActiveTintColor: "slateblue",
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: {
            fontSize: 10
          },
          tabBarStyle: [
            {
              display: "flex"
            },
          ],
          tabBarIcon: ({focused, color, size, padding }) => {
            let iconName;
            if(route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline'
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline'
            } else if (route.name === 'Events') {
              iconName = focused ? 'megaphone' : 'megaphone-outline'
            } else if (route.name === 'Assets') {
              iconName = focused ? 'documents' : 'documents-outline'
            } else if (route.name === 'Dashboard') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline'
            }

            return (
              <IonicIcon
                name={iconName}
                size={size}
                color={color}
                style={{paddingBottom: padding}}
              />
            );
          },
        })}>

        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Assets" component={AssetsStackScreen} />
        <Tab.Screen name="Events" component={EventsStackScreen} />
        <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}