const convertQuantityByUnit = (quantity, unit, converterUnit) => {
  if (typeof quantity !== "number" || quantity <= 0) {
    throw new Error("Invalid quantity: must be a positive number");
  }
  if (typeof unit !== "string" || typeof converterUnit !== "string") {
    throw new Error("Invalid unit: must be a string");
  }

  // Define unit categories
  const liquidUnits = ["ml", "li"];
  const solidUnits = ["mg", "gr", "kg"];

  // Check if the conversion is between different types
  const isLiquid = liquidUnits.includes(unit);
  const isSolid = solidUnits.includes(unit);
  const isTargetLiquid = liquidUnits.includes(converterUnit);
  const isTargetSolid = solidUnits.includes(converterUnit);

  if ((isLiquid && isTargetSolid) || (isSolid && isTargetLiquid)) {
    throw new Error(
      `Cannot convert ${unit} to ${converterUnit}: Liquid and solid units are incompatible`
    );
  }

  // Conversion factors (base unit: liter for liquid, gram for solid)
  const conversionTable = {
    li: { ml: 1000, li: 1 },
    ml: { ml: 1, li: 0.001 },
    kg: { gr: 1000, kg: 1 },
    gr: { gr: 1, kg: 0.001, mg: 1000 },
    mg: { mg: 1, gr: 0.001 },
  };

  // Check if conversion is possible
  if (!conversionTable[unit] || !conversionTable[unit][converterUnit]) {
    throw new Error(
      `Invalid unit conversion from '${unit}' to '${converterUnit}'`
    );
  }

  // Convert quantity
  const convertedQuantity = quantity * conversionTable[unit][converterUnit];

  return {
    quantity: convertedQuantity,
    unit: converterUnit,
  };
};

export default convertQuantityByUnit;
