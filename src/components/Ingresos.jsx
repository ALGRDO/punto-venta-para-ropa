import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Save, Plus, Trash2, Printer, Tag } from 'lucide-react';
import { getFamilias, createIngreso } from '../services/db';

export function Ingresos() {
    const [familias, setFamilias] = useState([]);

    // Cabecera del Ingreso (Lote)
    const [ingresoData, setIngresoData] = useState({
        costo_flete: '',
        costo_total_mercaderia: '', // Base
    });

    // Productos añadidos a este ingreso
    const [productosLineas, setProductosLineas] = useState([]);

    // Formulario para item actual
    const [currentItem, setCurrentItem] = useState({
        nombre_descripcion: '',
        familia_id: '',
        costo_unitario_base: '',
        precio_venta_sugerido: ''
    });

    useEffect(() => {
        cargarFamilias();
    }, []);

    const cargarFamilias = async () => {
        const f = await getFamilias();
        setFamilias(f);
        if (f.length > 0 && !currentItem.familia_id) {
            setCurrentItem(prev => ({ ...prev, familia_id: f[0].id }));
        }
    };

    const handleIngresoChange = (e) => {
        setIngresoData({ ...ingresoData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (e) => {
        setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
    };

    // Auto calcular sugerido para el item actual
    useEffect(() => {
        const base = parseFloat(currentItem.costo_unitario_base) || 0;
        if (base > 0) {
            // Un multiplicador estandar de ganancia si no ha puesto
            const sugerido = base * 1.5; // +50%
            setCurrentItem(prev => ({ ...prev, precio_venta_sugerido: sugerido.toFixed(2) }));
        }
    }, [currentItem.costo_unitario_base]);

    const generarCodigoBarrasUnico = () => {
        return Math.floor(100000000000 + Math.random() * 900000000000).toString();
    };

    const agregarProducto = () => {
        if (!currentItem.nombre_descripcion || !currentItem.costo_unitario_base) {
            alert("Completa nombre y costo base del producto");
            return;
        }

        const fleteLote = parseFloat(ingresoData.costo_flete) || 0;
        const baseLote = parseFloat(ingresoData.costo_total_mercaderia) || 1; // evitar division por 0

        const baseUnitario = parseFloat(currentItem.costo_unitario_base) || 0;

        // Prorrateo del flete en base al costo
        // (Costo del item / Costo total de mercaderia) * Costo Flete Total
        // Si no hay total mercaderia todavia, dividimos el flete entre los items + 1
        let fleteUnitario = 0;
        if (ingresoData.costo_total_mercaderia > 0) {
            fleteUnitario = (baseUnitario / baseLote) * fleteLote;
        } else {
            // Reparticion equitativa si no llenaron el total mmercaderia
            fleteUnitario = fleteLote / (productosLineas.length + 1);
        }

        const costoReal = baseUnitario + fleteUnitario;

        const nuevoProducto = {
            ...currentItem,
            codigo_barras: generarCodigoBarrasUnico(),
            costo_unitario_base: baseUnitario,
            costo_unitario_flete: fleteUnitario.toFixed(2),
            costo_real_total: costoReal.toFixed(2),
            precio_venta_sugerido: parseFloat(currentItem.precio_venta_sugerido) || costoReal * 1.5
        };

        setProductosLineas([...productosLineas, nuevoProducto]);

        // Reset Item
        setCurrentItem({
            nombre_descripcion: '',
            familia_id: familias.length > 0 ? familias[0].id : '',
            costo_unitario_base: '',
            precio_venta_sugerido: ''
        });
    };

    const eliminarProducto = (index) => {
        const nuevos = [...productosLineas];
        nuevos.splice(index, 1);
        setProductosLineas(nuevos);
    };

    const guardarIngreso = async () => {
        if (productosLineas.length === 0) {
            alert("Agrega al menos un producto al ingreso");
            return;
        }

        const costoTotalTienda = (parseFloat(ingresoData.costo_total_mercaderia) || 0) + (parseFloat(ingresoData.costo_flete) || 0);

        try {
            await createIngreso({
                ...ingresoData,
                costo_total_tienda: costoTotalTienda.toFixed(2)
            }, productosLineas);

            alert("Ingreso guardado correctamente.");

            // Reset todo
            setIngresoData({ costo_flete: '', costo_total_mercaderia: '' });
            setProductosLineas([]);

        } catch (error) {
            alert("Error guardando: " + error.message);
        }
    };

    return (
        <div className="glass" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2>Registrar Nuevo Ingreso (Lote)</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Ingresa los detalles del lote y luego agrega los productos físicos que llegaron.</p>
            </div>

            {/* Cabecera Lote */}
            <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={18} /> Datos del Lote</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Costo Total Mercadería (Factura) S/</label>
                        <input type="number" step="0.01" name="costo_total_mercaderia" value={ingresoData.costo_total_mercaderia} onChange={handleIngresoChange} placeholder="0.00" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Costo Flete (Transporte) S/</label>
                        <input type="number" step="0.01" name="costo_flete" value={ingresoData.costo_flete} onChange={handleIngresoChange} placeholder="0.00" />
                    </div>
                </div>
            </div>

            {/* Formulario Agregar Item */}
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px dashed var(--accent-color)', marginBottom: '2rem' }}>
                <h4 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--accent-color)' }}>Añadir Producto Físico</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Descripción</label>
                        <input type="text" name="nombre_descripcion" value={currentItem.nombre_descripcion} onChange={handleItemChange} placeholder="Polo básico azul M" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Familia</label>
                        <select name="familia_id" value={currentItem.familia_id} onChange={handleItemChange}>
                            {familias.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Costo Base S/</label>
                        <input type="number" step="0.01" name="costo_unitario_base" value={currentItem.costo_unitario_base} onChange={handleItemChange} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>P. Venta Sugerido S/</label>
                        <input type="number" step="0.01" name="precio_venta_sugerido" value={currentItem.precio_venta_sugerido} onChange={handleItemChange} />
                    </div>
                    <button type="button" onClick={agregarProducto} className="btn btn-primary" style={{ padding: '0.75rem' }}>
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Lista de Items */}
            {productosLineas.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Productos en este ingreso ({productosLineas.length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {productosLineas.map((prod, idx) => (
                            <ProductoLinea key={idx} producto={prod} onDelete={() => eliminarProducto(idx)} familias={familias} />
                        ))}
                    </div>
                </div>
            )}

            {/* Guardar Todo */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <button onClick={guardarIngreso} className="btn btn-success" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }} disabled={productosLineas.length === 0}>
                    <Save size={20} /> Guardar Ingreso y Generar Códigos
                </button>
            </div>
        </div>
    );
}

// Subcomponente para renderizar la linea y su SVG en tiempo real
function ProductoLinea({ producto, onDelete, familias }) {
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, producto.codigo_barras, {
                format: "CODE128",
                lineColor: "#1e293b",
                width: 1.5,
                height: 40,
                displayValue: true,
                fontSize: 14,
                margin: 0
            });
        }
    }, [producto.codigo_barras]);

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Etiqueta</title>');
        printWindow.document.write('<style>body{text-align:center;margin:20px;font-family:sans-serif;} .title{font-size:12px;margin-bottom:5px;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<div class="title">' + producto.nombre_descripcion + ' - S/' + producto.precio_venta_sugerido + '</div>');
        printWindow.document.write('<img src="' + barcodeRef.current.src + '" />');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
    };

    const familiaNombre = familias.find(f => f.id === producto.familia_id)?.nombre || '';

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div>
                <strong style={{ display: 'block' }}>{producto.nombre_descripcion}</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{familiaNombre} • Costo Base: S/{producto.costo_unitario_base} • Flete Prorrateado: S/{producto.costo_unitario_flete}</span>
                <div style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--success-color)' }}>
                    P. Sugerido: S/ {producto.precio_venta_sugerido}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <svg ref={barcodeRef}></svg>
                    <button onClick={handlePrint} className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: '5px auto 0 auto' }}>
                        <Printer size={12} /> Imprimir
                    </button>
                </div>
                <button onClick={onDelete} className="btn" style={{ padding: '0.5rem', color: 'var(--danger-color)', border: '1px solid currentColor', background: 'transparent' }}>
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
