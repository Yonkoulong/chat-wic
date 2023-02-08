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
} from "./Signup.styles";
import { StyledTextField } from "@/shared/components/TextField";
import { StyledLableTextField } from "@/shared/components/Typography"

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
            <StyledLableTextField>

            </StyledLableTextField>
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
            />
          </SignupForm>
        </SignupFormWrapper>
      </SignupWrapper>
    </SignupContainer>
  );
};
