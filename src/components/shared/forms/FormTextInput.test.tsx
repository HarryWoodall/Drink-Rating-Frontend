import { screen } from "@testing-library/react";
import { FormTextInput } from "./FormTextInput";
import { FormInput } from "./FormInput";
import { renderWithProviders } from "@/test/utils";

describe("FormTextInput", () => {
  it("labels its input", () => {
    renderWithProviders(
      <FormTextInput label="Email" inputId="email" errors={undefined}>
        <FormInput id="email" data-testid="email" />
      </FormTextInput>,
    );

    expect(screen.getByTestId("email-label")).toHaveTextContent("Email");
    expect(screen.getByTestId("email")).toHaveAccessibleName("Email");
    expect(screen.queryByTestId("email-error")).not.toBeInTheDocument();
  });

  it("shows the field's validation message", () => {
    renderWithProviders(
      <FormTextInput
        label="Email"
        inputId="email"
        errors={{ type: "required", message: "Email is required" }}
      >
        <FormInput id="email" />
      </FormTextInput>,
    );

    expect(screen.getByTestId("email-error")).toHaveTextContent(
      "Email is required",
    );
  });

  it("falls back to a generic test id without an input id", () => {
    renderWithProviders(
      <FormTextInput
        label="Email"
        errors={{ type: "required", message: "Email is required" }}
      >
        <FormInput />
      </FormTextInput>,
    );

    expect(screen.getByTestId("form-text-input-error")).toBeInTheDocument();
  });
});
