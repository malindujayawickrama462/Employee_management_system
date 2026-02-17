import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, UserCheck, AlertCircle, Plus, Eye, Edit2, Trash2, Star } from 'lucide-react';
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
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <div className="flex-1 ml-72 p-8 pt-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Performance Reviews
                        </h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">
                            Employee Appraisals & KPI Management
                        </p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        <Plus className="w-4 h-4" />
                        Add Review
                    </button>
                </div>

                {message.text && (
                    <div className={`mb-8 p-4 rounded-2xl animate-fade-in border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <UserCheck className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                            <span className="font-bold text-sm">{message.text}</span>
                        </div>
                    </div>
                )}

                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Period</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Rating</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Reviewer</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {performances.map((perf) => (
                                <tr key={perf._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-slate-900">{perf.employeeID}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-medium text-slate-500 uppercase tracking-widest">{perf.period}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${perf.overallRating >= 4 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                            perf.overallRating >= 3 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                                            }`}>
                                            <Star className="w-3 h-3 fill-current" /> {perf.overallRating} / 5
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-bold text-slate-700">{perf.reviewerID?.name}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(perf)}
                                                className="p-2 border border-slate-200 bg-white rounded-lg transition-all text-slate-400 hover:text-indigo-600 hover:border-indigo-100"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(perf._id)}
                                                className="p-2 border border-slate-200 bg-white rounded-lg transition-all text-slate-400 hover:text-rose-600 hover:border-rose-100"
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
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
                            <div className="px-10 py-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{editingReview ? 'Edit Review' : 'New Performance Review'}</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-600 transition-colors">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee ID</label>
                                        <select
                                            name="employeeID"
                                            value={formData.employeeID}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-sm"
                                        >
                                            <option value="">Select Employee</option>
                                            {employees.map(emp => (
                                                <option key={emp._id} value={emp.employeeID}>{emp.name} ({emp.employeeID})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Review Period</label>
                                        <input
                                            type="text"
                                            name="period"
                                            placeholder="e.g. Q1 2024"
                                            value={formData.period}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Key Performance Indicators</label>
                                    <div className="grid gap-4">
                                        {formData.kpis.map((kpi, index) => (
                                            <div key={index} className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <span className="flex-1 text-xs font-bold uppercase tracking-widest text-slate-600">{kpi.name}</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={kpi.score}
                                                    onChange={(e) => handleKPIChange(index, 'score', parseInt(e.target.value))}
                                                    className="w-48 accent-indigo-600"
                                                />
                                                <span className="w-12 text-center text-xs font-bold text-indigo-600">{kpi.score}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Overall Rating</label>
                                    <select
                                        name="overallRating"
                                        value={formData.overallRating}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-sm"
                                    >
                                        <option value="5">Excellent [5★]</option>
                                        <option value="4">Above Average [4★]</option>
                                        <option value="3">Satisfactory [3★]</option>
                                        <option value="2">Below Average [2★]</option>
                                        <option value="1">Unsatisfactory [1★]</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Internal Notes</label>
                                    <textarea
                                        name="appraisalRecord"
                                        value={formData.appraisalRecord}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-sm custom-scrollbar"
                                        placeholder="Detailed appraisal summary..."
                                    ></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee Feedback</label>
                                    <textarea
                                        name="feedback"
                                        value={formData.feedback}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-sm custom-scrollbar"
                                        placeholder="Feedback for the employee..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                >
                                    {loading ? 'Processing...' : editingReview ? 'Update Review' : 'Save Review'}
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
