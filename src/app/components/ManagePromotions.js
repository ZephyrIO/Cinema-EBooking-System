import React from "react";
import PromotionCard from "./PromotionsCard";
import './ManagePromotions.css'

const promotions = [
  {
    title: "Summer Sale",
    description: "Get 20% off all Movie Tickets for Adults and Children",
    code: "SUMMER20",
    discount: 20,
  },
  {
    title: "Big Release Discout",
    description: "Get 15% off your order if the total is over $30",
    code: "BG15",
    discount: 15,
  },
];

const ManagePromotions = () => {
  return (
    <div>
    <h1 className="title">Manage promotions</h1>
    <div>
      {promotions.map((promotion, index) => (
        <PromotionCard key={index} promotion={promotion} />
      ))}
    </div>
  </div>
  );
};

export default ManagePromotions;