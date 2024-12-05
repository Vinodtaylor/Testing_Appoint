"use client"

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { LogOut, X } from "lucide-react";
import logo from "../../../../public/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { usePathname } from "next/navigation";



const Navbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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


        { link: "/", name: "Lab Appointment" },
        { link: "/", name: "Services Appointment" },
        { link: "/", name: "Leads" },
      ],
    },
  ];

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
      <div className="flex items-center justify-between p-4">
        <Link href="/">
          <Image
            src={navData[0].logo}
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
        <nav className="hidden  items-center gap-8 lg:flex">
          <ul className="flex gap-8">
            {navData[0].Navlinks.map((navItem, index) => (
              <li key={index}>
                <Link
                  href={navItem.link}
                  className={`  transition duration-300 
                    ${
                    path === navItem.link
                      ? "text-[#000000] font-semibold"
                      : ""
                  }
                    `}
                >
                  {navItem.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Avatar
              className="w-14 h-14 cursor-pointer"
              onClick={handleDropdownToggle}
            >
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>Vinod</AvatarFallback>
            </Avatar>

            {show && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                <ul>
                 
                <div className=" gap-4 items-center flex p-3">
                <Avatar
              className="w-14 h-14 cursor-pointer"
              onClick={handleDropdownToggle}
            >
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>Vinod</AvatarFallback>
            </Avatar>

            <div className="">
              <p className="text-xs font-normal">Logged in as </p>
              <h1 className="text-sm font-semibold">Master Admin</h1>
            </div>
                </div>
                  <li
                  >

                   <AlertDialog>
  <AlertDialogTrigger 
  
  className="p-2 flex items-center text-base gap-2  cursor-pointer text-red-500"

  >                   <LogOut size={15}/> Logout
  </AlertDialogTrigger >
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to log out? You will need to sign in again to access your account.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="rounded-full ">Cancel</AlertDialogCancel>
      <AlertDialogAction className="rounded-full bg-[#03318A] shadow-md hover:bg-[#03318A]">Logout</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
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
                        ? "text-[#000000] font-semibold"
                        : ""
                    }
                      `}                  >
                    {navItem.name}
                  </Link>
                </li>
              ))}
            </ul>

           

          <AlertDialog >
  <AlertDialogTrigger 
  
className="outline-none"
  >      

   <div className="relative  mt-16" ref={dropdownRef}               onClick={handleDropdownToggle}
            >

              <div className="flex items-center gap-4">
              <Avatar
              className="w-14 h-14 cursor-pointer"
              onClick={handleDropdownToggle}
            >
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>Vinod</AvatarFallback>
            </Avatar>

<div className="flex flex-col">
<p className="font-semibold text-sm">Master Admin</p>
            <p   className=" flex text-sm items-center gap-1  cursor-pointer text-red-500"
            >
             <LogOut size={15}/> Logout
            </p>
</div>
            
              </div>
            

           
          </div>           
  </AlertDialogTrigger >
  <AlertDialogContent className="max-w-sm rounded-lg">
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to log out? You will need to sign in again to access your account.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="rounded-full ">Cancel</AlertDialogCancel>
      <AlertDialogAction className="rounded-full bg-[#03318A] shadow-md hover:bg-[#03318A]">Logout</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
