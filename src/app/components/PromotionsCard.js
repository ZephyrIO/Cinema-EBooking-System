import React from "react";
import "./PromotionsCard.css";

const PromotionCard = ({ promotion }) => {
  return (
    <div className="promotion-card">
      <h2 className="title">{promotion.title}</h2>
      <p className="description">{promotion.description}</p>
      <p className="code">Code: <code>{promotion.code}</code></p>
      <p className="discount">Discount: {promotion.discount}% off</p>
    </div>
  );
};

export default PromotionCard;