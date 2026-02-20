import React, { useState } from 'react';
import { Search, PackageOpen, Edit, X, Save } from 'lucide-react';

export function Inventario() {
    // Mock data for now until Supabase is fully integrated
    const [productos, setProductos] = useState([
        { id: 1, codigo: '109238471923', nombre: 'Zapatillas Nike Air', stock: 15, precio_venta_sugerido: 250.00, estado: 'disponible' },
        { id: 2, codigo: '984712938471', nombre: 'Pantalón Jean Azul', stock: 8, precio_venta_sugerido: 120.00, estado: 'disponible' },
        { id: 3, codigo: '561234876123', nombre: 'Polo Deportivo Adidas', stock: 0, precio_venta_sugerido: 85.00, estado: 'agotado' },
    ]);

    const [search, setSearch] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    const filtered = productos.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.codigo.includes(search)
    );

    const handleEditClick = (product) => {
        setEditingProduct({ ...product });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct(prev => ({
            ...prev,
            [name]: name === 'stock' || name.startsWith('precio') ? parseFloat(value) : value
        }));
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        setProductos(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
        setEditingProduct(null);
    };

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
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Acciones</th>
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
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => handleEditClick(prod)}
                                        className="btn"
                                        style={{ padding: '0.5rem', background: 'var(--surface-color)', color: 'var(--accent-color)', border: '1px solid var(--glass-border)' }}
                                        title="Editar Producto"
                                    >
                                        <Edit size={16} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <PackageOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                    <p>No se encontraron productos en el inventario.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edición */}
            {editingProduct && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem', animation: 'fadeIn 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Editar Producto</h3>
                            <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre</label>
                                <input type="text" name="nombre" required value={editingProduct.nombre} onChange={handleEditChange} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Stock Disponible</label>
                                <input type="number" name="stock" required value={editingProduct.stock} onChange={handleEditChange} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Precio Sugerido S/</label>
                                <input type="number" step="0.01" name="precio_venta_sugerido" required value={editingProduct.precio_venta_sugerido} onChange={handleEditChange} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Estado</label>
                                <select name="estado" value={editingProduct.estado} onChange={handleEditChange}>
                                    <option value="disponible">Disponible</option>
                                    <option value="agotado">Agotado</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                <Save size={18} /> Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
