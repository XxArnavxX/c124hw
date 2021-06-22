import * as React
    from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker
    from "expo-image-picker";
import * as Permissions
    from "expo-permissions";

export default class PickIMG extends React.Component {
    state = { image: null }
    render() {
        var { image } = this.state
        return (
            <View>
                <Button title="Pick an image from gallery" onPress={this.chooseIMG} />
            </View>
        )
    }
    componentDidMount() {
        this.getPermission();
    }
    getPermission = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        }
        if (status !== "granted") {
            alert("Sorry the permission was not granted!")

        }
    }
    chooseImg = async () => {
        try {
            var picture = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            })
            if (!picture.cancelled) {
                this.setState({
                    image: picture.data,

                })
                this.uploadIMG(picture.uri)
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    uploadIMG = async (uri) => {
        const data = new FormData(); 
        let filename = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = { uri: uri, name: filename, type: type, }; 
        data.append("digit", fileToUpload); 
        fetch("https://f292a3137990.ngrok.io/predict-digit", { method: "POST", body: data, headers: { "content-type": "multipart/form-data", }, }).then((response) => response.json()).then((result) => { console.log("Success:", result); }).catch((error) => { console.error("Error:", error); });
    }
}