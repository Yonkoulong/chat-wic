import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import {
  SignInContainer,
  SignInWrapper,
  SignInLogo,
  SignInTitle,
  SignInTitleHeading,
  SignInTitleDesc,
  SignInFormWrapper,
  SignInForm,
  SignInInputContainer,
  SignInFeatureWrapper,
  SignInButtonSubmit,
  SignInCreateAccount,
} from "./SignIn.styles";
import {
  StyledTextField,
  StyledLabelTextField,
  ControllerInput,
} from "@/shared/components";

const defaultValues = {
  email: "",
  password: "",
};

export const SignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <SignInContainer>
      <SignInWrapper>
        <SignInLogo>WIC</SignInLogo>
        <SignInTitle>
          <SignInTitleHeading>Hey, Hello</SignInTitleHeading>
          <SignInTitleDesc>
            Enter the infomation you entered while registering.
          </SignInTitleDesc>
        </SignInTitle>

        <SignInFormWrapper>
          <SignInForm onSubmit={handleSubmit(onSubmit)}>
            <SignInInputContainer>
              <StyledLabelTextField component="span">
                Email <span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Email"
                fieldName="email"
                required={true}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="email"
                    placeholder="Enter email"
                  />
                )}
              </ControllerInput>
            </SignInInputContainer>

            <SignInInputContainer>
              <StyledLabelTextField>
                Password <span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Password"
                fieldName="password"
                required={true}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="password"
                    placeholder="Enter password"
                  />
                )}
              </ControllerInput>
            </SignInInputContainer>

            <SignInFeatureWrapper>
              <SignInInputContainer>
                <ControllerInput
                  control={control}
                  errors={errors}
                  fieldName="remember"
                >
                  {(field) => <StyledTextField {...field} type="checkbox" />}
                </ControllerInput>
                <StyledLabelTextField>Remember me</StyledLabelTextField>
              </SignInInputContainer>
            </SignInFeatureWrapper>
            <SignInButtonSubmit type="submit">Submit</SignInButtonSubmit>

            <SignInCreateAccount>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </SignInCreateAccount>
          </SignInForm>
        </SignInFormWrapper>
      </SignInWrapper>
    </SignInContainer>
  );
};
