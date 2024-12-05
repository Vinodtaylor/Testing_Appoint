"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableHeadertype } from '@/types/types';
import { Trash } from 'lucide-react';
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
import { ServicetableData } from '@/constants/data';

const tableHeader: TableHeadertype[] = [
  { name: "SLNO" },
  { name: "Name" },
  { name: "Contact" },
  { name: "Age" },
  { name: "Gender" },
  { name: "P-Condition" },
  { name: "Location" },
  { name: "Service" },
  { name: "Date" },
  { name: "Time" },
  { name: "Booked time" },
  { name: "Delete" },
];

const Services = () => {
 
  return (
    <div>
     

      {/* Table */}
      <Table className="min-w-full whitespace-nowrap">
        <TableHeader className="bg-blue-100">
          <TableRow>
            {tableHeader.map((th, index) => (
              <TableHead key={index} className="text-xs sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">
                {th.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="hover:bg-gray-50 transition-all ease-in-out">
          {ServicetableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{row.slno}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{row.name}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{row.contact}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{row.age}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{row.gender}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{row.pCondition}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{row.location}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{row.service}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{row.date}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{row.time}</TableCell>
              <TableCell className="px-3 py-2 text-gray-900 text-sm">{row.bookedTime}</TableCell>
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

export default Services;
