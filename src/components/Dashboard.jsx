import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, DollarSign, Activity } from 'lucide-react';
import { getProductos, getVentas } from '../services/db';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function Dashboard() {
    const [stats, setStats] = useState({
        ventasTotales: 0,
        gananciaNeta: 0,
        productosVendidos: 0,
        productosDisponibles: 0,
        valorInventario: 0
    });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        const productos = await getProductos();
        const ventas = await getVentas();

        let ventasTotales = 0;
        let gananciaNeta = 0;

        ventas.forEach(v => {
            ventasTotales += parseFloat(v.precio_venta_final) || 0;
            gananciaNeta += parseFloat(v.margen_ganancia) || 0;
        });

        const disponibles = productos.filter(p => p.estado === 'disponible');
        let valorInventario = 0;
        disponibles.forEach(p => {
            valorInventario += parseFloat(p.costo_real_total) || 0;
        });

        setStats({
            ventasTotales,
            gananciaNeta,
            productosVendidos: ventas.length,
            productosDisponibles: disponibles.length,
            valorInventario
        });

        const salesByDate = {};
        ventas.forEach(v => {
            if (!v.fecha_venta) return;
            const dateStr = new Date(v.fecha_venta).toLocaleDateString();
            if (!salesByDate[dateStr]) {
                salesByDate[dateStr] = 0;
            }
            salesByDate[dateStr] += parseFloat(v.precio_venta_final) || 0;
        });

        const dataArray = Object.keys(salesByDate).map(date => ({
            name: date,
            Ventas: salesByDate[date]
        }));
        
        dataArray.sort((a, b) => {
            const dateA = a.name.split('/').reverse().join('-'); 
            const dateB = b.name.split('/').reverse().join('-'); 
            // Simple generic sort (depends on locale, but functional enough for simple visualization)
            return new Date(dateA) - new Date(dateB) || a.name.localeCompare(b.name);
        });

        setChartData(dataArray);
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>Panel de Control (Dashboard)</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>

                <StatCard
                    title="Ingresos por Ventas"
                    value={`S/ ${stats.ventasTotales.toFixed(2)}`}
                    icon={<DollarSign size={24} />}
                    color="var(--accent-color)"
                />

                <StatCard
                    title="Ganancia Neta (Utilidad)"
                    value={`S/ ${stats.gananciaNeta.toFixed(2)}`}
                    icon={<TrendingUp size={24} />}
                    color="var(--success-color)"
                    bg="rgba(16, 185, 129, 0.1)"
                />

                <StatCard
                    title="Productos Vendidos"
                    value={stats.productosVendidos}
                    icon={<Activity size={24} />}
                    color="#f59e0b"
                />

                <StatCard
                    title="Stock Disponible"
                    value={stats.productosDisponibles}
                    icon={<Package size={24} />}
                    color="#8b5cf6"
                    subtitle={`Valorizado en: S/ ${stats.valorInventario.toFixed(2)}`}
                />

            </div>

            {/* Gráficos de Rendimiento */}
            <div className="glass" style={{ padding: '2rem', marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Evolución de Ventas</h3>
                {chartData.length > 0 ? (
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.1} />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    itemStyle={{ color: 'var(--accent-color)' }}
                                />
                                <Bar dataKey="Ventas" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        <p>No hay datos de ventas para mostrar gráficos.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, bg, subtitle }) {
    return (
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: bg || 'var(--card-bg)' }}>
            <div style={{ background: color, color: 'white', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</p>
                <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-primary)' }}>{value}</h3>
                {subtitle && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{subtitle}</p>}
            </div>
        </div>
    );
}
