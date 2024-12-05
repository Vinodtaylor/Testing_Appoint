"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GiCheckMark } from "react-icons/gi";
import { Pencil, Trash, X } from "lucide-react";
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
} from "@/components/ui/alert-dialog";

const tableHeader = [
  { name: "Name" },
  { name: "Contact" },
  { name: "Email" },
  { name: "Date" },
  { name: "Time" },
  { name: "Page" },
  { name: "Remarks" },
  { name: "Is Valid" },
  { name: "Add Remarks" },
  { name: "Delete" },
];

const initialData = [
  {
    name: "John Doe",
    contact: "1234567890",
    email: "john.doe@example.com",
    date: "2024-12-02",
    time: "10:00 AM",
    page: "Homepage",
    remarks: "Follow-up required",
    isValid: true,
  },
  {
    name: "Jane Smith",
    contact: "9876543210",
    email: "jane.smith@example.com",
    date: "2024-12-01",
    time: "2:00 PM",
    page: "Contact Us",
    remarks: "Issue resolved",
    isValid: false,
  },
];

const Leads = () => {
  const [data, setData] = useState(initialData);

  const toggleValidity = (index: number) => {
    const updatedData = [...data];
    updatedData[index].isValid = !updatedData[index].isValid;
    setData(updatedData);
  };

  return (
    <div className="p-4">
      <Table className="min-w-full whitespace-nowrap">
        <TableHeader  className="bg-blue-100">
          <TableRow>
            {tableHeader.map((th, index) => (
              <TableHead key={index}  className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">
                {th.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {data.map((lt, index) => (
            <TableRow key={index}>
              <TableCell  className="px-3 py-2 text-gray-900 text-sm">{lt.name}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{lt.contact}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{lt.email}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{lt.date}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{lt.time}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{lt.page}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{lt.remarks}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    className={`p-2 rounded-full ${
                      lt.isValid ? "bg-green-100" : "bg-gray-100"
                    }`}
                    onClick={() => toggleValidity(index)}
                  >
                    <GiCheckMark
                      size={20}
                      className={`${lt.isValid ? "text-green-600" : "text-gray-400"}`}
                    />
                  </button>
                  <button
                    className={`p-2 rounded-full ${
                      !lt.isValid ? "bg-red-100" : "bg-gray-100"
                    }`}
                    onClick={() => toggleValidity(index)}
                  >
                    <X
                      size={20}
                      className={`${!lt.isValid ? "text-red-600" : "text-gray-400"}`}
                    />
                  </button>
                </div>
              </TableCell >
              <TableCell className="px-3 py-2 text-gray-900 text-sm" >
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Pencil className="cursor-pointer" size={20}/>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-sm rounded-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Add Remarks for {lt.name}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        <textarea
                        rows={7}
                          className="w-full p-2 border rounded-md outline-none"
                          placeholder="Add your remarks here..."
                        ></textarea>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full  border-blue-600  text-black hover:text-white hover:bg-blue-600">Cancel</AlertDialogCancel>
                    <AlertDialogAction type='submit'  className="rounded-full   bg-blue-500 text-white hover:bg-blue-600">
                      Save
                    </AlertDialogAction>                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
              <TableCell className="text-center">
              <AlertDialog>
                <AlertDialogTrigger><Trash className="cursor-pointer text-red-500" size={15} /></AlertDialogTrigger>
                <AlertDialogContent className='lg:w-full max-w-sm rounded-lg'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this data
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full  border-blue-600  text-black hover:text-white hover:bg-blue-600">Cancel</AlertDialogCancel>
                    <AlertDialogAction type='submit' onClick={() => { console.log("Deleted data") }} className="rounded-full   bg-blue-500 text-white hover:bg-blue-600">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leads;
