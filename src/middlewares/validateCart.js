const validateCart = (req, res, next) => {
  const { products } = req.body;

  // Verificar que 'products' sea un array
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: "'products' debe ser un array" });
  }

  // Verificar y limpiar cada objeto en el array
  for (let i = 0; i < products.length; i++) {
    const item = products[i];

    // Verificar que cada objeto tenga propiedades 'product' y 'qty'
    if (typeof item !== 'object' || typeof item.product !== 'number' || typeof item.qty !== 'number') {
      return res.status(400).json({ error: "Cada objeto debe tener propiedades 'product' (número) y 'qty' (número)" });
    }

    // Eliminar propiedades adicionales
    products[i] = {
      product: item.product,
      qty: item.qty
    };
  }

  // Crear un nuevo objeto solo con los campos permitidos y asignarlo a req.body
  req.body = { products };

  next();
};

export default validateCart;
