'use client';
import React, { useState } from 'react';
import logo from "../../../public/hod_logo.png";
import Image from 'next/image';
import Link from 'next/link';
import { Eye,  EyeOff } from 'lucide-react';

const Forgotpage:React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='mt-12 '>
    
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center   ">Appointment Dashboard</h2>

    <div className="relative w-full  h-full">


<div className="absolute   justify-between  left-1/2 transform -translate-x-1/2 lg:translate-y-1/3  max-w-6xl  w-full flex gap-4 flex-col md:flex-row overflow-hidden">

  <div className="flex items-center justify-center   lg:p-8  ">
    <Image src={logo} alt="Logo" width={350} height={350} className="object-contain lg:w-full   w-64" />
  </div>

  {/* Form Section */}
  <div className="w-full md:max-w-lg  p-8">
    <form>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-[#000000] ">
        ID or Email  <span className='text-red-600'>*</span>
        </label>
        <input
          type="text"
          id="email"
          className="w-full placeholder:text-sm px-4 py-2 mt-2 border rounded-lg outline-none shadow-md"
          placeholder="Enter your email or ID"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm  font-medium text-[#000000] text-shadow">
          Password <span className='text-red-600'>*</span>
        </label>
        <div className="relative">
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            className="w-full  placeholder:text-sm px-4 py-2 mt-2 border rounded-lg outline-none shadow-md"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute   justify-center mt-2 inset-y-0 right-4 flex items-center text-gray-500"
          >
            {passwordVisible ? (
              <><Eye/></>
            ) : (
              <><EyeOff/></>
            )}
          </button>
        </div>
        <Link href="/forgotpassword" className="text-sm text-blue-500 font-medium hover:underline mt-2 block text-right">
          Forgot password?
        </Link>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-600 transition-colors"
      >
        Submit
      </button>
    </form>
  </div>
</div>
</div>
    </div>
   
  );
};

export default Forgotpage;
