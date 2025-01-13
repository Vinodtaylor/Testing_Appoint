/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
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
import { LoginUser, ResetNewPassword, ResetOTpPassword } from '@/types/types';
import {  ResetPassword, SendResetEmail, VerifyOTP } from '@/routes/routes';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";


const ForgotPasswordSteps = {
  INPUT_EMAIL: 'INPUT_EMAIL',
  VERIFY_CODE: 'VERIFY_CODE',
  RESET_PASSWORD: 'RESET_PASSWORD',
  SUCCESS: 'SUCCESS',
};

const LoginPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email_id, setemail_id] = useState<string>("");
  const [ otpforgotPassword, setotpforgotPassword] = useState<string>("");
  const [ resetPasswordToken, setresetPasswordToken] = useState<string>("");

  const [password, setpassword] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<'LOGIN' | 'FORGOT_PASSWORD'>('LOGIN');
  const [forgotPasswordStep, setForgotPasswordStep] = useState<string>(ForgotPasswordSteps.INPUT_EMAIL);
  const [login,SetLogin]=useState<LoginUser>({
    email_id:"",
    password:""
  })



  const router=useRouter()


  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState<boolean>(false); 


  useEffect(() => {
    setIsClient(true); // Set to true after client-side mount
  }, []);


  // Conditionally render content based on whether it's client-side
if (!isClient) {
  return null; // Or a loading spinner if needed
}

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleForgotPasswordClick = () => {
    setCurrentStep('FORGOT_PASSWORD');
    setForgotPasswordStep(ForgotPasswordSteps.INPUT_EMAIL);
  };

  const handleBackToLoginClick = () => {
    setCurrentStep('LOGIN');
  
    // Reset all states
    setForgotPasswordStep(ForgotPasswordSteps.INPUT_EMAIL);
    setemail_id('');
    setotpforgotPassword('');
    setresetPasswordToken('');
    setpassword('');
  };
  


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!login.email_id || !login.password) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);

  
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email_id: login.email_id,
        password: login.password,
      });
  
      setLoading(false);


      if (result?.error) {
        const errorMessage = result.error === "CredentialsSignin"
          ? "Invalid credentials. Please check your email and password."
          : result.error;
        toast.error(errorMessage);
      } else {
        router.push("/");
        SetLogin({ email_id: "", password: "" });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Check for backend error message or fallback to generic error
      toast.error(error?.response?.data?.message || "An unexpected error occurred. Please try again later.");
    }
  };
  
  




  const handleSendResetEmail = async () => {
    try {


      if (! email_id) {
        toast.error("Please Enter the Email Address");
        return;
      }
    
      await SendResetEmail({email_id});
      toast.success("Verification code sent to your email.");
      setForgotPasswordStep(ForgotPasswordSteps.VERIFY_CODE);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to send reset email.";

      toast.error(errorMessage || "Failed to send reset email.");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpforgotPassword) {
      toast.error("Please Enter  OTP");
      return;
    }

    if (otpforgotPassword.length !== 6) {
      toast.error("OTP should be 6 digits.");
      return;
    }

    try {
      
      const data:ResetOTpPassword={
email_id:email_id,
otpforgotPassword:otpforgotPassword
      }
 const res=   await VerifyOTP(data);
setresetPasswordToken(res.token)
      toast.success(res.message || "Verification successful. Please reset your password.");
      setForgotPasswordStep(ForgotPasswordSteps.RESET_PASSWORD);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!password) {
      toast.error("Please Enter a new password");
      return;
    }
  
    if (!resetPasswordToken) {
      toast.error("No reset token found.");
      return;
    }
  
    try {
      const data: ResetNewPassword = {
        password: password,
        token: resetPasswordToken,
      };
  
  
      const res = await ResetPassword(data, resetPasswordToken);
  
      if (res) {
        toast.success("Password reset successfully.");
        setForgotPasswordStep(ForgotPasswordSteps.SUCCESS);
      } else {
        toast.error("Failed to reset password.");
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };
  
  


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentStep === "LOGIN") {
      handleLogin(event); 
    }
  };
  

  const renderForgotPasswordScreen = () => {
    switch (forgotPasswordStep) {
      case ForgotPasswordSteps.INPUT_EMAIL:
        return (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label
                htmlFor="email_id"
                className="block text-sm font-medium text-[#000000]"
              >
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={email_id}
                onChange={(e) => setemail_id(e.target.value)}

                id="email_id"
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
           onClick={handleSendResetEmail}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </form>
        );

        case ForgotPasswordSteps.VERIFY_CODE:
          return (
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Verification Code Input Section */}
              <div className="mb-4 flex flex-col justify-center">
                <label
                  htmlFor="otpforgotPassword"
                  className="block text-base mb-4 font-semibold text-shadow text-[#000000]"
                >
                  Enter the Verification Code <span className="text-red-600">*</span>
                </label>
                <div className="mb-4 flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpforgotPassword}
                    onChange={setotpforgotPassword}
                    className="flex justify-center gap-4 outline-none"
                    aria-label="OTP Input"
                  >
                    {/* Group 1 */}
                    <InputOTPGroup className="flex gap-2 outline-none">
                      {[...Array(3)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-12 h-12 text-center text-base font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                      ))}
                    </InputOTPGroup>
        
                    {/* Separator */}
                    <InputOTPSeparator className="text-lg font-bold mx-2 text-gray-500">
                      -
                    </InputOTPSeparator>
        
                    {/* Group 2 */}
                    <InputOTPGroup className="flex gap-2">
                      {[...Array(3)].map((_, index) => (
                        <InputOTPSlot
                          key={index + 3}
                          index={index + 3}
                          className="w-12 h-12 text-center text-base font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

              </div>
        
              {/* Back Button */}
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => setForgotPasswordStep(ForgotPasswordSteps.INPUT_EMAIL)}
                  className="flex items-center text-blue-600 text-base border-none"
                >
                  <IoIosArrowBack size={20} /> Back
                </button>
              </div>
        
              {/* Verify Button */}
              <button
                type="button"
                onClick={handleVerifyOTP}
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
                htmlFor="password"
                className="block text-sm font-medium text-[#000000]"
              >
                New Password <span className="text-red-600">*</span>
              </label>
          
          
<div className="relative">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      id="password"
                      value={password}

                      onChange={(e) => setpassword(e.target.value)}
    
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
              onClick={handleResetPassword}

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
              priority
              height={350}
              className="object-contain lg:w-full w-64"
            />
          </div>

          <div className="w-full md:max-w-lg p-8">
            {currentStep === 'LOGIN' ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="email_id"
                    className="block text-sm font-medium text-[#000000]"
                  >
                     Email Id <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="email_id"
                    onChange={(e) =>
                      SetLogin((prev) => ({ ...prev, email_id: e.target.value }))
                    }
                    value={login.email_id || ""}
                    className="w-full placeholder:text-sm px-4 py-2 mt-2 border rounded-lg outline-none shadow-md"
                    placeholder="Enter your email or Phone"
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
                      value={login.password || ""}
                      onChange={(e) =>
                        SetLogin((prev) => ({ ...prev, password: e.target.value }))
                      }

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
  {loading ? 'Logging in...' : 'Submit'}
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
