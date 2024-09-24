import React from "react";

const PromotionCard = ({ promotion }) => {
  return (
    <div className="promotion-card">
      <h2>{promotion.title}</h2>
      <p>{promotion.description}</p>
      <p>Code: <code>{promotion.code}</code></p>
      <p>Discount: {promotion.discount}% off</p>
    </div>
  );
};

export default PromotionCard;