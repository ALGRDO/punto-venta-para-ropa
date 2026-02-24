import React, { useState } from 'react';
import { ShoppingCart, Search, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { getProductoByCodigo, registerVenta } from '../services/db';

export function Ventas() {
    const [codigoBuscado, setCodigoBuscado] = useState('');
    const [productoVenta, setProductoVenta] = useState(null);
    const [precioVentaFinal, setPrecioVentaFinal] = useState('');
    const [error, setError] = useState('');

    const handleBuscar = async (e) => {
        e.preventDefault();
        setError('');
        if (!codigoBuscado.trim()) return;

        try {
            const prod = await getProductoByCodigo(codigoBuscado.trim());
            console.log("Producto:", prod);

            if (!prod) {
                setError('Producto no encontrado con ese código.');
                setProductoVenta(null);
                return;
            }

            if (prod.estado !== 'disponible') {
                setError(`Este producto ya figura como "${prod.estado}".`);
                setProductoVenta(null);
                return;
            }

            setProductoVenta(prod);
            // Autocompletar con el precio sugerido
            setPrecioVentaFinal(prod.precio_venta_sugerido);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleVenta = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (!precioVentaFinal || parseFloat(precioVentaFinal) <= 0) {
                setError("Ingresa un precio de venta final válido.");
                return;
            }

            await registerVenta(productoVenta.codigo_barras, precioVentaFinal);

            alert('¡Venta registrada con éxito!');

            // Reset form for next sale
            setProductoVenta(null);
            setCodigoBuscado('');
            setPrecioVentaFinal('');
        } catch (err) {
            setError("Error al vender: " + err.message);
        }
    };

    return (
        <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--accent-color)', color: 'white', padding: '1rem', borderRadius: '12px' }}>
                    <ShoppingCart size={24} />
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>Punto de Venta</h2>
                    <span style={{ color: 'var(--text-secondary)' }}>Escanea el código de barras impreso para dar salida</span>
                </div>
            </div>

            <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        autoFocus
                        placeholder="Escanea o ingresa el código de barras 12 dígitos..."
                        value={codigoBuscado}
                        onChange={(e) => setCodigoBuscado(e.target.value)}
                        style={{ paddingLeft: '2.5rem', background: 'var(--surface-color)', fontSize: '1.2rem', padding: '1rem 1rem 1rem 3rem' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>Buscar</button>
            </form>

            {error && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            {productoVenta && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>

                        {/* Datos de Costos Internos */}
                        <div>
                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{productoVenta.nombre_descripcion}</h3>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.9rem' }}>CÓDIGO: {productoVenta.codigo_barras}</p>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Familia: {productoVenta.familia?.nombre || 'S/F'}</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Costo Base:</span>
                                    <strong>S/ {parseFloat(productoVenta.costo_unitario_base).toFixed(2)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Flete (Prorrateado):</span>
                                    <strong style={{ color: 'var(--text-secondary)' }}>S/ {parseFloat(productoVenta.costo_unitario_flete).toFixed(2)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>Costo Real Total:</span>
                                    <strong style={{ fontSize: '1.1rem' }}>S/ {parseFloat(productoVenta.costo_real_total).toFixed(2)}</strong>
                                </div>

                                {productoVenta.ingreso && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                            <Calendar size={14} /> Lote Ingreso #{productoVenta.ingreso.numero_ingreso}:
                                        </span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{new Date(productoVenta.ingreso.fecha_ingreso).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Caja de Registro de Venta */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
                            <form onSubmit={handleVenta}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Precio de Venta Final S/</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={precioVentaFinal}
                                    onChange={(e) => setPrecioVentaFinal(e.target.value)}
                                    style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'white', borderColor: 'var(--accent-color)', marginBottom: '1rem' }}
                                />

                                {precioVentaFinal && !isNaN(precioVentaFinal) && (
                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--success-color)', marginBottom: '1.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--success-color)', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <TrendingUp size={16} /> Margen Bruto de Ganancia
                                        </span>
                                        <strong style={{ fontSize: '1.5rem', color: 'var(--success-color)' }}>
                                            S/ {(parseFloat(precioVentaFinal) - parseFloat(productoVenta.costo_real_total)).toFixed(2)}
                                        </strong>
                                    </div>
                                )}

                                <button type="submit" className="btn btn-success" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
                                    Registrar Venta
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
