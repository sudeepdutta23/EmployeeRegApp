import React, { useEffect, useState, useContext } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { Card, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MyContext } from '../App';

const Home = ({ navigation }) => {
    // const [employees, setEmployees] = useState(null);
    // const [refreshing, setRefreshing] = useState(true);
    // const dispatch = useDispatch()
    // const { employees , refreshing } = useSelector(state=> state)
    const { state, dispatch } = useContext(MyContext);
    const { employees , refreshing } = state
    useEffect(() => {
        (async () => {
            await getEmployees()
        })()
    }, [])

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

    const renderList = ((item) => {
        return (
            <Card onPress={() => navigation.navigate("Profile", { item })} style={styles.myCard} key={item.id}>
                <View style={styles.cardView}>
                    <Image
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                        source={{ uri: item.picture }}
                    />
                    <View>
                        <Text style={styles.text}>{item.name}</Text>
                        <Text style={styles.text}>{item.position}</Text>
                    </View>
                </View>
            </Card>
        )
    })
    return (
        <View>
            {refreshing ? <ActivityIndicator /> : null}
            <FlatList
                data={employees}
                renderItem={({ item }) => {
                    return renderList(item)
                }}
                keyExtractor={item => `${item._id}`}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getEmployees} />}
            />
            <FAB
                style={styles.fab}
                small={false}
                icon="plus"
                onPress={() => navigation.navigate("Create")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    myCard: {
        margin: 5,
        padding: 5
    },
    cardView: {
        flexDirection: 'row',
        padding: 6
    },
    text: {
        fontSize: 20
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 35,
        backgroundColor: '#006aff',
        color: 'white'
    }
})

export default Home;
