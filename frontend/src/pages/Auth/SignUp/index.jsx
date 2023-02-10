import React from "react";
import { useForm } from "react-hook-form";

import {
  SignUpContainer,
  SignUpWrapper,
  SignUpLogo,
  SignUpTitle,
  SignUpTitleDesc,
  SignUpFormWrapper,
  SignUpForm,
  SignUpTitleHeading,
  SignUpInputContainer, 
  SignUpButtonSubmit,
} from "./SignUp.styles";

import { StyledTextField, StyledLabelTextField, ControllerInput} from "@/shared/components";
import { postSignUpOrganization } from "@/services/auth.services";
import {  toast } from 'react-toastify';

const defaultValues = {
  organizeName : "",
  email : "",
  password : ""
};

export const SignUp = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({defaultValues});

  const onSubmit = async(data) => {
    try {
      const respData = await postSignUpOrganization(data);
      toast("Register successfully")
    } catch(error) {
      throw error;
    }
    reset();
  };

  return (
    <SignUpContainer>
      <SignUpWrapper>
        <SignUpLogo>WIC</SignUpLogo>
        <SignUpTitle>
          <SignUpTitleHeading>Create your organization</SignUpTitleHeading>
          <SignUpTitleDesc>Enter the fields below to get started</SignUpTitleDesc>
        </SignUpTitle>

        <SignUpFormWrapper>
          <SignUpForm onSubmit={handleSubmit(onSubmit)}>
            <SignUpInputContainer>
              <StyledLabelTextField component='span'>
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
            </SignUpInputContainer>
           
            <SignUpInputContainer>
              <StyledLabelTextField component='span'>
                  Email <span className="require-field">*</span>
                </StyledLabelTextField>
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
            </SignUpInputContainer>
            
            <SignUpInputContainer>
              <StyledLabelTextField>
                  Password <span className="require-field">*</span>
              </StyledLabelTextField>
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
            </SignUpInputContainer>
            
            <SignUpButtonSubmit type="submit">Create</SignUpButtonSubmit>
          </SignUpForm>
        </SignUpFormWrapper>
      </SignUpWrapper>
    </SignUpContainer>
  );
};

