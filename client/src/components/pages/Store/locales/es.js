const store_es = {
  navbar: {
    users: "Usuarios",
    products: "Productos",
    checkout: "Caja",
    wallet: "Billetera",
    settings: "Configuración",
    logout: "Cerrar sesión",
    cart: "Caja"
  },
  dashboard: {
    title: "Panel de control",
    subtitle: "Bienvenido al panel de administración de tu tienda",
    stats: {
      users: "Usuarios",
      products: "Productos",
      sales: "Ventas",
    },
  },
  users: {
    title: "Usuarios",
    subtitle: "Gestiona el personal de tu tienda",
    addUser: "Agregar Usuario",
    name: "Nombre",
    role: "Rol",
    email: "Email",
    phone: "Teléfono",
    status: "Estado",
    actions: "Acciones",
    modal: {
      titleAdd: "Agregar Usuario",
      titleEdit: "Editar Usuario",
      titleDelete: "Eliminar Usuario",
      subtitleDelete: "Estás seguro que deseas eliminar a",
      warningDelete: "Esta acción no se puede deshacer.",
      userNameLabel: "Nombre",
      userNamePlaceholder: "Introduce el Nombre del Usuario",
      userPinLabel: "PIN",
      userPinPlaceholder: "Introduce un PIN de 4 dígitos",
      userPhoneLabel: "Teléfono",
      userPhonePlaceholder: "Ej: 3312345678",
      userEmailLabel: "Email",
      userEmailPlaceholder: "contact@awesomebusiness.com",
      userRoleLabel: "Rol",
      submitButton: "Agregar",
      editButton: "Guardar",
      cancelButton: "Cancelar",
      deleteButton: "Eliminar",
    },
  },
  products: {
    title: "Productos",
    subtitle: "Gestiona tu catálogo de productos e inventario",
    addProduct: "Agregar Producto",
    image: "Imagen",
    name: "Nombre",
    description: "Descripción",
    category: "Categoría",
    sku: "SKU",
    price: "Precio",
    stock: "Almacen",
    actions: "Acciones",
    modal: {
      titleAdd: "Agregar Producto",
      titleEdit: "Editar Producto",
      titleDelete: "Eliminar Producto",
      subtitleDelete: "Estás seguro que deseas eliminar",
      warningDelete: "Esta acción no se puede deshacer.",
      productNameLabel: "Nombre del Producto",
      productNamePlaceholder: "Orange Pi",
      productDescriptionLabel: "Descripción del Producto",
      productDescriptionPlaceholder: "Mi excelente producto",
      productCategoryLabel: "Categoría del Producto",
      productCategoryPlaceholder: "Electronica",
      productSKULabel: "SKU",
      productSKUPlaceholder: "OrangePi3Zero",
      productPriceLabel: "Precio",
      productPricePlaceholder: "0.00",
      productStockLabel: "En Almacen",
      productStockPlaceholder: "0",
      productImage: "Imagen del Producto",
      productImageUpload: "Sube una Imagen",
      productImageUploadMessage: "PNG, JPG o GIF (máx. 5MB)",
      submitButton: "Agregar",
      cancelButton: "Cancelar",
      editButton: "Guardar",
      deleteButton: "Eliminar",
      categorySelectPlaceholder: "Elige una categoría",
      createCategoryLabel: "Crear nueva categoría",
      createCategoryPlaceholder: "Electrónica",
      createCategoryButton: "Agregar categoría"
    }
  },
  cart: {
    title: "Caja",
    subtitle: "Sistema de pago de productos",
    search: {
      label: "Buscar",
      placeholder: "Buscar producto...",
      filterAll: "Todos"
    },
    card: {
      add: "Agregar",
      stock: "en almacén"
    },
    summary: {
      title: "Resumen",
      total: "Total",
      subtotal: "Subtotal",
      discount: "Descuento",
      quantity: "Cantidad",
      pay: "Pagar"
    }
  }
};

export default store_es;
