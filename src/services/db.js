// Servicio de base de datos temporal usando localStorage
// Implementa la misma firma que usaríamos con Supabase para facilitar la migración futura.

const DB_PREFIX = 'pos_ropa_';

const getFromStorage = (key) => {
    const data = localStorage.getItem(DB_PREFIX + key);
    return data ? JSON.parse(data) : [];
};

const saveToStorage = (key, data) => {
    localStorage.setItem(DB_PREFIX + key, JSON.stringify(data));
};

// --- FAMILIAS ---
export const getFamilias = async () => {
    return getFromStorage('familias');
};

export const createFamilia = async (familia) => {
    const familias = getFromStorage('familias');
    const newFamilia = { ...familia, id: crypto.randomUUID() };
    familias.push(newFamilia);
    saveToStorage('familias', familias);
    return newFamilia;
};

// --- INGRESOS ---
export const getIngresos = async () => {
    return getFromStorage('ingresos');
};

export const createIngreso = async (ingresoData, productosList) => {
    // 1. Crear el Ingreso
    const ingresos = getFromStorage('ingresos');

    // Auto-generar numero de ingreso (secuencial simple basado en cantidad)
    const numero_ingreso = ingresos.length + 1;

    const newIngreso = {
        ...ingresoData,
        id: crypto.randomUUID(),
        numero_ingreso,
        fecha_ingreso: new Date().toISOString()
    };

    ingresos.push(newIngreso);
    saveToStorage('ingresos', ingresos);

    // 2. Crear los Productos asociados a este Ingreso
    const productosDB = getFromStorage('productos');
    const newProductos = productosList.map(p => ({
        ...p,
        id: crypto.randomUUID(),
        ingreso_id: newIngreso.id,
        estado: 'disponible'
    }));

    const updatedProductos = [...productosDB, ...newProductos];
    saveToStorage('productos', updatedProductos);

    return { ingreso: newIngreso, productos: newProductos };
};

// --- PRODUCTOS (Inventario) ---
export const getProductos = async () => {
    const productos = getFromStorage('productos');
    const familias = getFromStorage('familias');
    const ingresos = getFromStorage('ingresos');

    // Join manual para emular base de datos relacional
    return productos.map(p => ({
        ...p,
        familia: familias.find(f => f.id === p.familia_id) || null,
        ingreso: ingresos.find(i => i.id === p.ingreso_id) || null
    }));
};

export const updateProducto = async (id, updates) => {
    const productos = getFromStorage('productos');
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1) {
        productos[index] = { ...productos[index], ...updates };
        saveToStorage('productos', productos);
        return productos[index];
    }
    throw new Error('Producto no encontrado');
};

export const getProductoByCodigo = async (codigo_barras) => {
    const productos = getFromStorage('productos');
    const product = productos.find(p => p.codigo_barras === codigo_barras);

    if (!product) return null;

    const familias = getFromStorage('familias');
    const ingresos = getFromStorage('ingresos');

    return {
        ...product,
        familia: familias.find(f => f.id === product.familia_id) || null,
        ingreso: ingresos.find(i => i.id === product.ingreso_id) || null
    };
};

// --- VENTAS ---
export const getVentas = async () => {
    const ventas = getFromStorage('ventas');
    const productos = getFromStorage('productos');

    return ventas.map(v => ({
        ...v,
        producto: productos.find(p => p.id === v.producto_id) || null
    }));
};

export const registerVenta = async (codigo_barras, precio_venta_final) => {
    // 1. Buscar producto
    const productos = getFromStorage('productos');
    const productIndex = productos.findIndex(p => p.codigo_barras === codigo_barras && p.estado === 'disponible');

    if (productIndex === -1) {
        throw new Error('Producto no encontrado o ya vendido');
    }

    const producto = productos[productIndex];

    // 2. Calcular margen de ganancia
    const costo_real_total = parseFloat(producto.costo_real_total) || 0;
    const precioFinalNum = parseFloat(precio_venta_final);
    const margen_ganancia = precioFinalNum - costo_real_total;

    // 3. Crear registro de venta
    const ventas = getFromStorage('ventas');
    const newVenta = {
        id: crypto.randomUUID(),
        producto_id: producto.id,
        precio_venta_final: precioFinalNum,
        fecha_venta: new Date().toISOString(),
        margen_ganancia
    };
    ventas.push(newVenta);
    saveToStorage('ventas', ventas);

    // 4. Actualizar estado del producto a vendido
    productos[productIndex].estado = 'vendido';
    saveToStorage('productos', productos);

    return newVenta;
};

// Script para inicializar datos dummy si está vacía
export const initDummyDataIfNeeded = () => {
    const familias = getFromStorage('familias');
    if (familias.length === 0) {
        console.log("Inicializando base de datos local con datos de prueba...");
        const f1 = { id: crypto.randomUUID(), nombre: 'Polos' };
        const f2 = { id: crypto.randomUUID(), nombre: 'Pantalones' };
        saveToStorage('familias', [f1, f2]);
    }
};
