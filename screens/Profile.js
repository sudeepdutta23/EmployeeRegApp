import React, { useContext, useState } from 'react'
import { StyleSheet, View, Image, Text, Linking, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { Button, Card, Title } from 'react-native-paper';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { MyContext } from '../App';

const Profile = (props) => {
    const [loading, setLoading] = useState(false)
    // const dispatch = useDispatch()
    const { state, dispatch } = useContextc(MyContext);
    const { _id, name, picture, phone, salary, email, position } = props.route.params.item;
    const openDial = (number) => {
        if (Platform.OS == "android") {
            Linking.openURL(`tel:${number}`)
        } else {
            Linking.openURL(`telprompt:${number}`)
        }
    }
    const handleFireEmployee = async (id) => {
        setLoading(true)
        if (id) {
            await fetch(`http://192.168.0.105:3000/remove-employee/${id}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(async(data) => {
                    Alert.alert('Success', data.data)
                    await getEmployees()
                    props.navigation.navigate("Home")
                    setLoading(false)
                })
                .catch(error => {
                    Alert.alert('Failed', "Something went wrong")
                    setLoading(false)
                })
        }
    }

    const getEmployees = async () => {
        await fetch('http://192.168.0.105:3000/get-employee')
        .then(res => res.json())
        .then(data => {
            dispatch({ type: "GET_DATA", payload: data.employees })
            dispatch({ type: "SET_LOADING", payload: false })
            })
            .catch(error => {
                Alert.alert("Error", "Something went wrong")
            })
    }

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={['#0033ff', '#6bc1ff']}
                style={{ height: '20%' }}
            />
            <View style={{ alignItems: 'center' }}>
                <Image
                    style={{ width: 140, height: 140, borderRadius: 140 / 2, marginTop: -50 }}
                    source={{ uri: picture }}
                />
            </View>
            <View style={{ alignItems: 'center', margin: 15 }}>
                <Title>{name}</Title>
                <Text style={{ fontSize: 15 }}>{position}</Text>
            </View>
            <Card style={styles.mycard} onPress={() => Linking.openURL(email)}>
                <View style={styles.cardcontent}>
                    <MaterialIcons name='email' size={32} color='#006aff' />
                    <Text style={styles.mytext}>{email}</Text>
                </View>
            </Card>
            <Card style={styles.mycard} onPress={() => openDial(phone)}>
                <View style={styles.cardcontent}>
                    <Entypo name='phone' size={32} color='#006aff' />
                    <Text style={styles.mytext}>{phone}</Text>
                </View>
            </Card>
            <Card style={styles.mycard}>
                <View style={styles.cardcontent}>
                    <MaterialIcons name='attach-money' size={32} color='#006aff' />
                    <Text style={styles.mytext}>{salary}</Text>
                </View>
            </Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                <Button
                    icon="account-edit"
                    mode='contained'
                    theme={theme}
                    onPress={() => {
                        props.navigation.navigate("Create",
                            { _id, name, picture, phone, salary, email, position }
                        )
                    }}
                >
                    Edit
                </Button>
                <Button
                    icon="delete"
                    mode='contained'
                    theme={theme}
                    loading={loading}
                    onPress={() => handleFireEmployee(_id)}
                >
                    Fire Employee
                </Button>
            </View>
        </View>
    )
}

const theme = {
    colors: {
        primary: "#006aff"
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    mycard: {
        margin: 3
    },
    cardcontent: {
        flexDirection: 'row',
        padding: 8
    },
    mytext: {
        fontSize: 18,
        marginTop: 3,
        marginLeft: 5
    }
})

export default Profile;
