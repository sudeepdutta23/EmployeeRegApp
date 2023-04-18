import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Home from './screens/Home';
import CreateEmployee from './screens/CreateEmployee';
import Profile from './screens/Profile';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { createContext, useReducer } from 'react';
import { reducer, initialState } from './reducers/reducer';

// const store = createStore(reducer)

export const MyContext = createContext();


export function App() {
  const Stack = createStackNavigator();
  const myOptions = (title) => {
    return {
      title,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#006aff'
      }
    }
  }
  return (
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={myOptions('My Sweet Home')}
        />
        <Stack.Screen
          name="Create"
          component={CreateEmployee}
          options={myOptions('Create Employee')}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={myOptions('Profile')}
        />
      </Stack.Navigator>
    </View>
  );
}

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <MyContext.Provider value={
      { state, dispatch }
    }>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </MyContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 25
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
