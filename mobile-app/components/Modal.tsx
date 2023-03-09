import { FC, useContext } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ModalContext } from "../context/ModalProvider";

interface Props {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
}

const MyModal: FC<Props> = ({ modalVisible, setModalVisible }) => {
  const { slippage, deadline } = useContext(ModalContext);

  const [stateSlippage, setStateSlippage] = slippage;
  const [stateDeadline, setStateDeadline] = deadline;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.outerContainer}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.outerInContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Icon name="close" size={15} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.slippageText}>Slippage</Text>

            <TextInput
              style={styles.slippageTextInput}
              placeholder="0.10%"
              keyboardType="numeric"
              onChangeText={(text) => setStateSlippage(text)}
            />

            <Text style={styles.deadlineText}>Deadline</Text>
            <TextInput
              style={styles.deadlineTextInput}
              placeholder="30 min"
              keyboardType="numeric"
              onChangeText={(text) => setStateDeadline(text)}
            />
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              style={styles.saveButtonContainer}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#333",
    opacity: 0.9,
    width: "100%",
    height: 300,
  },
  outerInContainer: {
    padding: 10,
    right: 10,
    position: "absolute",
  },
  slippageText: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginBottom: 5,
  },
  slippageTextInput: {
    paddingLeft: 20,
    fontSize: 18,
    width: "100%",
    height: 55,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
  },
  deadlineText: {
    fontSize: 13,
    alignSelf: "flex-start",
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
  },
  saveButtonContainer: {
    marginTop: 25,
    width: "100%",
    height: 55,
    backgroundColor: "grey",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  deadlineTextInput: {
    paddingLeft: 20,
    fontSize: 18,
    width: "100%",
    height: 55,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
  },
  saveText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: 350,
    height: 350,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  button: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    width: 30,
    height: 30,
    backgroundColor: "grey",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default MyModal;
