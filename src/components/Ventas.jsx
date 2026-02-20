import React, { useState } from 'react';
import { ShoppingCart, Search, TrendingUp, Calendar } from 'lucide-react';

export function Ventas() {
    const [codigoBuscado, setCodigoBuscado] = useState('');
    const [productoVenta, setProductoVenta] = useState(null);
    const [precioVentaFinal, setPrecioVentaFinal] = useState('');

    // Mock DB search
    const handleBuscar = (e) => {
        e.preventDefault();
        if (!codigoBuscado) return;

        // Simulate finding product
        // Real implementation will query Supabase by barcode
        setProductoVenta({
            id: 1,
            codigo: codigoBuscado,
            nombre: 'Zapatillas Nike Air Simuladas',
            costo_real: 150.00,
            flete: 7.50, // 5%
            envio: 7.50, // 5%
            costo_total: 165.00,
            precio_venta_sugerido: 214.50,
            fecha_ingreso: '2026-02-15'
        });
        setPrecioVentaFinal('214.50');
    };

    const handleVenta = (e) => {
        e.preventDefault();
        alert('Venta registrada con éxito. Estado actualizado a vendido.');
        // Reset
        setProductoVenta(null);
        setCodigoBuscado('');
        setPrecioVentaFinal('');
    };

    return (
        <div className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--accent-color)', color: 'white', padding: '1rem', borderRadius: '12px' }}>
                    <ShoppingCart size={24} />
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>Punto de Venta</h2>
                    <span style={{ color: 'var(--text-secondary)' }}>Escanea el código de barras para dar salida</span>
                </div>
            </div>

            <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        autoFocus
                        placeholder="Escanea o ingresa el código de barras aquí..."
                        value={codigoBuscado}
                        onChange={(e) => setCodigoBuscado(e.target.value)}
                        style={{ paddingLeft: '2.5rem', background: 'var(--surface-color)', fontSize: '1.2rem', padding: '1rem 1rem 1rem 3rem' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Buscar</button>
            </form>

            {productoVenta && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>

                        <div>
                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{productoVenta.nombre}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontFamily: 'monospace' }}>CÓDIGO: {productoVenta.codigo}</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Costo Real original:</span>
                                    <strong>S/ {productoVenta.costo_real.toFixed(2)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Costos extra (Flete + Envío):</span>
                                    <strong>S/ {(productoVenta.flete + productoVenta.envio).toFixed(2)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem' }}>
                                    <span>Costo Base Total:</span>
                                    <strong>S/ {productoVenta.costo_total.toFixed(2)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                        <Calendar size={14} /> Fecha Ingreso:
                                    </span>
                                    <span>{productoVenta.fecha_ingreso}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
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

                                {precioVentaFinal && (
                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--success-color)', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--success-color)', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <TrendingUp size={16} /> Margen de Ganancia Neta
                                        </span>
                                        <strong style={{ fontSize: '1.5rem', color: 'var(--success-color)' }}>
                                            S/ {(parseFloat(precioVentaFinal) - productoVenta.costo_total).toFixed(2)}
                                        </strong>
                                    </div>
                                )}

                                <button type="submit" className="btn btn-success" style={{ width: '100%', fontSize: '1.1rem' }}>
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
