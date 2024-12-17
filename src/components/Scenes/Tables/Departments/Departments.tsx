/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getAllDept, DeleteDept, UpdateDept, createDept } from "@/routes/routes";
import { Department } from "@/types/types";
import { EditIcon, Plus, Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/TableAlert";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

const Departments = () => {
  const [data, setData] = useState<Department[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [Dept, setCurrentDept] = useState<Department | null>(null);
  const [formValues, setFormValues] = useState({
    department_name: "",
    department_description:""
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllDept();
        setData(res.data);
      } catch (e) {
        console.error("Error fetching departments:", e);
      }
    };

    getData();
  }, []);

  const handleDelete = async () => {
    if (deletingDepartment) {
      try {
        await DeleteDept(deletingDepartment._id!);
        setData(data.filter((dept) => dept._id !== deletingDepartment._id));
        setDeletingDepartment(null); 
      } catch (e) {
        console.error("Error deleting department:", e);
      }
    }
  };
  

  const handleEdit = (dept: Department) => {
    console.log(dept)
    setCurrentDept(dept);
    setFormValues({
      department_name: dept.department_name,
      department_description:dept.department_description
    });
    setModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentDept(null);
    setFormValues({
      department_name: "",
      department_description:""
    });
    setModalOpen(true);
  };

  

  const handleSubmit = async () => {
    try {
      const deptData = {
        department_name: formValues.department_name,
        department_description:formValues.department_description
      };

      console.log(deptData)
  
      if (Dept) {
        // Update department
        const updatedDept = await UpdateDept(Dept._id!, deptData);
        setData(
          data.map((department) =>
            department._id === Dept._id
              ? { ...department, department_name: updatedDept.data.department_name }
              : department
          )
        );
      } else {
        // Create new department
        const newDept = await createDept(deptData);
        setData([...data, newDept.data]); // Use the response from the backend
      }
  
      setModalOpen(false); // Close modal after submission
    } catch (error) {
      console.error("Error submitting department:", error);
    }
  };
  
  
  

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Departments</h1>
        <button
          onClick={handleCreate}
          className="mb-4 flex items-center text-sm rounded-full bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
        >
          Create Department <Plus />
        </button>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full whitespace-nowrap">
            <thead className="bg-blue-100">
              <tr>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">S.No</th>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2"> Name</th>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">Edit</th>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((department, index) => (
                <tr key={index} className="text-center border-b border-gray-300">
                  <td className="px-3 py-2 text-gray-900 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-3 py-2 text-gray-900 text-sm">{department.department_name}</td>
                  <td className="px-3 py-2 text-gray-900 text-sm">
                    <button onClick={() => handleEdit(department)} className="px-2 py-1">
                      <EditIcon />
                    </button>
                  </td>
                  <td className="px-3 py-2 text-gray-900 text-sm">
                    <AlertDialog>
                      <AlertDialogTrigger
                                                onClick={() => setDeletingDepartment(department)}

                                                className="bg-red-500 rounded-xl text-white px-2 py-1 hover:bg-red-600"

                      >
                    
                          <Trash />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-full max-w-sm sm:max-w-xl lg:max-w-3xl rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this department and remove it from our database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <div className="flex gap-4 items-center">
                            <AlertDialogCancel onClick={() => setDeletingDepartment(null)} className="w-full rounded-full">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-blue-500 w-full rounded-full">
                              Delete
                            </AlertDialogAction>
                          </div>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Pagination Controls */}
       {/* Pagination Controls */}
     {data.length > itemsPerPage && (
       <div className="flex justify-center gap-4 items-center mt-4">
         <button
           onClick={handlePrevPage}
           disabled={currentPage === 1}
           className={`p-2 text-sm rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"} text-white`}
         >
           <IoIosArrowBack />
         </button>
         <p className="text-sm">
           Page {currentPage} of {totalPages}
         </p>
         <button
           onClick={handleNextPage}
           disabled={currentPage === totalPages}
           className={`p-2 text-sm rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"} text-white`}
         >
           <IoIosArrowForward />
         </button>
       </div>
     )}
      {/* Modal for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">{Dept ? "Edit Department" : "Create Department"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Department Name:</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={formValues.department_name}
                  onChange={(e) => setFormValues({ ...formValues, department_name: e.target.value })}
                  className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
                />
              </div>


              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Department Description:</label>
                <textarea
                  rows={7}
                  placeholder="Enter Description"
                  value={formValues.department_description}
                  onChange={(e) => setFormValues({ ...formValues, department_description: e.target.value })}
                  className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 w-full text-white px-4 text-sm py-2 rounded-full"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 w-full text-sm text-white px-4 py-2 rounded-full">
                  {Dept ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
