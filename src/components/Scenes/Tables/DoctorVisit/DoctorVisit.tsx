"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment, TableHeadertype } from "@/types/types";
import {  Trash } from "lucide-react";
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
} from "@/components/ui/TableAlert"
import SelectDropDown from "../../Select/Select";
import { DeleteWalkinAppointment, getHomeVisitData, getWalkinData } from "@/routes/routes";
import moment from "moment";

// Table headers
const tableHeader: TableHeadertype[] = [
  { name: "SLNO" },
  { name: "Type" },
  { name: "Name" },
  { name: "P-ID" },
  { name: "V-ID" },
  { name: "Phone" },
  { name: "Email" },
  { name: "Date" },
  { name: "Time" },
  { name: "Booked Time" },
  { name: "Hospital" },
  { name: "Doctor" },

  { name: "Status" },
  { name: "Revisit" },
  { name: "New Follow Up" },
  { name: "Delete" },
];

// Dummy data for table rows



export const DoctorVisit: React.FC = () => {

  const [dropdownValues, setDropdownValues] = useState({
    method:'',
    status:'',
    department:'',
  });

  // const [FollowupdropdownValues, setFollowupDropdownValues] = useState({
  //   department:'',
  //   disease:'',
  //   method:'',
  //   status:''
  // });
  

 
  const [data, setData] = useState<Appointment[]>([]);
  const [deleteWalkin, setdeleteWalkin] = useState<Appointment | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getHomeVisitData();
        console.log(result)
      
        setData(result.data);
      } catch (e) {
        console.error(e, "Error fetching data");
      }
    };

    getData();
  }, []);




    const handleDelete = async (id:string) => {
      if (deleteWalkin) {
        try {
          await DeleteWalkinAppointment(id);
          setData(data.filter((region) => region._id !== deleteWalkin._id));

          setdeleteWalkin(null); 
        } catch (e) {
          console.error("Error deleting region:", e);
        }
      }
    };

  const handleSelectChange = (key: string, value: string) => {
    setDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };


    
  // const handleFollowupSelectChange = (key: string, value: string) => {
  //   setFollowupDropdownValues((prevValues) => ({
  //     ...prevValues,
  //     [key]: value,
  //   }));
  // };

  return (
    <div className="">
      <div className="overflow-x-auto rounded-lg shadow-md">
        <Table className="min-w-full whitespace-nowrap">
        
          <TableHeader className="bg-blue-100">
            <TableRow>
              {tableHeader.map((t, index) => (
                <TableHead
                  key={index}
                  className="text-xs sm:text-sm font-medium text-gray-700 uppercase px-3 py-2"
                >
                  {t.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 transition-all ease-in-out"
            >
                  <TableCell className="px-3 py-2 text-gray-900  text-sm">{index + 1}</TableCell>
                  <TableCell className="px-3 py-2 text-gray-900  text-sm">{row?.booking_type}</TableCell>
                  {/* <TableCell className="px-3 py-2 text-gray-900  text-sm">{row?.booking}</TableCell> */}
                  <TableCell className="px-3 py-2 text-gray-900  text-sm">{row?.patient_id?.name}</TableCell>
                  <TableCell className="px-3 py-2 text-gray-900  text-sm">{row.patient_id.patient_id}</TableCell>
                  <TableCell className="px-3 py-2 text-gray-900  text-sm">{row.visit_id}</TableCell>
                  <TableCell className="px-3 py-2 text-gray-900  text-sm">{row.patient_id.phone_number}</TableCell>
                  <TableCell className="px-3 py-2 text-gray-900  text-sm">{row.patient_id.email_id}</TableCell>
                  <TableCell className="px-3 py-2 text-gray-900 text-sm">
    {moment(row.createdAt).format("YYYY-MM-DD")}
  </TableCell>
  <TableCell className="px-3 py-2 text-gray-900 text-sm">
    {moment(row.createdAt).format("h:mm A")} 
  </TableCell>
                  <TableCell className="px-3 py-2 text-gray-900  text-sm">{row.time}</TableCell>
                  <TableCell className="px-3 py-2 text-gray-900  text-sm">{row.hospital_id.hospital_name}</TableCell>       
                        <TableCell className="px-3 py-2 text-gray-900  text-sm">{row.doctor_id.name}</TableCell>
                        <TableCell className="px-3 py-2 text-gray-900 sm:text-sm">
    {row.payment_status ? "Paid" : "Pending"}
  </TableCell>
                  <TableCell className="px-3 py-2">
                  


                  <AlertDialog >
  <AlertDialogTrigger   className="text-xs p-2 border-[#1A91FF] border sm:text-sm rounded-full text-[#1A91FF] hover:bg-[#1A91FF] hover:text-white"
  > 
                
                    Revisit
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-full max-w-lg sm:max-w-xl lg:max-w-3xl rounded-lg h-full lg:h-3/4 mx-auto overflow-x-scroll">
  <AlertDialogHeader>
    <AlertDialogTitle className="text-center text-lg font-semibold">
      Add Revisit Details
    </AlertDialogTitle>
  </AlertDialogHeader>

  <div className="space-y-6">
    {/* Search Hospital */}
    <div className="mb-4">
      <div className="flex items-center shadow-md h-[50px] border border-gray-200 rounded-full overflow-hidden w-full  lg:max-w-3xl">
        <input
          type="text"
          placeholder="Search Hospital"
          className="flex-grow px-4 py-2 outline-none"
        />
        <button className="bg-blue-500 h-[50px] text-white px-4 py-2 hover:bg-blue-600 transition">
          Search
        </button>
      </div>

      <div className="border w-full  lg:max-w-3xl cursor-pointer border-gray-200 shadow-md rounded-xl bg-white h-[200px] overflow-y-auto mt-4">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-center text-gray-500 text-sm font-medium">
            Hospital information will be displayed here.
          </p>
        </div>
      </div>
    </div>

    {/* Search Doctor */}
    <div className="mb-4">
      <div className="flex items-center shadow-md h-[50px] border border-gray-300 rounded-full overflow-hidden w-full  lg:max-w-3xl">
        <input
          type="text"
          placeholder="Search Doctor"
          className="flex-grow px-4 py-2 text-sm outline-none"
        />
        <button className="bg-blue-500 h-[50px] text-white px-4 py-2 hover:bg-blue-600 transition">
          Search
        </button>
      </div>

      <div className="border w-full  lg:max-w-3xl cursor-pointer border-gray-200 shadow-md rounded-xl bg-white h-[200px] overflow-y-auto mt-4">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-center text-gray-500 text-sm font-medium">
            Doctor information will be displayed here.
          </p>
        </div>
      </div>
    </div>

    {/* Consultancy Fee */}
    <div className="text-base mb-4 text-gray-700  font-medium">
      <p className="flex items-center">
        Consultancy Fee - <span className="ml-1 font-semibold">₹900</span>
      </p>
    </div>

    {/* Dropdowns */}
    <div className="flex flex-col lg:flex-row items-center gap-4  mb-4 lg:gap-8 justify-center">
      <SelectDropDown
        value={dropdownValues.method}
        onChange={(value) => handleSelectChange("method", value)}
        options={["Cash", "Online/UPI"]}
        label="Method"
        placeholder="Select Method"
        inputClassName="outline-none rounded-lg bg-white h-[48px] shadow-md px-4"
        containerClassName="w-full"
        dropdownClassName="text-black bg-white"
        id="method"
      />

      <SelectDropDown
        value={dropdownValues.status}
        onChange={(value) => handleSelectChange("status", value)}
        options={["Pending", "Paid"]}
        placeholder="Select Status"
        label="Status"
        inputClassName="outline-none rounded-lg bg-white h-[48px] shadow-md px-4"
        containerClassName="w-full"
        dropdownClassName="text-black bg-white"
        id="status"
      />
    </div>
  </div>

  <AlertDialogFooter className=" lg:mt-0">
    <AlertDialogCancel className="rounded-full h-[38px] w-full border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500">
      Cancel
    </AlertDialogCancel>
    <AlertDialogAction className="rounded-full h-[38px] w-full bg-blue-500 text-white hover:bg-blue-600">
      Submit
    </AlertDialogAction>
  </AlertDialogFooter>
  </AlertDialogContent>


  </AlertDialog>
                </TableCell>
                <TableCell className="px-3 py-2">
                <AlertDialog>
  <AlertDialogTrigger className="text-xs p-2 border-[#1A91FF] border sm:text-sm rounded-full text-[#1A91FF] hover:bg-[#1A91FF] hover:text-white">
    New Followup
  </AlertDialogTrigger>

  <AlertDialogContent className="w-full max-w-lg sm:max-w-xl lg:max-w-3xl rounded-lg h-full lg:h-3/4 mx-auto overflow-x-auto">
    <AlertDialogHeader>
      <AlertDialogTitle className="text-center text-lg font-semibold">
        Add Followup Details
      </AlertDialogTitle>
    </AlertDialogHeader>

    <div className="space-y-6 ">
      {/* Search Hospital */}
      <div className="mb-4 ">
        <div className="flex items-center shadow-md h-[50px] border border-gray-200 rounded-full overflow-hidden w-full  lg:max-w-3xl ">
          <input
            type="text"
            placeholder="Search Hospital"
            className="flex-grow px-4 py-2 outline-none"
          />
          <button className="bg-blue-500 h-[50px] text-white px-4 py-2 hover:bg-blue-600 transition">
            Search
          </button>
        </div>

        <div className="border w-full  lg:max-w-3xl cursor-pointer border-gray-200 shadow-md rounded-xl bg-white h-[200px] overflow-y-auto mt-4">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center text-gray-500 text-sm font-medium">
              Hospital information will be displayed here.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 mt-4">
          <div className="w-full   lg:max-w-3xl">
            <SelectDropDown
              value={dropdownValues.department}
              onChange={(value) => handleSelectChange("department", value)}
              options={["ENT", "Cardiology"]}
              placeholder="Select Department"
              inputClassName="outline-none rounded-lg bg-white h-[48px] shadow-md px-4"
              containerClassName="w-full"
              label="Department"
              dropdownClassName="text-black bg-white"
              id="department"
            />
          </div>

          <div className="w-full   lg:max-w-3xl">
            <div className="flex flex-col">
            <label htmlFor="disease">Disease</label>
            <input
              type="text"
              name="disease"

              id="disease"
              placeholder="Enter Disease"
              className="outline-none border bg-white h-[48px] shadow-md px-4 rounded-full"
            />
            </div>
          
          </div>
        </div>
      </div>

      {/* Search Doctor */}
      <div>
        <div className="flex items-center shadow-md h-[50px] border border-gray-300 rounded-full overflow-hidden w-full  lg:max-w-3xl">
          <input
            type="text"
            placeholder="Search Doctor"
            className="flex-grow px-4 py-2 text-sm outline-none"
          />
          <button className="bg-blue-500 h-full text-white px-4 py-2 hover:bg-blue-600 transition">
            Search
          </button>
        </div>

        <div className="border w-full   lg:max-w-3xl cursor-pointer border-gray-200 shadow-md rounded-xl bg-white h-[200px] overflow-y-auto mt-4">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center text-gray-500 text-sm font-medium">
              Doctor information will be displayed here.
            </p>
          </div>
        </div>
      </div>

      {/* Consultancy Fee */}
      <div className="text-base mb-4 text-gray-700 font-medium">
        <p className="flex items-center">
          Consultancy Fee - <span className="ml-1 font-semibold">₹900</span>
        </p>
      </div>

      {/* Dropdowns */}
      <div className="flex lg:flex-row  flex-col items-center gap-4 lg:gap-8">
        <div className="w-full   lg:max-w-3xl">
          <label htmlFor="method">Payment Method</label>
          <SelectDropDown
            value={dropdownValues.method}
            onChange={(value) => handleSelectChange("method", value)}
            options={["Cash", "Online/UPI"]}
            placeholder="Select Method"
            inputClassName="outline-none rounded-lg bg-white h-[48px] shadow-md px-4"
            containerClassName="w-full"
            dropdownClassName="text-black bg-white"
            id="method"
          />
        </div>

        <div className="w-full  lg:max-w-3xl">
          <label htmlFor="status">Status</label>
          <SelectDropDown
            value={dropdownValues.status}
            onChange={(value) => handleSelectChange("status", value)}
            options={["Pending", "Paid"]}
            placeholder="Select Status"
            inputClassName="outline-none rounded-lg bg-white h-[48px] shadow-md px-4"
            containerClassName="w-full"
            dropdownClassName="text-black bg-white"
            id="status"
          />
        </div>
      </div>
    </div>

    <AlertDialogFooter className="lg:mt-0">
      <AlertDialogCancel className="rounded-full h-[38px] w-full border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500">
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction className="rounded-full h-[38px] w-full bg-blue-500 text-white hover:bg-blue-600">
        Submit
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
  </AlertDialog>

                  
                </TableCell>
                <TableCell className="text-center">
                <AlertDialog>
                  <AlertDialogTrigger><Trash className="cursor-pointer text-red-500" size={15} 
                          onClick={() => setdeleteWalkin(row)} 

                  /></AlertDialogTrigger>
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
                      <AlertDialogAction
    type="submit"
    onClick={() => {
      if (deleteWalkin?._id) {
        handleDelete(deleteWalkin._id);
      }
    }}
    className="rounded-full bg-blue-500 text-white hover:bg-blue-600"
  >
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
    </div>
  );
};
