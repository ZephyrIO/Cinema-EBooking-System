'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PromotionCard from "./PromotionsCard";
import "./ManagePromotions.css";

const ManagePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [newPromotion, setNewPromotion] = useState({
    title: "",
    description: "",
    code: "",
    discount: "",
  });
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // Fetch promotions from the backend
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('/api/promotions');
        setPromotions(response.data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setError("Failed to fetch promotions.");
      }
    };

    fetchPromotions();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion({ ...newPromotion, [name]: value });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Add a new promotion (POST to backend)
  const handleAddPromotion = async (e) => {
    e.preventDefault();
    if (
      newPromotion.title &&
      newPromotion.description &&
      newPromotion.code &&
      newPromotion.discount
    ) {
      try {
        const response = await axios.post('/api/promotions', {
          title: newPromotion.title,
          description: newPromotion.description,
          code: newPromotion.code,
          discount: Number(newPromotion.discount),
        });

        setPromotions([...promotions, response.data]); // Update the list with the new promotion
        setNewPromotion({
          title: "",
          description: "",
          code: "",
          discount: "",
        });
        setShowModal(false); // Close the modal
        alert("Promotion added successfully!");
      } catch (error) {
        console.error("Error adding promotion:", error);
        setError(error.response?.data?.message || "Failed to add promotion.");
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  // Simulate sending promotion email
  const handleSendEmail = async () => {
    if (email) {
      try {
        // Simulate email API (replace with actual email endpoint if available)
        await axios.post('/api/sendEmail', { email, promotions });
        alert(`Promotion details have been sent to ${email}`);
        setEmail(""); // Reset email field
      } catch (error) {
        console.error("Error sending email:", error);
        alert("Failed to send email. Please try again.");
      }
    } else {
      alert("Please enter a valid email.");
    }
  };

  return (
    <div>
      <h1 className="title">Manage Promotions</h1>

      {error && <div className="error-message">{error}</div>} {/* Error Message */}

      {/* Display Promotions */}
      <div>
        {promotions.map((promotion, index) => (
          <PromotionCard key={promotion._id || index} promotion={promotion} />
        ))}
      </div>

      {/* Add New Promotion Button */}
      <button className="add-promotion-btn" onClick={() => setShowModal(true)}>
        Add Promotion
      </button>

      {/* Modal for Adding New Promotion */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Promotion</h2>
            <form onSubmit={handleAddPromotion}>
              <input
                type="text"
                name="title"
                placeholder="Promotion Title"
                value={newPromotion.title}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="description"
                placeholder="Promotion Description"
                value={newPromotion.description}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="code"
                placeholder="Promotion Code"
                value={newPromotion.code}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="discount"
                placeholder="Discount (%)"
                value={newPromotion.discount}
                onChange={handleInputChange}
              />
              <button type="submit">Save Promotion</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Send Promotion Email */}
      <div className="email-section">
        <h2>Send Promotion to Email</h2>
        <input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={handleEmailChange}
        />
        <button onClick={handleSendEmail}>Send Email</button>
      </div>
    </div>
  );
};

export default ManagePromotions;
