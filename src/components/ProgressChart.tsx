import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "../lib/supabaseClient";

interface ProgressData {
    date: string;
    volume: number; // Sets * Reps * Weight
}

export const ProgressChart = ({ userId }: { userId: string }) => {
    const [data, setData] = useState<ProgressData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchProgress = async () => {
            // Fetch completed sets
            const { data: sets, error } = await supabase
                .from('workout_logs')
                .select('*')
                .eq('user_id', userId)
                .order('completed_at', { ascending: true });

            if (error) {
                console.error("Error fetching progress:", error);
                setLoading(false);
                return;
            }

            // Aggregate volume per day/week
            const volumeByDate: Record<string, number> = {};

            sets?.forEach(log => {
                if (!log.completed_at || !log.weight || !log.reps) return;
                const date = new Date(log.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                // Volume Load = Weight * Reps
                const vol = (log.weight * log.reps);
                volumeByDate[date] = (volumeByDate[date] || 0) + vol;
            });

            const chartData = Object.entries(volumeByDate).map(([date, volume]) => ({
                date,
                volume: Math.round(volume)
            }));

            // If less than 2 data points, add a dummy start point for nicer visual
            if (chartData.length === 0) {
                // No data handling
            }

            setData(chartData);
            setLoading(false);
        };

        fetchProgress();
    }, [userId]);

    if (loading) return <div className="h-48 flex items-center justify-center text-muted-foreground">Loading chart...</div>;
    if (data.length === 0) {
        return (
            <div className="w-full h-[300px] bg-slate-900/50 rounded-xl p-8 border border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="bg-blue-500/10 p-4 rounded-full mb-4">
                    <span className="text-4xl">📉</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Data Yet</h3>
                <p className="text-gray-400 max-w-sm">
                    Complete your first workout and log some weights to see your progress chart here!
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px] bg-slate-900/50 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Volume Progression</h3>
                <span className="text-xs text-gray-400">Total Volume Load (lbs/kg)</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => [`${value.toLocaleString()}`, "Volume"]}
                    />
                    <Area
                        type="monotone"
                        dataKey="volume"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorVolume)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
