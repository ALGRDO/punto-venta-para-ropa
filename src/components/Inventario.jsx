import React, { useState } from 'react';
import { Search, PackageOpen } from 'lucide-react';

export function Inventario() {
    // Mock data for now until Supabase is fully integrated
    const [productos, setProductos] = useState([
        { id: 1, codigo: '109238471923', nombre: 'Zapatillas Nike Air', stock: 15, precio_venta_sugerido: 250.00, estado: 'disponible' },
        { id: 2, codigo: '984712938471', nombre: 'Pantalón Jean Azul', stock: 8, precio_venta_sugerido: 120.00, estado: 'disponible' },
        { id: 3, codigo: '561234876123', nombre: 'Polo Deportivo Adidas', stock: 0, precio_venta_sugerido: 85.00, estado: 'agotado' },
    ]);

    const [search, setSearch] = useState('');

    const filtered = productos.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.codigo.includes(search)
    );

    return (
        <div className="glass" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Inventario Local</h2>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: '2.5rem', background: 'var(--surface-color)' }}
                    />
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Código Barras</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Producto</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Stock</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Precio Sugerido</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(prod => (
                            <tr key={prod.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', ':hover': { background: 'rgba(0,0,0,0.02)' } }}>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 600 }}>{prod.codigo}</td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{prod.nombre}</td>
                                <td style={{ padding: '1rem' }}>{prod.stock}</td>
                                <td style={{ padding: '1rem' }}>S/ {prod.precio_venta_sugerido.toFixed(2)}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        background: prod.estado === 'disponible' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: prod.estado === 'disponible' ? 'var(--success-color)' : 'var(--danger-color)'
                                    }}>
                                        {prod.estado}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <PackageOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                    <p>No se encontraron productos en el inventario.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
