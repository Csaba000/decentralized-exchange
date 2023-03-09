import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MyModal from "./Modal";

describe("MyModal", () => {
  it("should update the slippage and deadline state when the user inputs values and saves", () => {
    // Arrange
    const modalVisible = true;
    const setModalVisible = jest.fn();
    const slippage = ["", () => {}];
    const deadline = ["", () => {}];

    const { getByPlaceholderText, getByText } = render(
      <MyModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        slippage={slippage}
        deadline={deadline}
      />
    );

    // Act
    const slippageInput = getByPlaceholderText("0.10%");
    fireEvent.changeText(slippageInput, "0.50%");

    const deadlineInput = getByPlaceholderText("30 min");
    fireEvent.changeText(deadlineInput, "60 min");

    const saveButton = getByText("Save");
    fireEvent.press(saveButton);

    // Assert
    expect(slippage[0]).toBe("0.50%");
    expect(deadline[0]).toBe("60 min");
    expect(setModalVisible).toHaveBeenCalledWith(false);
  });
});
