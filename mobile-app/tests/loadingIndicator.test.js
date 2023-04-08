import React from "react";
import { render } from "@testing-library/react-native";
import LoadingIndicator from "../components/LoadingIndicator/LoadingIndicator";

describe("LoadingIndicator", () => {
  const randomSize = Math.floor(Math.random() * 100);
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  it("renders correctly with custom size and color", () => {
    const { getByTestId } = render(
      <LoadingIndicator size={randomSize} color={randomColor} />
    );
    const loadingIndicator = getByTestId("loading-indicator");

    expect(loadingIndicator).toBeTruthy();
    expect(loadingIndicator.props.size).toBe(randomSize);
    expect(loadingIndicator.props.color).toBe(randomColor);
  });
});
