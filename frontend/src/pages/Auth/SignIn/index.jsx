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
import {  toast } from 'react-toastify';
import { postSignIn } from '@/services/auth.services';
import { redirectTo } from "@/shared/utils/history";

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

  const onSubmit = async (data) => {
    try { 
      const respData = await postSignIn(data);
      if(respData) {
        localStorage.setItem('token', respData?.data?.token);
        toast.success("Sign in successfully.");
        // redirectTo("/signup");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    }
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

            {/* <SignInFeatureWrapper>
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
            </SignInFeatureWrapper> */}
            <SignInButtonSubmit type="submit">Login</SignInButtonSubmit>

            <SignInCreateAccount>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </SignInCreateAccount>
          </SignInForm>
        </SignInFormWrapper>
      </SignInWrapper>
    </SignInContainer>
  );
};
