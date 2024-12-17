import { getAllRegion, createRegion, DeleteRegion,UpdateRegion } from "@/routes/routes"; // Adjust import paths
import {  Regions } from "@/types/types";
import React, { useState, useEffect } from "react";
import { EditIcon, Plus, Trash, UploadCloudIcon } from "lucide-react";
import Image from "next/image";
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
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const RegionsTable = () => {
  const [data, setData] = useState<Regions[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<Regions | null>(null);
  const [formValues, setFormValues] = useState({
    region_name: "",
    region_image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [deletingRegion, setDeletingRegion] = useState<Regions | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllRegion();
        setData(res.data);
      } catch (e) {
        console.error("Error fetching regions:", e);
      }
    };

    getData();
  }, []);

  const handleDelete = async () => {
    if (deletingRegion) {
      try {
        await DeleteRegion(deletingRegion._id);
        setData(data.filter((region) => region._id !== deletingRegion._id));
        setDeletingRegion(null);
      } catch (e) {
        console.error("Error deleting region:", e);
      }
    }
  };

  const handleEdit = (region: Regions) => {
    setCurrentRegion(region);
    setFormValues({
      region_name: region.region_name,
      region_image: region.region_image,
    });
    setImagePreview(region.region_image);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentRegion(null);
    setFormValues({
      region_name: "",
      region_image: "",
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
        setFormValues({ ...formValues, region_image: reader.result as string });
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
      formData.append("region_name", formValues.region_name);
  
      // If there's an image file, append it to FormData
      if (imageFile) {
        formData.append("region_image", imageFile);
      } else if (formValues.region_image) {
        // In case there's an existing base64 image, append that too
        formData.append("region_image", formValues.region_image);
      }
  
      let response;
      if (currentRegion) {
        // If updating an existing region
        // Send FormData for both region name and image
        response = await UpdateRegion(currentRegion._id, formData);
  
        // Update the local state to reflect changes
        setData(data.map((region) =>
          region._id === currentRegion._id
            ? { ...region, region_name: formValues.region_name, region_image: formValues.region_image }
            : region
        ));
      } else {
        // If creating a new region
        response = await createRegion(formData);
        setData([...data, response.data]);
      }
  
      setModalOpen(false); // Close modal after submission
    } catch (error) {
      console.error("Error submitting region:", error);
      alert("An error occurred while submitting the region details.");
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
        <h1 className="text-2xl font-bold mb-4">Regions</h1>
        <button
          onClick={handleCreate}
          className="mb-4 flex items-center text-sm rounded-full bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
        >
          Create Region <Plus />
        </button>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full whitespace-nowrap">
            <thead className="bg-blue-100">
              <tr>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">S.No</th>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">Region Name</th>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">Region Image</th>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">Edit</th>
                <th className="text-xs text-center sm:text-sm font-medium text-gray-700 uppercase px-3 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((region, index) => (
                <tr key={region._id} className="text-center border-b border-gray-300">
                  <td className="px-3 py-2 text-gray-900 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-3 py-2 text-gray-900 text-sm">{region.region_name}</td>
                  <td className="px-3 py-2 text-gray-900 text-sm">
                    <Image src={region.region_image} alt={region.region_name} width={50} height={100} className="mx-auto" />
                  </td>
                  <td className="px-3 py-2 text-gray-900 text-sm">
                    <button onClick={() => handleEdit(region)} className="px-2 py-1">
                      <EditIcon />
                    </button>
                  </td>
                  <td className="px-3 py-2 text-gray-900 text-sm">
                    <AlertDialog>
                      <AlertDialogTrigger onClick={() => setDeletingRegion(region)} className="bg-red-500 rounded-xl text-white px-2 py-1 hover:bg-red-600">
                        <Trash />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-full max-w-sm sm:max-w-xl lg:max-w-3xl rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this region and remove it from our database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <div className="flex gap-4 items-center">
                            <AlertDialogCancel onClick={() => setDeletingRegion(null)} className="w-full rounded-full">
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
            <h2 className="text-lg font-bold mb-4">{currentRegion ? "Edit Region" : "Create Region"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Region Name:</label>
                <input
                  type="text"
                  value={formValues.region_name}
                  onChange={(e) => setFormValues({ ...formValues, region_name: e.target.value })}
                  className="w-full placeholder:text-sm placeholder:px-4 p-2 shadow-md border border-gray-300 rounded-md outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Region Image:</label>
                <div className="flex items-center gap-3">
                  <label htmlFor="file-upload" className="flex items-center w-full shadow-md gap-2 cursor-pointer bg-gray-200 px-3 py-2 rounded hover:bg-gray-300">
                    <UploadCloudIcon size={24} />
                    <span className="text-sm"> Upload Image</span>
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
                    <Image src={imagePreview} alt="Region Image Preview" width={100} height={100} className="mt-4 max-w-full" />
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
                  {currentRegion ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionsTable;
