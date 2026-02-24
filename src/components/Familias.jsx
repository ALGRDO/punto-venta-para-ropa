import React, { useState, useEffect } from 'react';
import { Plus, Tag } from 'lucide-react';
import { getFamilias, createFamilia } from '../services/db';

export function Familias() {
    const [familias, setFamilias] = useState([]);
    const [nuevaFamilia, setNuevaFamilia] = useState('');

    useEffect(() => {
        cargarFamilias();
    }, []);

    const cargarFamilias = async () => {
        const data = await getFamilias();
        setFamilias(data);
    };

    const handleCrear = async (e) => {
        e.preventDefault();
        if (!nuevaFamilia.trim()) return;

        await createFamilia({ nombre: nuevaFamilia.trim() });
        setNuevaFamilia('');
        cargarFamilias();
    };

    return (
        <div className="glass" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--accent-color)', color: 'white', padding: '1rem', borderRadius: '12px' }}>
                    <Tag size={24} />
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>Familias de Productos</h2>
                    <span style={{ color: 'var(--text-secondary)' }}>Gestiona las categorías de tu inventario</span>
                </div>
            </div>

            <form onSubmit={handleCrear} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input
                    type="text"
                    value={nuevaFamilia}
                    onChange={(e) => setNuevaFamilia(e.target.value)}
                    placeholder="Ej. Polos, Pantalones, Accesorios..."
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--surface-color)' }}
                />
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Agregar
                </button>
            </form>

            <div style={{ background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Nombre de la Familia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {familias.length > 0 ? (
                            familias.map((familia) => (
                                <tr key={familia.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{familia.nombre}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No hay familias registradas aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
