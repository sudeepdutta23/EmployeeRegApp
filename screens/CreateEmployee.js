import React, { useContext, useState } from 'react'
import { Modal, StyleSheet, View, Alert, Platform, Image } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import { useDispatch } from 'react-redux'
import { MyContext } from '../App'

const CreateEmployee = (props) => {
    const getDetails = (type) =>{
        if(props.route.params){
            switch (type) {
                case "name":
                return props.route.params.name;
                case "phone":
                return props.route.params.phone;
                case "email":
                return props.route.params.email;
                case "salary":
                return props.route.params.salary;
                case "picture":
                return props.route.params.picture;
                case "position":
                return props.route.params.position;
            }
        }
        return "";
    }
    const [employee, setEmployee] = useState({
        name: getDetails('name'),
        phone: getDetails('phone'),
        email: getDetails('email'),
        salary: getDetails('salary'),
        picture: getDetails('picture'),
        position: getDetails('position')
    })
    const [modal, setModal] = useState(false)

    // const dispatch = useDispatch()

    const { state, dispatch } = useContext(MyContext);

    const pickFromGallery = async () => {
        const data = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5
        })
        if (!data.canceled) {
            let newFile = {
                uri: Platform.OS === 'android'
                    ? data.assets[0].uri
                    : data.assets[0].uri.replace('file://', ''),
                type: `test/jpeg`,
                name: `test/jpeg`,
                publicId: `test/${data.assets[0].uri.replace('file://', '')}`
            }
            handleUpload(newFile)
        }
    }

    const pickFromCamera = async () => {
        const data = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5
        })
        if (!data.canceled) {
            let newFile = {
                uri: Platform.OS === 'android'
                    ? data.assets[0].uri
                    : data.assets[0].uri.replace('file://', ''),
                type: `test/${data.assets[0].uri.split('.')[1]}`,
                name: `test/${data.assets[0].uri.split('.')[1]}`,
                publicId: `test/${data.assets[0].uri.replace('file://', '')}`
            }
            handleUpload(newFile)
        }
    }

    const handleUpload = async (image) => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'employeeApp')
        data.append('public_id', image.publicId);
        data.append('api_key', '113387381696491')
        await fetch('https://api.cloudinary.com/v1_1/do8jzxsby/image/upload',
            {
                method: 'POST',
                body: data,
                headers: { Authorization: 'Basic MTEzMzg3MzgxNjk2NDkxOjdGbFJiWndpY1oxYnA2TTBudGFUbUpzWmNZMA==' }
            })
            .then(res => res.json())
            .then(data => {
                setEmployee({ ...employee, picture: data.url })
                setModal(false)
                Alert.alert('Success', 'File uploaded successfully')
            })
            .catch(error => {
                Alert.alert('Error', "Something went wrong")
            })
    }

    const handleSaveEmployee = async () => {
        const data = { ...employee }
        // s
        await fetch(`http://192.168.0.105:3000/add-employee`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(async(data) => {
                Alert.alert('Success', data.data)
                await getEmployees();
                props.navigation.navigate('Home')
            })
    }

    const handleUpdateEmployee = async () => {
        const data = { ...employee, id: props.route.params._id }
        // s
        await fetch(`http://192.168.0.105:3000/update-employee`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(async(data) => {
                Alert.alert('Success', data.data)
                await getEmployees();
                props.navigation.navigate('Home')
            })
            .catch(error=>{
                Alert.alert('Danger', "Something went wrong")
            })
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
            <TextInput
                label='Name'
                style={styles.inputSTyle}
                value={employee.name}
                theme={theme}
                mode='outlined'
                onChangeText={text => setEmployee({ ...employee, name: text })}
            />
            <TextInput
                label='Email'
                style={styles.inputSTyle}
                value={employee.email}
                theme={theme}
                mode='outlined'
                onChangeText={text => setEmployee({ ...employee, email: text })}
            />
            <TextInput
                label='Phone'
                style={styles.inputSTyle}
                value={employee.phone}
                theme={theme}
                keyboardType='number-pad'
                mode='outlined'
                onChangeText={text => setEmployee({ ...employee, phone: text })}
            />
            <TextInput
                label='Salary'
                style={styles.inputSTyle}
                value={employee.salary}
                keyboardType='number-pad'
                theme={theme}
                mode='outlined'
                onChangeText={text => setEmployee({ ...employee, salary: text })}
            />
            <TextInput
                label='Position'
                style={styles.inputSTyle}
                value={employee.position}
                theme={theme}
                mode='outlined'
                onChangeText={text => setEmployee({ ...employee, position: text })}
            />
            {employee.picture && <Image
                style={{ width: 140, height: 140, alignSelf: 'center' }}
                source={{ uri: employee.picture }}
            />}
            <Button style={styles.inputSTyle} disabled={employee.picture != ""} theme={theme} icon={employee.picture == '' ? 'upload' : 'check'} mode='contained' onPress={() => setModal(true)}>
                Upload Image
            </Button>
            <Button style={styles.inputSTyle} theme={theme} icon='content-save' mode='contained' onPress={async () =>props.route.params ? await handleUpdateEmployee() : await handleSaveEmployee()}>
               {props.route.params ? "Update Details" : "Save"}
            </Button>
            <Modal
                animationType='slide'
                transparent={true}
                visible={modal}
                onRequestClose={() => setModal(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalButtonView}>
                        <Button theme={theme} icon='camera' mode='contained' onPress={() => pickFromCamera()}>
                            Camera
                        </Button>
                        <Button theme={theme} icon='image-area' mode='contained' onPress={() => pickFromGallery()}>
                            Gallery
                        </Button>
                    </View>
                    <Button theme={theme} onPress={() => setModal(false)}>
                        Cancel
                    </Button>
                </View>
            </Modal>
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
    inputSTyle: {
        margin: 5
    },
    modalView: {
        position: 'absolute',
        bottom: 2,
        width: '100%',
        backgroundColor: 'white'
    },
    modalButtonView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
})
export default CreateEmployee;
