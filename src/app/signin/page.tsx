'use client';

import React, { useState } from 'react';
import logo from "../../../public/hod_logo.png";
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { IoIosArrowBack } from "react-icons/io";


const ForgotPasswordSteps = {
  INPUT_EMAIL: 'INPUT_EMAIL',
  VERIFY_CODE: 'VERIFY_CODE',
  RESET_PASSWORD: 'RESET_PASSWORD',
  SUCCESS: 'SUCCESS',
};

const LoginPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<'LOGIN' | 'FORGOT_PASSWORD'>('LOGIN');
  const [forgotPasswordStep, setForgotPasswordStep] = useState<string>(ForgotPasswordSteps.INPUT_EMAIL);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleForgotPasswordClick = () => {
    setCurrentStep('FORGOT_PASSWORD');
    setForgotPasswordStep(ForgotPasswordSteps.INPUT_EMAIL);
  };

  const handleBackToLoginClick = () => {
    setCurrentStep('LOGIN');
  };

  const renderForgotPasswordScreen = () => {
    switch (forgotPasswordStep) {
      case ForgotPasswordSteps.INPUT_EMAIL:
        return (
          <form>
            <div className="mb-4">
              <label
                htmlFor="forgot-email"
                className="block text-sm font-medium text-[#000000]"
              >
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="forgot-email"
                className="w-full placeholder:text-sm px-4 py-2 mt-2 border rounded-lg outline-none shadow-md"
                placeholder="Enter your email address"
              />
            </div>

<div className="flex justify-end mb-4">
<button
                type="button"
                onClick={handleBackToLoginClick}
                className='text-left border-none  items-center text-blue-600  text-base flex border'
              >
               <IoIosArrowBack size={20}/> Back 
              </button>
</div>
            
            <button
              type="button"
              onClick={() => setForgotPasswordStep(ForgotPasswordSteps.VERIFY_CODE)}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </form>
        );

      case ForgotPasswordSteps.VERIFY_CODE:
        return (
          <form>
        <div className="mb-4 flex flex-col  justify-center">
          <label htmlFor="otp"                     className="block text-base mb-4 font-semibold text-shadow text-[#000000]"
          >Enter the Verfication Code <span className='text-red-600 '>* </span></label>
          <div className="mb-4 flex justify-end">
          <InputOTP maxLength={6} className="flex  justify-center gap-4 outline-none">
    {/* Group 1 */}
    <InputOTPGroup className="flex gap-2 outline-none">
      <InputOTPSlot
        index={0}
        className="w-12 h-12 text-center text-base font-semibold   rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <InputOTPSlot
        index={1}
        className="w-12 h-12 text-center text-base font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <InputOTPSlot
        index={2}
        className="w-12 h-12 text-center text-base font-semibold  rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
    </InputOTPGroup>

    {/* Separator */}
    <InputOTPSeparator className="text-lg font-bold mx-2 text-gray-500">-</InputOTPSeparator>

    {/* Group 2 */}
    <InputOTPGroup className="flex gap-2">
      <InputOTPSlot
        index={3}
        className="w-12 h-12 text-center text-base font-semibold  rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <InputOTPSlot
        index={4}
        className="w-12 h-12 text-center text-base font-semibold  rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <InputOTPSlot
        index={5}
        className="w-12 h-12 text-center text-base font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
    </InputOTPGroup>
  </InputOTP>
          </div>
  

  <span className='text-right text-red-600 text-sm  font-semibold cursor-pointer'>Resend Code</span>
</div>


<div className="f">
  <div className="flex justify-end mb-4">
  <button
                type="button"
                onClick={() => setForgotPasswordStep(ForgotPasswordSteps.INPUT_EMAIL)}
                className='text-left border-none  items-center text-blue-600  text-base flex border'
              >
               <IoIosArrowBack size={20}/> Back 
              </button>
  </div>

</div>

            <button
              type="button"
              onClick={() => setForgotPasswordStep(ForgotPasswordSteps.RESET_PASSWORD)}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-600 transition-colors"
            >
              Verify
            </button>
          </form>
        );

      case ForgotPasswordSteps.RESET_PASSWORD:
        return (
          <form>
            <div className="mb-4">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-[#000000]"
              >
                New Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full placeholder:text-sm px-4 py-2 mt-2 border rounded-lg outline-none shadow-md"
                placeholder="Enter your new password"
              />
            </div>

            <div className="flex justify-end mb-4">
  <button
                type="button"
                onClick={() => setForgotPasswordStep(ForgotPasswordSteps.VERIFY_CODE)}
                className='text-left border-none  items-center text-blue-600  text-base flex border'
              >
               <IoIosArrowBack size={20}/> Back 
              </button>
  </div>
            <button
              type="button"
              onClick={() => setForgotPasswordStep(ForgotPasswordSteps.SUCCESS)}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-600 transition-colors"
            >
              Reset Password
            </button>
          </form>
        );

      case ForgotPasswordSteps.SUCCESS:
        return (
          <div>
            <p className="text-center text-green-600 font-medium">
              Password reset successfully! You can now log in with your new password.
            </p>

            
            <button
              type="button"
              onClick={handleBackToLoginClick}
              className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-600 transition-colors"
            >
              Back to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="lg:mt-12 mt-1">
      <h2 className="text-2xl font-bold text-gray-800 -mb-[80px] text-center">
        Appointment Dashboard
      </h2>

      <div className="relative w-full   ">
        <div className="absolute  translate-y-1/2  justify-between left-1/2 transform -translate-x-1/2 lg:translate-y-1/2 max-w-7xl w-full flex gap-4 flex-col md:flex-row overflow-hidden">
          <div className="flex items-center justify-center lg:p-8">
            <Image
              src={logo}
              alt="Logo"
              width={350}
              height={350}
              className="object-contain lg:w-full w-64"
            />
          </div>

          <div className="w-full md:max-w-lg p-8">
            {currentStep === 'LOGIN' ? (
              <form>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#000000]"
                  >
                    ID or Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="w-full placeholder:text-sm px-4 py-2 mt-2 border rounded-lg outline-none shadow-md"
                    placeholder="Enter your email or ID"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#000000]"
                  >
                    Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      id="password"
                      className="w-full placeholder:text-sm px-4 py-2 mt-2 border rounded-lg outline-none shadow-md"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute justify-center mt-2 inset-y-0 right-4 flex items-center text-gray-500"
                    >
                      {passwordVisible ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className="text-base text-blue-500 font-medium hover:underline mt-2 block text-right"
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-600 transition-colors"
                >
                  Submit
                </button>
              </form>
            ) : (
              renderForgotPasswordScreen()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
