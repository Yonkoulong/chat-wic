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
  SignupTitleHeading
} from "./Signup.styles";
import { StyledTextField } from "@/shared/components/TextField";
import { StyledLabelTextField } from "@/shared/components/Typography";

export const Signup = () => {
  const { control, handleSubmit } = useForm();

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
            <StyledLabelTextField>
                Email <span className="require-field">*</span>
            </StyledLabelTextField>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <StyledTextField
                  {...field}
                  fullWidth
                  size="small"
                  type="text"
                  placeholder="Enter email"
                  error={error !== undefined}
                  helperText={error?.message}
                />
              )}
              rules={{
                required: {
                  value: true,
                  message: "Email is required"
                }
              }}
            />
          </SignupForm>
        </SignupFormWrapper>
      </SignupWrapper>
    </SignupContainer>
  );
};

