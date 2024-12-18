import React, { useState, useEffect } from 'react';
import { useModal } from '@/hooks/useModal';
import Modal from '../../Modal/Modal';
import { getPrice, CreatePrice, UpdatePrice } from '@/routes/routes';
import { IoMdPricetags } from 'react-icons/io';

const AddPayments = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [editMode, setEditMode] = useState(false);
  const [pricedata, setPriceData] = useState<{ price: number }>({ price: 0 });
  const [priceId, setPriceId] = useState<string>("");

  // Fetch prices on component mount
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await getPrice();
        const data = response?.data[0];
        if (data) {
          setPriceData({ price: data.price });
          setPriceId(data._id);
          setEditMode(true); // If there's existing data, set to edit mode
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrice();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPriceData({ price: Number(value) });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editMode) {
        // Update price
        await UpdatePrice(priceId, { price: pricedata.price });
      } else {
        // Create new price
        const response = await CreatePrice({ price: pricedata.price });
        setPriceId(response.data[0]._id);
        setEditMode(true);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving price:", error);
    }
  };

  // Close modal without resetting data
  const handleCloseModal = () => {
    closeModal();
    // No need to reset pricedata here
  };

  return (
    <div>
      <button
        className="px-4 w-full flex items-center gap-2 py-2 bg-blue-500 text-white rounded-lg"
        onClick={openModal}
      >
        <IoMdPricetags /> Pricing
      </button>

      <Modal isOpen={isOpen} onClose={handleCloseModal} title={editMode ? "Edit Pricing" : "Add Pricing"}>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Enter pricing"
            value={pricedata.price || 0} // Make sure it defaults to 0 if no value
            onChange={handleInputChange}
            className="w-full px-4 placeholder:text-sm p-2 shadow-md border border-gray-300 rounded-md outline-none mb-4"
          />
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCloseModal} // Ensure close doesn't reset state
              className="w-full px-4 py-2 rounded-full border text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm"
            >
              {editMode ? "Save Changes" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddPayments;
