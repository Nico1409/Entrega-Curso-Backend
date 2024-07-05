const validateProduct = (req, res, next) => {
  let { title, description, code, price, status, stock, category } = req.body;

  // Crear un nuevo objeto solo con los campos permitidos
  const validProduct = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
  };

  // Eliminar cualquier campo no permitido del body
  req.body = validProduct;

  // Establecer status en true si no está definido
  if (!status) {
    req.body.status = true;
  }

  // Verificar que todos los campos obligatorios estén presentes y sean del tipo correcto
  if (!title || !description || !code || !price || !stock || !category) {
    return res
      .status(400)
      .json({ error: "Los campos del producto son inválidos" });
  }

  next();
};

export default validateProduct;
