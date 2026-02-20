import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Save, Printer, RefreshCw } from 'lucide-react';
// import { supabase } from '../lib/supabase'; // Will be used for DB saving later

export function Ingresos() {
    const [formData, setFormData] = useState({
        nombre: '',
        caracteristicas: '',
        numero_mercaderia: '',
        costo_real: '',
        porcentaje_flete: 5,
        porcentaje_envio: 5,
        precio_venta_sugerido: ''
    });
    const [barcode, setBarcode] = useState('');
    const barcodeRef = useRef(null);

    // Auto-generate barcode when component mounts
    useEffect(() => {
        generateNewBarcode();
    }, []);

    // Update visual barcode whenever the 'barcode' state changes
    useEffect(() => {
        if (barcode && barcodeRef.current) {
            JsBarcode(barcodeRef.current, barcode, {
                format: "CODE128",
                lineColor: "#1e293b",
                width: 2,
                height: 80,
                displayValue: true
            });
        }
    }, [barcode]);

    // Calculate suggested price whenever costs change
    useEffect(() => {
        const costo = parseFloat(formData.costo_real) || 0;
        const fleteStr = parseFloat(formData.porcentaje_flete) || 0;
        const envioStr = parseFloat(formData.porcentaje_envio) || 0;

        if (costo > 0) {
            const margenRecomendado = 30; // 30% base ganancia
            const totalPorcentajes = fleteStr + envioStr + margenRecomendado;
            const precioSugerido = costo + (costo * (totalPorcentajes / 100));
            setFormData(prev => ({ ...prev, precio_venta_sugerido: precioSugerido.toFixed(2) }));
        }
    }, [formData.costo_real, formData.porcentaje_flete, formData.porcentaje_envio]);

    const generateNewBarcode = () => {
        // Generate a unique 12-digit number simulating EAN/UPC or unique ID
        const uniqueNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        setBarcode(uniqueNumber);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Imprimir Código de Barras</title>');
        printWindow.document.write('<style>body { text-align: center; margin-top: 50px; } img { max-width: 100%; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<img src="' + barcodeRef.current.src + '" />');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert('Función de guardado en la base de datos en construcción...');
        // Next step: save to Supabase
    };

    return (
        <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Registrar Nuevo Ingreso</h2>
                <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                    <svg ref={barcodeRef}></svg>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                        <button type="button" onClick={generateNewBarcode} className="btn" style={{ background: 'var(--surface-color)', padding: '0.5rem', fontSize: '0.8rem' }} title="Generar Otro"><RefreshCw size={16} /></button>
                        <button type="button" onClick={handlePrint} className="btn" style={{ background: 'var(--surface-color)', padding: '0.5rem', fontSize: '0.8rem' }} title="Imprimir"><Printer size={16} /></button>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre del Producto</label>
                    <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Zapatillas Nike Air" />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Características</label>
                    <textarea name="caracteristicas" value={formData.caracteristicas} onChange={handleChange} placeholder="Talla 42, Color blanco..." rows="2" />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Número de Mercadería (Lote/Guía)</label>
                    <input type="text" name="numero_mercaderia" value={formData.numero_mercaderia} onChange={handleChange} placeholder="Ej. L-00123" />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Costo Real (Compra) S/</label>
                    <input required type="number" step="0.01" name="costo_real" value={formData.costo_real} onChange={handleChange} placeholder="0.00" />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>% de Flete</label>
                    <input required type="number" step="0.1" name="porcentaje_flete" value={formData.porcentaje_flete} onChange={handleChange} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>% de Envío</label>
                    <input required type="number" step="0.1" name="porcentaje_envio" value={formData.porcentaje_envio} onChange={handleChange} />
                </div>

                <div style={{ gridColumn: '1 / -1', background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent-color)' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--accent-color)' }}>Precio de Venta Sugerido S/</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input type="number" step="0.01" name="precio_venta_sugerido" value={formData.precio_venta_sugerido} onChange={handleChange} style={{ background: 'white', fontSize: '1.2rem', fontWeight: 'bold' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>(Calculado con ~30% margen extra sobre costos)</span>
                    </div>
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>
                        <Save size={20} /> Guardar Ingreso con Código {barcode}
                    </button>
                </div>
            </form>
        </div>
    );
}
