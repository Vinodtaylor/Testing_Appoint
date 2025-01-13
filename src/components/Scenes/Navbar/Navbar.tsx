/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { LogOut, X } from "lucide-react";
import logo from "../../../../public/hod_logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {  usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Logout } from "@/routes/routes";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie"; 



const Navbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const [isLoggedOut, setIsLoggedOut] = useState(false);



  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const path=usePathname()
  


  const navData = [
    {
      logo: logo,
      Navlinks: [
        { link: "/", name: "Doctor Visit" },
        { link: "/walkin", name: "Walk-in Patient" },
        { link: "/doctors", name: "Doctors" },
        { link: "/hospitals", name: "Hospitals" },
        { link: "/departments", name: "Departments" },


        // { link: "/", name: "Lab Appointment" },
        // { link: "/", name: "Services Appointment" },
        // { link: "/", name: "Leads" },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await Logout();
  
      await signOut({
        redirect: false,
      });
      Cookies.remove("next-auth.session-token", { path: "/" });
      Cookies.remove("next-auth.csrf-token", { path: "/" });
      Cookies.remove("next-auth.callback-url", { path: "/" });
      
      setIsLoggedOut(true);

    } catch (e:any) {
      console.error("Logout error:", e.response?.data?.message );
    }
  };


  useEffect(() => {
    if (isLoggedOut && typeof window !== 'undefined') {
      // Redirect after logout is complete, ensuring it's only done client-side
      window.location.href = "/signin";

    }
  }, [isLoggedOut]);


  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleDropdownToggle = () => setShow((prev) => !prev);

  const handleLinkClick = () => setIsSidebarOpen(false);

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="flex   shadow-md  mb-4 items-center justify-between p-4">
        <Link href="/">
          <Image
            src={logo}
            priority
            alt="Logo"
            className="w-[150px] h-[68px] object-contain"
          />
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          
        
        
          <button onClick={toggleSidebar} className="text-[#000000]">
            {isSidebarOpen ? "" : <GiHamburgerMenu size={30} />}
          </button>
          
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden  w-full justify-between  items-center gap-8 lg:flex">
          <ul className="flex w-full justify-center gap-8">
            {navData[0].Navlinks.map((navItem, index) => (
              <li key={index}>
                <Link
                  href={navItem.link}
                  className={`  transition duration-300 
                    ${
                    path === navItem.link
                      ? "text-[#3498db] font-semibold"
                      : " text-gray-500 font-semibold"
                  }
                    `}
                >
                  {navItem.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Avatar with Dropdown */}
          <div className="relative " ref={dropdownRef}>
            <Avatar
              className="w-14 h-14 cursor-pointer"
              onClick={handleDropdownToggle}
            >
              <AvatarImage src={session?.user?.admin_photo} />
              <AvatarFallback>{session?.user.name}</AvatarFallback>
            </Avatar>

            {show && (
              <div className="absolute right-0 mt-2 w-48 bg-white  rounded-lg shadow-lg z-20">
                <ul>
                 
                <div className=" gap-4 items-center  flex p-3">
                <Avatar
              className="w-14 h-14 cursor-pointer"
              onClick={handleDropdownToggle}
            >
              <AvatarImage src={session?.user?.admin_photo} />
              <AvatarFallback>{session?.user?.name}</AvatarFallback>
            </Avatar>

            <div className="">
              <p className="text-xs font-normal border">Logged in as </p>
              <h1 className="text-sm font-semibold">{session?.user.role}</h1>
            </div>
                </div>
                  <li
                  >
                    <div   className="p-2 flex items-center text-base gap-2  cursor-pointer text-red-500"
                    onClick={handleLogout}
                    >
                                            <LogOut size={15}/> Logout

                      
                    </div>

                  </li>

                 

                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden w-full fixed inset-0 bg-black bg-opacity-50 z-10">

          
          <div className="bg-white w-2/3 h-full p-4 flex flex-col">

<div className="flex mb-8 gap-2 justify-between items-start">
<Link href="/">
          <Image
            src={navData[0].logo}
            alt="Logo"
            className="w-[150px] h-[68px] object-contain"
          />
        </Link>

            <button
              onClick={toggleSidebar}
              className="text-black text-2xl self-end mb-4"
            >
              <X size={30} />
            </button>
</div>
         
            <ul className="flex flex-col gap-6">
              {navData[0].Navlinks.map((navItem, index) => (
                <li key={index}>
                  <Link
                    href={navItem.link}
                    onClick={handleLinkClick}
                    className={`  transition duration-300 
                      ${
                      path === navItem.link
                        ? "text-[#3498db] font-semibold"
                        : "font-semibold text-gray-500"
                    }
                      `}                  >
                    {navItem.name}
                  </Link>
                </li>
              ))}
            </ul>

           

  <div
  
className="outline-none"
  >      

   <div className="relative  mt-16" ref={dropdownRef}               onClick={handleDropdownToggle}
            >

              <div className="flex items-center gap-4">
              <Avatar
              className="w-14 h-14 cursor-pointer"
              onClick={handleDropdownToggle}
            >
              <AvatarImage src={session?.user?.admin_photo} />
              <AvatarFallback>{session?.user?.name}</AvatarFallback>
            </Avatar>

<div className="flex flex-col">
<p className="font-semibold text-sm">{session?.user?.name}</p>
<div className="flex gap-1" onClick={handleLogout}>

            <p   className=" flex text-sm items-center gap-1  cursor-pointer text-red-500"
            >

              <LogOut size={15}/> Logout

            </p>
            </div>

</div>
            
              </div>
            

           
          </div>           
  </div>

            
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
