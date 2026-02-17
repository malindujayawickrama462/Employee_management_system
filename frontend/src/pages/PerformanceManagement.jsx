import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, UserCheck, AlertCircle, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { getAllPerformances, deletePerformance, addPerformance, updatePerformance } from '../utils/performanceApi';
import { getAllEmployees } from '../utils/employeeApi';
import AdminSidebar from '../components/AdminSidebar';

const PerformanceManagement = () => {
    const { user } = useAuth();
    const [performances, setPerformances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showModal, setShowModal] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [formData, setFormData] = useState({
        employeeID: '',
        period: '',
        appraisalRecord: '',
        feedback: '',
        overallRating: 5,
        kpis: [
            { name: 'Productivity', score: 80, target: 100 },
            { name: 'Quality of Work', score: 80, target: 100 },
            { name: 'Attendance', score: 90, target: 100 }
        ]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [perfData, empData] = await Promise.all([
                getAllPerformances(),
                getAllEmployees()
            ]);
            setPerformances(perfData.data || []);
            setEmployees(empData || []);
        } catch (error) {
            showMessage('error', 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleKPIChange = (index, field, value) => {
        const updatedKPIs = [...formData.kpis];
        updatedKPIs[index][field] = value;
        setFormData(prev => ({ ...prev, kpis: updatedKPIs }));
    };

    const resetForm = () => {
        setEditingReview(null);
        setFormData({
            employeeID: '',
            period: '',
            appraisalRecord: '',
            feedback: '',
            overallRating: 5,
            kpis: [
                { name: 'Productivity', score: 80, target: 100 },
                { name: 'Quality of Work', score: 80, target: 100 },
                { name: 'Attendance', score: 90, target: 100 }
            ]
        });
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setFormData({
            employeeID: review.employeeID,
            period: review.period,
            appraisalRecord: review.appraisalRecord,
            feedback: review.feedback,
            overallRating: review.overallRating,
            kpis: review.kpis.map(kpi => ({ ...kpi }))
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingReview) {
                await updatePerformance(editingReview._id, formData);
                showMessage('success', 'Performance review updated successfully');
            } else {
                await addPerformance(formData);
                showMessage('success', 'Performance review added successfully');
            }
            setShowModal(false);
            fetchData();
            resetForm();
        } catch (error) {
            showMessage('error', editingReview ? 'Failed to update review' : 'Failed to add review');
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await deletePerformance(id);
            showMessage('success', 'Review deleted successfully');
            fetchData();
        } catch (error) {
            showMessage('error', 'Failed to delete review');
        }
    };

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 ml-72 p-8 pt-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                            Performance <span className="text-indigo-600">Analytics</span>
                        </h1>
                        <p className="text-gray-500 font-bold tracking-widest text-[10px] uppercase mt-2">
                            Strategy • Assessment • KPI Optimization
                        </p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                    >
                        <Plus className="w-4 h-4" />
                        Initiate Assessment
                    </button>
                </div>

                {message.text && (
                    <div className={`mb-8 p-5 rounded-3xl shadow-xl animate-fade-in glass border-l-8 ${message.type === 'success' ? 'border-green-500 text-green-800' : 'border-red-500 text-red-800'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <UserCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span className="font-bold uppercase tracking-widest text-[10px]">{message.text}</span>
                        </div>
                    </div>
                )}

                <div className="glass rounded-[3rem] shadow-2xl overflow-hidden border border-white/50">
                    <table className="w-full text-left">
                        <thead className="bg-indigo-50/50 border-b border-indigo-100">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-indigo-900">Employee</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-indigo-900">Period</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-indigo-900">Rating</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-indigo-900">Reviewer</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-indigo-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {performances.map((perf) => (
                                <tr key={perf._id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-black text-gray-900">{perf.employeeID}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{perf.period}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${perf.overallRating >= 4 ? 'bg-green-100 text-green-700' :
                                            perf.overallRating >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            ★ {perf.overallRating} / 5
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-bold text-gray-800">{perf.reviewerID?.name}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(perf)}
                                                className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-indigo-600"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(perf._id)}
                                                className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Performance Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border border-white/50">
                            <div className="px-10 py-8 border-b border-indigo-50 bg-indigo-50/30 flex justify-between items-center">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">{editingReview ? 'Modify' : 'Assessment'} <span className="text-indigo-600">Protocol</span></h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-indigo-600 transition-colors uppercase font-black text-[10px] tracking-widest">Terminate [X]</button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900">Target Personnel</label>
                                        <select
                                            name="employeeID"
                                            value={formData.employeeID}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-indigo-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-sm"
                                        >
                                            <option value="">Select Employee</option>
                                            {employees.map(emp => (
                                                <option key={emp._id} value={emp.employeeID}>{emp.name} ({emp.employeeID})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900">Review Period</label>
                                        <input
                                            type="text"
                                            name="period"
                                            placeholder="e.g. Q1 2024"
                                            value={formData.period}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-indigo-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900">Key Performance Indicators (KPIs)</label>
                                    <div className="grid gap-4">
                                        {formData.kpis.map((kpi, index) => (
                                            <div key={index} className="flex items-center gap-6 p-4 bg-indigo-50/20 rounded-2xl border border-indigo-50">
                                                <span className="flex-1 text-xs font-black uppercase tracking-widest text-indigo-800">{kpi.name}</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={kpi.score}
                                                    onChange={(e) => handleKPIChange(index, 'score', parseInt(e.target.value))}
                                                    className="w-48 accent-indigo-600"
                                                />
                                                <span className="w-12 text-center text-xs font-black text-indigo-600">{kpi.score}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900">Overall Assessment Rating</label>
                                        <select
                                            name="overallRating"
                                            value={formData.overallRating}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 bg-gray-50 border border-indigo-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-sm"
                                        >
                                            <option value="5">Excellent [5★]</option>
                                            <option value="4">Above Average [4★]</option>
                                            <option value="3">Satisfactory [3★]</option>
                                            <option value="2">Below Average [2★]</option>
                                            <option value="1">Unsatisfactory [1★]</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900">Appraisal Record [Internal]</label>
                                    <textarea
                                        name="appraisalRecord"
                                        value={formData.appraisalRecord}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-5 py-4 bg-gray-50 border border-indigo-50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-sm custom-scrollbar"
                                        placeholder="Detailed performance summary..."
                                    ></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900">Employee Feedback [Public]</label>
                                    <textarea
                                        name="feedback"
                                        value={formData.feedback}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-5 py-4 bg-gray-50 border border-indigo-50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-sm custom-scrollbar"
                                        placeholder="Constructive feedback for the employee..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
                                >
                                    {loading ? 'Processing Protocol...' : editingReview ? 'Update Assessment Protocol' : 'Finalize Assessment Protocol'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerformanceManagement;
