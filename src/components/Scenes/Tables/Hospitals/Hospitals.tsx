"use client";

import { getAllHospital,  createHospital,  DeleteHospital, UpdateHospital } from "@/routes/routes";
import { Hospital } from "@/types/types";
import { EditIcon, Plus, Trash, UploadCloudIcon } from "lucide-react";
import Image from "next/image";
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

const Hospitals = () => {
  const [data, setData] = useState<Hospital[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentHospital, setCurrentHospital] = useState<Hospital | null>(null);
  const [formValues, setFormValues] = useState({
    hospital_name: "",
    hospital_address: "",
    hospital_icon: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [deletingHospital, setDeletingHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllHospital();
        setData(res.data);
      } catch (e) {
        console.error("Error fetching hospitals:", e);
      }
    };

    getData();
  }, []);

  const handleDelete = async () => {
    if (deletingHospital) {
      try {
        await DeleteHospital(deletingHospital._id);
        setData(data.filter((hospital) => hospital._id !== deletingHospital._id));
        setDeletingHospital(null); // Clear deletingHospital after deletion
      } catch (e) {
        console.error("Error deleting hospital:", e);
      }
    }
  };

  const handleEdit = (hospital: Hospital) => {
    setCurrentHospital(hospital);
    setFormValues({
      hospital_name: hospital.hospital_name,
      hospital_address: hospital.hospital_address,
      hospital_icon: hospital.hospital_icon,
    });
    setImagePreview(hospital.hospital_icon);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentHospital(null);
    setFormValues({
      hospital_name: "",
      hospital_address: "",
      hospital_icon: "",
    });
    setImagePreview(null);
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setFormValues({ ...formValues, hospital_icon: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    try {
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      const imageFile = fileInput?.files?.[0] || null;
  
      // Create FormData for API submission
      const formData = new FormData();
      formData.append("hospital_name", formValues.hospital_name);
      formData.append("hospital_address", formValues.hospital_address);
  
      if (imageFile) {
        formData.append("hospital_icon", imageFile);
      } else if (formValues.hospital_icon) {
        formData.append("hospital_icon", formValues.hospital_icon);
      }
  
      let response;
      if (currentHospital) {
        // If updating an existing hospital, send both JSON and FormData requests
        const jsonData = {
          hospital_name: formValues.hospital_name,
          hospital_address: formValues.hospital_address,
        };
  
        // Send JSON data first (non-image fields)
       await UpdateHospital(currentHospital._id, jsonData); // Send JSON request
  
        // Then send FormData (image upload)
       await UpdateHospital(currentHospital._id, formData); // Send FormData request
  
        // Handle successful response from both requests
        setData(data.map(hospital =>
          hospital._id === currentHospital._id
            ? { ...hospital, hospital_name: formValues.hospital_name, hospital_address: formValues.hospital_address, hospital_icon: formValues.hospital_icon }
            : hospital
        ));
      } else {
        response = await createHospital(formData);
        setData([...data, response.data]);
      }
  
      setModalOpen(false); // Close modal after submission
    } catch (error) {
      console.error("Error submitting hospital:", error);
      // Optionally, show a user-friendly error message
      alert("An error occurred while submitting the hospital details.");
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
        <h1 className="text-2xl font-bold mb-4">Hospitals</h1>
        <button
          onClick={handleCreate}
          className="mb-4 flex items-center text-sm rounded-full bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
        >
          Create Hospital <Plus />
        </button>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full whitespace-nowrap">
            <thead className="bg-blue-100">
              <tr>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">S.No</th>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">Hospital Name</th>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">Hospital Icon</th>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">Edit</th>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((hospital, index) => (
                <tr key={hospital._id} className="text-center border-b border-gray-300">
                  <td className="px-3 py-2 text-gray-900 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-3 py-2 text-gray-900 text-sm">{hospital.hospital_name}</td>
                  <td className="px-3 py-2 text-gray-900 text-sm">
                    <Image src={hospital.hospital_icon} alt={hospital.hospital_name} width={50} height={100} className="mx-auto" />
                  </td>
                  <td className="px-3 py-2 text-gray-900 text-sm">
                    <button onClick={() => handleEdit(hospital)} className="px-2 py-1">
                      <EditIcon />
                    </button>
                  </td>
                  <td className="px-3 py-2 text-gray-900 text-sm">
                    <AlertDialog>
                      <AlertDialogTrigger onClick={() => setDeletingHospital(hospital)} className="bg-red-500 rounded-xl text-white px-2 py-1 hover:bg-red-600">
                          <Trash />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-full max-w-sm sm:max-w-xl lg:max-w-3xl rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this hospital and remove it from our database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <div className="flex gap-4 items-center">
                            <AlertDialogCancel onClick={() => setDeletingHospital(null)} className="w-full rounded-full">
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
            <h2 className="text-lg font-bold mb-4">{currentHospital ? "Edit Hospital" : "Create Hospital"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Hospital Name:</label>
                <input
                  type="text"
                  value={formValues.hospital_name}
                  onChange={(e) => setFormValues({ ...formValues, hospital_name: e.target.value })}
                  className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Hospital Address:</label>
                <textarea
                  rows={3}
                  value={formValues.hospital_address}
                  onChange={(e) => setFormValues({ ...formValues, hospital_address: e.target.value })}
                  className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Hospital Icon:</label>
                <div className="flex items-center gap-3">
                  <label htmlFor="file-upload" className="flex items-center w-full shadow-md gap-2 cursor-pointer bg-gray-200 px-3 py-2 rounded hover:bg-gray-300">
                    <UploadCloudIcon size={24} />
                    <span className="text-sm"> Upload Icon</span>
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {imagePreview && (
                  <div className="w-full flex justify-center">
                    <Image src={imagePreview} alt="Hospital Icon Preview" width={100} height={100} className="mt-4 max-w-full" />
                  </div>
                )}
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
                  {currentHospital ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hospitals;
