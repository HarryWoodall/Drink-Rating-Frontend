import { createRef } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "./PasswordInput";
import { renderWithProviders } from "@/test/utils";

describe("PasswordInput", () => {
  it("hides the password by default", () => {
    renderWithProviders(<PasswordInput />);

    expect(screen.getByTestId("password-input")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("toggles the password's visibility", async () => {
    renderWithProviders(<PasswordInput />);
    const input = screen.getByTestId("password-input");
    const toggle = screen.getByTestId("password-input-toggle");

    expect(toggle).toHaveAccessibleName("Show password");
    await userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");

    expect(toggle).toHaveAccessibleName("Hide password");
    await userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "password");
  });

  // Inside a form, the toggle mustn't submit it.
  it("uses a non-submitting toggle button", () => {
    renderWithProviders(<PasswordInput />);

    expect(screen.getByTestId("password-input-toggle")).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("namespaces the toggle under a custom test id", () => {
    renderWithProviders(
      <>
        <PasswordInput data-testid="first" />
        <PasswordInput data-testid="second" />
      </>,
    );

    expect(screen.getByTestId("first-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("second-toggle")).toBeInTheDocument();
  });

  it("forwards its ref and props to the input, for react-hook-form", () => {
    const ref = createRef<HTMLInputElement>();

    renderWithProviders(<PasswordInput ref={ref} placeholder="secret" />);

    expect(ref.current).toBe(screen.getByTestId("password-input"));
    expect(ref.current).toHaveAttribute("placeholder", "secret");
  });
});
