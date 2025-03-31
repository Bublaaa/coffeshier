import { useParams } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ProductDetailPage = () => {
  const { id } = useParams(); // Get the product ID from the URL

  return <h1>Product ID: {id}</h1>;
};

export default ProductDetailPage;
