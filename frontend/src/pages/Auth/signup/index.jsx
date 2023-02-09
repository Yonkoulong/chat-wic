import React from "react";
import { Controller, useForm } from "react-hook-form";

import {
  SignupContainer,
  ImageWrapper,
  Image,
  SignupWrapper,
  SignupLogo,
  SignupTitle,
  SignupTitleDesc,
  SignupFormWrapper,
  SignupForm,
  SignupTitleHeading,
  SingUpInputContainer, 
  SignUpButtonSubmit
} from "./Signup.styles";
import { StyledTextField, StyledLabelTextField, ControllerInput} from "@/shared/components";

const defaultValues = {
  organizeName : "",
  email : "",
  password : ""
};

export const Signup = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({defaultValues});

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <SignupContainer>
      <ImageWrapper>
        <Image src="" alt="" />
      </ImageWrapper>

      <SignupWrapper>
        <SignupLogo>WIC</SignupLogo>
        <SignupTitle>
          <SignupTitleHeading>Create your organization</SignupTitleHeading>
          <SignupTitleDesc>Enter the fields below to get started</SignupTitleDesc>
        </SignupTitle>

        <SignupFormWrapper>
          <SignupForm onSubmit={handleSubmit(onSubmit)}>
            <SingUpInputContainer>
              <StyledLabelTextField>
                  Organization name <span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput 
                control={control} 
                errors={errors} 
                fieldNameErrorMessage="Organization name" 
                fieldName="organizeName" 
                required={true}>
                  {(field) => <StyledTextField
                      {...field}
                      fullWidth
                      size="small"
                      type="text"
                      placeholder="Enter organization name"
                    />}
              </ControllerInput>
            </SingUpInputContainer>
            <SingUpInputContainer>
              <StyledLabelTextField>
                  Email <span className="require-field">*</span>
                  <ControllerInput 
                    control={control} 
                    errors={errors} 
                    fieldNameErrorMessage="Email" 
                    fieldName="email" 
                    required={true}>
                    {(field) => <StyledTextField
                        {...field}
                        fullWidth
                        size="small"
                        type="email"
                        placeholder="Enter email"
                      />}
              </ControllerInput>
              </StyledLabelTextField>
            </SingUpInputContainer>
            <SingUpInputContainer>
              <StyledLabelTextField>
                  Password <span className="require-field">*</span>
                  <ControllerInput 
                    control={control} 
                    errors={errors} 
                    fieldNameErrorMessage="Password" 
                    fieldName="password" 
                    required={true}>
                      {(field) => <StyledTextField
                          {...field}
                          fullWidth
                          size="small"
                          type="password"
                          placeholder="Enter password"
                        />}
              </ControllerInput>
              </StyledLabelTextField>
            </SingUpInputContainer>
            <SignUpButtonSubmit type="submit">Submit</SignUpButtonSubmit>
          </SignupForm>
        </SignupFormWrapper>
      </SignupWrapper>
    </SignupContainer>
  );
};

