import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

type Question = { text: string; options: string[]; correctIndex: number };

const emptyQuestion = (): Question => ({ text: '', options: ['', ''], correctIndex: 0 });

const AdminContests: React.FC = () => {
  useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(() => !!localStorage.getItem('adminToken'));
  const [adminError, setAdminError] = useState<string | null>(null);

  const adminLogin = async () => {
    try {
      setAdminError(null);
      const { token } = await apiService.adminLogin({ username: adminUsername, password: adminPassword });
      localStorage.setItem('adminToken', token);
      setAdminLoggedIn(true);
    } catch (e: any) {
      setAdminError(e?.message || 'Invalid credentials');
    }
  };

  const addQuestion = () => setQuestions(qs => [...qs, emptyQuestion()]);
  const removeQuestion = (idx: number) => setQuestions(qs => qs.filter((_, i) => i !== idx));

  const updateQuestion = (idx: number, patch: Partial<Question>) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, ...patch } : q));
  };

  const updateOption = (qi: number, oi: number, value: string) => {
    setQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const options = [...q.options];
      options[oi] = value;
      return { ...q, options };
    }));
  };

  const addOption = (qi: number) => setQuestions(qs => qs.map((q, i) => i === qi ? { ...q, options: [...q.options, ''] } : q));
  const removeOption = (qi: number, oi: number) => setQuestions(qs => qs.map((q, i) => i === qi ? { ...q, options: q.options.filter((_, j) => j !== oi) } : q));

  const submit = async () => {
    setMessage(null);
    if (!title || !startTime || !duration || questions.length === 0) {
      setMessage('Please fill all required fields');
      return;
    }
    if (!questions.every(q => q.text && q.options.length >= 2 && q.options.every(o => o))) {
      setMessage('Each question must have text and at least 2 non-empty options');
      return;
    }
    // Ensure admin session exists before attempting to create
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setMessage('Admin session missing. Please login as admin to create contests.');
      setAdminLoggedIn(false);
      return;
    }
    setSaving(true);
    try {
      await apiService.createContest({
        title,
        description,
        startTime: new Date(startTime).toISOString(),
        durationMinutes: duration,
        questions
      });
      setMessage('Contest created');
      setTitle(''); setDescription(''); setStartTime(''); setDuration(30); setQuestions([emptyQuestion()]);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401 || status === 403 || /admin token/i.test(e?.message || '')) {
        // Clear stale/invalid admin token and force re-login
        localStorage.removeItem('adminToken');
        setAdminLoggedIn(false);
        setMessage('Your admin session expired or is invalid. Please login again.');
      } else {
        setMessage(e?.message || 'Failed to create');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!adminLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8">
            <h1 className="text-3xl font-black text-white mb-6">Admin • Login</h1>
            {adminError && <div className="mb-4 p-3 bg-red-500/20 text-red-200 border border-red-500/40">{adminError}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Username</label>
                <input className="w-full p-3 bg-white/10 border border-white/20 text-white" value={adminUsername} onChange={e => setAdminUsername(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Password</label>
                <input type="password" className="w-full p-3 bg-white/10 border border-white/20 text-white" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
              </div>
              <button onClick={adminLogin} className="w-full px-5 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:from-cyan-400 hover:to-purple-500">Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8">
          <h1 className="text-3xl font-black text-white mb-6">Admin • Create Contest</h1>

          {message && (
            <div className="mb-4 p-3 bg-white/10 border border-white/20 text-white">{message}</div>
          )}

          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-300">You are logged in as admin.</div>
            <button onClick={() => { localStorage.removeItem('adminToken'); setAdminLoggedIn(false); }} className="px-3 py-2 bg-white/10 border border-white/20 text-white">Logout</button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Start Time</label>
              <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Duration (minutes)</label>
              <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value || '0', 10))} className="w-full p-3 bg-white/10 border border-white/20 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Description (optional)</label>
              <input value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white" />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl text-white font-bold">Questions</h2>
              <button onClick={addQuestion} className="px-3 py-2 bg-white/10 border border-white/20 text-white">Add Question</button>
            </div>
            <div className="space-y-6">
              {questions.map((q, qi) => (
                <div key={qi} className="p-4 bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-300 mb-2">Question {qi + 1}</label>
                      <textarea value={q.text} onChange={e => updateQuestion(qi, { text: e.target.value })} className="w-full p-3 bg-white/10 border border-white/20 text-white" />
                    </div>
                    <button onClick={() => removeQuestion(qi)} className="px-3 py-2 bg-red-500/20 border border-red-500/40 text-red-200">Remove</button>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-300">Options</div>
                      <button onClick={() => addOption(qi)} className="px-2 py-1 bg-white/10 border border-white/20 text-white text-sm">Add Option</button>
                    </div>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-3">
                          <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} className="flex-1 p-2 bg-white/10 border border-white/20 text-white" />
                          <label className="flex items-center gap-2 text-gray-200 text-sm">
                            <input type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi} onChange={() => updateQuestion(qi, { correctIndex: oi })} />
                            Correct
                          </label>
                          {q.options.length > 2 && (
                            <button onClick={() => removeOption(qi, oi)} className="px-2 py-1 bg-red-500/20 border border-red-500/40 text-red-200 text-sm">Remove</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <button onClick={submit} disabled={saving} className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50">
              {saving ? 'Saving...' : 'Create Contest'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContests;
