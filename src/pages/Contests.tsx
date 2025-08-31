import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import { Clock, Trophy, CheckCircle2, XCircle, Users, ChevronRight, ChevronDown, Calendar, Timer, Target, Award, Zap } from 'lucide-react';

type ContestSummary = {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  durationMinutes: number;
};

type ContestDetail = ContestSummary & {
  questions: { text: string; options: string[]; correctIndex?: number }[];
};

const formatTimeLeft = (ms: number) => {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const Contests: React.FC = () => {
  const { currentUser } = useAuth();
  const [contests, setContests] = useState<ContestSummary[]>([]);
  const [participated, setParticipated] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ContestDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [review, setReview] = useState<{ submission: any; questions: any[] } | null>(null);
  const [entered, setEntered] = useState(false);
  const [now, setNow] = useState<number>(Date.now());
  const [openSection, setOpenSection] = useState<null | 'participated' | 'upcoming'>(null);

  // Realtime: refresh list when a contest is created
  useWebSocket({
    enabled: !!currentUser,
    onNotificationCreated: () => {},
    onContestCreated: async () => {
      try {
        const data = await apiService.listContests();
        setContests(data.contests || []);
      } catch {}
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const [allData, myData] = await Promise.all([
          apiService.listContests(),
          currentUser ? apiService.getMyParticipatedContests() : Promise.resolve({ contests: [] })
        ]);
        setContests(allData.contests || []);
        setParticipated(myData.contests || []);
        // Do not auto-select any contest; let the user choose.
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const selectContest = async (id: string) => {
    setActiveId(id);
    setLoading(true);
    setAnswers({});
    setSubmitted(false);
    setResults(null);
    setReview(null);
    setEntered(false);
    try {
      const data = await apiService.getContest(id);
      setDetail(data.contest);
      // If the user has participated and contest ended, ensure results/review are visible
      const participatedItem = (participated || []).find((p: any) => p._id === id);
      if (data.hasEnded) {
        // Load results
        try {
          const r = await apiService.getContestResults(id);
          setResults(r);
          if (currentUser) {
            try {
              const my = await apiService.getMyContestSubmission(id);
              setReview(my);
            } catch {}
          }
        } catch {}
      } else if (participatedItem && participatedItem.submission) {
        // Already submitted before end; show a note and prevent re-entry
        setEntered(false);
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timers
  const startMs = detail ? new Date(detail.startTime).getTime() : 0;
  const endMs = detail ? startMs + (detail.durationMinutes * 60000) : 0;
  const phase = useMemo(() => {
    if (!detail) return 'idle';
    if (now < startMs) return 'upcoming';
    if (now >= startMs && now <= endMs) return 'live';
    return 'ended';
  }, [detail, now, startMs, endMs]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // When contest ends, fetch results and review once
  useEffect(() => {
    const fetchResults = async () => {
      if (!activeId) return;
      try {
        const r = await apiService.getContestResults(activeId);
        setResults(r);
        if (currentUser) {
          try {
            const my = await apiService.getMyContestSubmission(activeId);
            setReview(my);
          } catch {}
        }
      } catch {}
    };
    if (phase === 'ended' && !results) {
      fetchResults();
    }
  }, [phase, activeId]);

  const timeLeft = phase === 'upcoming' ? startMs - now : phase === 'live' ? endMs - now : 0;

  const liveContests = useMemo(() => {
    const t = Date.now();
    return (contests || []).filter(c => {
      const s = new Date(c.startTime).getTime();
      const e = s + c.durationMinutes * 60000;
      return t >= s && t <= e;
    });
  }, [contests, now]);

  const upcomingContests = useMemo(() => {
    const t = Date.now();
    return (contests || [])
      .filter(c => new Date(c.startTime).getTime() > t)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [contests, now]);

  const handleSelect = (qIdx: number, optIdx: number) => {
    setAnswers(a => ({ ...a, [qIdx]: optIdx }));
  };

  const handleSubmit = async () => {
    if (!detail || !activeId) return;
    const payload = Object.entries(answers).map(([k, v]) => ({ questionIndex: Number(k), selectedIndex: Number(v) }));
    try {
      await apiService.submitContest(activeId, payload);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      alert((e as any)?.message || 'Failed to submit');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 tracking-tight">
            Contests
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Test your skills against the best. Compete, learn, and rise to the top.
          </p>
        </div>

        {/* Status Banners */}
        {!loading && !detail && (
          <div className="space-y-6 mb-12">
            {/* No contests */}
            {(!contests || contests.length === 0) && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 text-center">
                <Trophy className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-2xl font-bold text-white mb-2">No contests yet</h3>
                <p className="text-gray-300">Stay tuned for exciting challenges coming soon!</p>
              </div>
            )}
            
            {/* Live contests banner */}
            {(contests && contests.length > 0 && liveContests.length > 0) && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <h2 className="text-3xl font-black text-green-300">LIVE NOW</h2>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="grid gap-4">
                  {liveContests.map(c => {
                    const endTime = new Date(new Date(c.startTime).getTime() + c.durationMinutes * 60000);
                    const timeLeft = endTime.getTime() - now;
                    return (
                      <div key={c._id} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 hover:bg-white/15 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                            {c.description && <p className="text-gray-300 mb-3">{c.description}</p>}
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <div className="flex items-center">
                                <Timer className="mr-1" size={14} />
                                {c.durationMinutes} minutes
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1" size={14} />
                                {formatTimeLeft(timeLeft)} left
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => selectContest(c._id)} 
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-400 hover:to-emerald-500 transform hover:scale-105 transition-all duration-200 shadow-lg"
                          >
                            <Zap className="inline mr-2" size={16} />
                            JOIN NOW
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Upcoming banner */}
            {(contests && contests.length > 0 && liveContests.length === 0 && upcomingContests.length > 0) && (
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 p-8">
                <div className="text-center">
                  <Calendar className="mx-auto mb-4 text-blue-300" size={48} />
                  <h2 className="text-3xl font-black text-blue-300 mb-4">NEXT CONTEST</h2>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-2">{upcomingContests[0].title}</h3>
                    {upcomingContests[0].description && (
                      <p className="text-gray-300 mb-4">{upcomingContests[0].description}</p>
                    )}
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 mb-6">
                      <div className="flex items-center">
                        <Calendar className="mr-1" size={14} />
                        {new Date(upcomingContests[0].startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1" size={14} />
                        {new Date(upcomingContests[0].startTime).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center">
                        <Timer className="mr-1" size={14} />
                        {upcomingContests[0].durationMinutes} min
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-mono font-black text-cyan-400 mb-2">
                        {formatTimeLeft(new Date(upcomingContests[0].startTime).getTime() - now)}
                      </div>
                      <div className="text-sm text-gray-300">until contest begins</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contest Browser */}
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 sticky top-6">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Browse Contests</h3>
              </div>
              
              {/* Participated Section */}
              {currentUser && (
                <div className="border-b border-white/10">
                  <button
                    className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-white hover:bg-white/10 transition-all"
                    onClick={() => setOpenSection(prev => prev === 'participated' ? null : 'participated')}
                  >
                    <div className="flex items-center">
                      <Award className="mr-3 text-purple-400" size={18} />
                      <span>My Contests</span>
                      {participated.length > 0 && (
                        <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">
                          {participated.length}
                        </span>
                      )}
                    </div>
                    {openSection === 'participated' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {openSection === 'participated' && (
                    <div className="pb-4">
                      {(participated || []).map((c: any) => (
                        <button 
                          key={c._id} 
                          onClick={() => selectContest(c._id)} 
                          className={`w-full text-left px-6 py-3 hover:bg-white/10 transition-all border-l-2 ${
                            activeId === c._id 
                              ? 'bg-white/15 border-l-purple-400' 
                              : 'border-l-transparent hover:border-l-purple-400/50'
                          }`}
                        >
                          <div className="font-medium text-gray-100 truncate">{c.title}</div>
                          {c.description && (
                            <div className="text-xs text-gray-400 mt-1 truncate">{c.description}</div>
                          )}
                          {c.submission && (
                            <div className="text-xs text-purple-300 mt-1">
                              Score: {c.submission.score}/{c.submission.total}
                            </div>
                          )}
                        </button>
                      ))}
                      {(!participated || !participated.length) && (
                        <div className="px-6 py-4 text-sm text-gray-400 text-center">
                          No contests participated yet
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* All Contests Section */}
              <div>
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-white hover:bg-white/10 transition-all"
                  onClick={() => setOpenSection(prev => prev === 'upcoming' ? null : 'upcoming')}
                >
                  <div className="flex items-center">
                    <Target className="mr-3 text-cyan-400" size={18} />
                    <span>All Contests</span>
                    {contests.length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full">
                        {contests.length}
                      </span>
                    )}
                  </div>
                  {openSection === 'upcoming' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {openSection === 'upcoming' && (
                  <div className="pb-4">
                    {(contests || []).map(c => {
                      const s = new Date(c.startTime).getTime();
                      const e = s + c.durationMinutes * 60000;
                      const n = Date.now();
                      const status = n < s ? 'upcoming' : (n <= e ? 'live' : 'ended');
                      
                      return (
                        <button 
                          key={c._id} 
                          onClick={() => selectContest(c._id)} 
                          className={`w-full text-left px-6 py-3 hover:bg-white/10 transition-all border-l-2 ${
                            activeId === c._id 
                              ? 'bg-white/15 border-l-cyan-400' 
                              : 'border-l-transparent hover:border-l-cyan-400/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-100 truncate">{c.title}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date(c.startTime).toLocaleDateString()} • {c.durationMinutes}m
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 font-medium rounded-full ${
                              status === 'live' 
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                : status === 'upcoming' 
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            }`}>
                              {status === 'live' ? 'LIVE' : status === 'upcoming' ? 'SOON' : 'ENDED'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                    {(!contests || !contests.length) && (
                      <div className="px-6 py-4 text-sm text-gray-400 text-center">
                        No contests available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-12 text-center">
                <div className="animate-spin mx-auto mb-4 w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full"></div>
                <p className="text-white font-medium">Loading contest data...</p>
              </div>
            )}

            {!loading && !detail && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-12 text-center">
                <Trophy className="mx-auto mb-6 text-gray-400" size={64} />
                <h2 className="text-3xl font-bold text-white mb-4">Select a Contest</h2>
                <p className="text-gray-300 text-lg">
                  Choose from the contests in the sidebar to view details, participate, or review your results.
                </p>
              </div>
            )}

            {!loading && detail && (
              <div className="space-y-8">
                {/* Contest Header Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h1 className="text-3xl font-black text-white mb-3">{detail.title}</h1>
                        {detail.description && (
                          <p className="text-gray-300 text-lg leading-relaxed">{detail.description}</p>
                        )}
                      </div>
                      <div className="ml-6 text-right">
                        <div className="flex items-center justify-end mb-2">
                          <Clock className="mr-2 text-cyan-400" size={20} />
                          <span className="text-2xl font-mono font-black text-cyan-400">
                            {formatTimeLeft(timeLeft)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-300">
                          {phase === 'upcoming' ? 'until start' : phase === 'live' ? 'remaining' : 'ended'}
                        </div>
                      </div>
                    </div>

                    {/* Contest Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
                        <Calendar className="mx-auto mb-2 text-blue-400" size={24} />
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Start Date</div>
                        <div className="text-sm font-semibold text-white mt-1">
                          {new Date(detail.startTime).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
                        <Clock className="mx-auto mb-2 text-green-400" size={24} />
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Start Time</div>
                        <div className="text-sm font-semibold text-white mt-1">
                          {new Date(detail.startTime).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
                        <Timer className="mx-auto mb-2 text-purple-400" size={24} />
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Duration</div>
                        <div className="text-sm font-semibold text-white mt-1">
                          {detail.durationMinutes} mins
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
                        <Target className="mx-auto mb-2 text-pink-400" size={24} />
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Questions</div>
                        <div className="text-sm font-semibold text-white mt-1">
                          {detail.questions?.length || 0}
                        </div>
                      </div>
                    </div>

                    {/* Phase-specific Action */}
                    <div className="mt-8">
                      {phase === 'upcoming' && (
                        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md border border-blue-400/30 p-6 text-center">
                          <h3 className="text-xl font-bold text-blue-300 mb-2">Contest Starts Soon</h3>
                          <p className="text-gray-300 mb-4">Get ready! The contest will begin automatically at the scheduled time.</p>
                          <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            <Clock className="mr-2" size={16} />
                            Waiting for contest to start
                          </div>
                        </div>
                      )}

                      {phase === 'live' && !entered && currentUser && (
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-400/30 p-6 text-center">
                          <h3 className="text-xl font-bold text-green-300 mb-2">Contest is Live!</h3>
                          <p className="text-gray-300 mb-4">Ready to test your skills? Click enter to begin the contest.</p>
                          <button 
                            onClick={() => setEntered(true)} 
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:from-green-400 hover:to-emerald-500 transform hover:scale-105 transition-all duration-200 shadow-lg"
                          >
                            <Zap className="inline mr-2" size={20} />
                            ENTER CONTEST
                          </button>
                        </div>
                      )}

                      {phase === 'ended' && !currentUser && (
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 text-center">
                          <h3 className="text-xl font-bold text-white mb-2">Contest Ended</h3>
                          <p className="text-gray-300">This contest has finished. Please sign in to view results and participate in future contests.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              {/* Live / Upcoming / Ended Views */}
              {phase === 'upcoming' && (
                <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-none">
                  <p className="text-white">Contest hasn’t started. The questions will unlock when it goes live.</p>
                </div>
              )}

              {phase === 'live' && !entered && (
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto mb-6 flex items-center justify-center">
                    <Zap className="text-white" size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-green-300 mb-4">Contest is Live!</h2>
                  <p className="text-gray-300 text-lg mb-6">
                    Ready to test your skills? Click enter to begin the contest.
                  </p>
                  <div className="flex items-center justify-center space-x-8 mb-8">
                    <div className="text-center">
                      <Timer className="mx-auto mb-2 text-green-400" size={24} />
                      <div className="text-sm text-gray-400">Duration</div>
                      <div className="font-semibold text-white">{detail.durationMinutes} min</div>
                    </div>
                    <div className="text-center">
                      <Target className="mx-auto mb-2 text-green-400" size={24} />
                      <div className="text-sm text-gray-400">Questions</div>
                      <div className="font-semibold text-white">{detail.questions?.length || 0}</div>
                    </div>
                    <div className="text-center">
                      <Clock className="mx-auto mb-2 text-green-400" size={24} />
                      <div className="text-sm text-gray-400">Time Left</div>
                      <div className="font-semibold text-white">{formatTimeLeft(timeLeft)}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEntered(true)} 
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg hover:from-green-400 hover:to-emerald-500 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    <Zap className="inline mr-2" size={20} />
                    ENTER CONTEST
                  </button>
                </div>
              )}

              {phase === 'live' && entered && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20">
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border-b border-orange-400/30 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse mr-3"></div>
                        <h2 className="text-2xl font-black text-orange-300">Contest In Progress</h2>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-300">Time Remaining</div>
                          <div className="text-xl font-mono font-black text-orange-400">
                            {formatTimeLeft(timeLeft)}
                          </div>
                        </div>
                        <button 
                          onClick={handleSubmit} 
                          disabled={submitted || Object.keys(answers).length !== (detail.questions?.length || 0)}
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:from-orange-400 hover:to-red-500 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Award className="inline mr-2" size={16} />
                          SUBMIT
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="space-y-8">
                      {(detail.questions || []).map((q, qIdx) => (
                        <div key={qIdx} className="bg-white/5 backdrop-blur-md border border-white/10 p-6">
                          <div className="flex items-start mb-6">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-lg flex items-center justify-center mr-4">
                              {qIdx + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white leading-relaxed">{q.text}</h3>
                            </div>
                          </div>
                          
                          <div className="grid gap-3 ml-14">
                            {(q.options || []).map((opt, optIdx) => (
                              <button
                                key={optIdx}
                                onClick={() => handleSelect(qIdx, optIdx)}
                                className={`text-left p-4 border transition-all duration-200 hover:bg-white/10 ${
                                  answers[qIdx] === optIdx
                                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/50 text-white'
                                    : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/30'
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 border-2 mr-3 flex-shrink-0 rounded-full ${
                                    answers[qIdx] === optIdx 
                                      ? 'border-cyan-400 bg-cyan-400' 
                                      : 'border-gray-400'
                                  }`}>
                                    {answers[qIdx] === optIdx && (
                                      <div className="w-full h-full bg-cyan-400 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                      </div>
                                    )}
                                  </div>
                                  <span className="font-medium">{opt}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Submitted State */}
              {phase === 'live' && submitted && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto mb-6 flex items-center justify-center">
                    <CheckCircle2 className="text-white" size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-4">Submission Complete!</h2>
                  <p className="text-gray-300 text-lg mb-6">
                    Your answers have been recorded. Results will be available when the contest ends.
                  </p>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 inline-block">
                    <div className="text-sm text-gray-400">Contest ends in</div>
                    <div className="text-xl font-mono font-black text-cyan-400">
                      {formatTimeLeft(timeLeft)}
                    </div>
                  </div>
                </div>
              )}

              {phase === 'ended' && (
                <div className="space-y-8">
                  {results ? (
                    <>
                      {/* Personal Results Card */}
                      {results.my && (
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 p-8">
                          <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-purple-300 mb-4">Your Performance</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 text-center">
                                <Award className="mx-auto mb-3 text-yellow-400" size={32} />
                                <div className="text-3xl font-black text-white">{results.my.score}</div>
                                <div className="text-sm text-gray-300 uppercase tracking-wide">Score</div>
                              </div>
                              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 text-center">
                                <Target className="mx-auto mb-3 text-green-400" size={32} />
                                <div className="text-3xl font-black text-white">{Math.round(results.my.percentage)}%</div>
                                <div className="text-sm text-gray-300 uppercase tracking-wide">Accuracy</div>
                              </div>
                              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 text-center">
                                <Trophy className="mx-auto mb-3 text-cyan-400" size={32} />
                                <div className="text-3xl font-black text-white">{results.betterThanPercent}%</div>
                                <div className="text-sm text-gray-300 uppercase tracking-wide">Better Than</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Leaderboard Card */}
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20">
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border-b border-yellow-400/30 p-6">
                          <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-yellow-300 flex items-center">
                              <Trophy className="mr-3" size={28} />
                              Leaderboard
                            </h2>
                            <div className="text-sm text-gray-300">
                              {results.totalParticipants} participants
                            </div>
                          </div>
                        </div>
                        <div className="p-8">
                          <div className="space-y-4">
                            {(results.leaderboard || []).slice(0, 10).map((r: any, index: number) => (
                              <div 
                                key={r.rank} 
                                className={`flex items-center p-4 border border-white/20 hover:bg-white/10 transition-all ${
                                  index < 3 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-400/30' : 'bg-white/5'
                                }`}
                              >
                                <div className="flex items-center flex-1">
                                  <div className={`w-12 h-12 flex items-center justify-center font-black text-lg mr-4 ${
                                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900' :
                                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900' :
                                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-orange-900' :
                                    'bg-white/20 text-white'
                                  }`}>
                                    {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${r.rank}`}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-bold text-white text-lg">{r.user?.displayName || 'Anonymous User'}</div>
                                    <div className="text-sm text-gray-400">Rank #{r.rank}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-mono font-black text-cyan-400">{r.score}/{r.total}</div>
                                  <div className="text-sm text-gray-300">{Math.round(r.percentage)}% accuracy</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {results.leaderboard && results.leaderboard.length > 10 && (
                            <div className="mt-6 text-center">
                              <div className="text-sm text-gray-400">
                                Showing top 10 of {results.leaderboard.length} participants
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-12 text-center">
                      <Trophy className="mx-auto mb-6 text-gray-400" size={64} />
                      <h2 className="text-2xl font-bold text-white mb-4">Results Loading</h2>
                      <p className="text-gray-300">Contest results will appear here when available.</p>
                    </div>
                  )}

                  {review && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20">
                      <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-md border-b border-blue-400/30 p-6">
                        <h2 className="text-2xl font-black text-blue-300 flex items-center">
                          <Users className="mr-3" size={28} />
                          Answer Review
                        </h2>
                      </div>
                      <div className="p-8">
                        <div className="space-y-6">
                          {review.questions.map((q, qi) => {
                            const sel = review.submission.answers.find((a: any) => a.questionIndex === qi)?.selectedIndex;
                            const correct = q.correctIndex;
                            const isCorrectAnswer = sel === correct;
                            
                            return (
                              <div key={qi} className="bg-white/5 backdrop-blur-md border border-white/10 p-6">
                                <div className="flex items-start mb-6">
                                  <div className={`flex-shrink-0 w-10 h-10 font-black text-lg flex items-center justify-center mr-4 ${
                                    isCorrectAnswer 
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                                      : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                                  }`}>
                                    {qi + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white leading-relaxed">{q.text}</h3>
                                    <div className="flex items-center mt-2 space-x-4">
                                      <div className={`flex items-center text-sm ${
                                        isCorrectAnswer ? 'text-green-400' : 'text-red-400'
                                      }`}>
                                        {isCorrectAnswer ? (
                                          <><CheckCircle2 className="mr-1" size={16} /> Correct</>
                                        ) : (
                                          <><XCircle className="mr-1" size={16} /> Incorrect</>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid gap-3 ml-14">
                                  {q.options.map((opt: string, oi: number) => {
                                    const isCorrect = oi === correct;
                                    const isSelected = oi === sel;
                                    
                                    return (
                                      <div 
                                        key={oi} 
                                        className={`p-4 border transition-all ${
                                          isCorrect 
                                            ? 'border-green-500/50 bg-gradient-to-r from-green-500/20 to-emerald-500/20' 
                                            : isSelected 
                                            ? 'border-red-500/50 bg-gradient-to-r from-red-500/20 to-pink-500/20' 
                                            : 'border-white/10 bg-white/5'
                                        }`}
                                      >
                                        <div className="flex items-center">
                                          <div className="mr-3">
                                            {isCorrect ? (
                                              <CheckCircle2 className="text-green-400" size={20} />
                                            ) : isSelected ? (
                                              <XCircle className="text-red-400" size={20} />
                                            ) : (
                                              <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                                            )}
                                          </div>
                                          <span className={`font-medium ${
                                            isCorrect ? 'text-green-100' : isSelected ? 'text-red-100' : 'text-gray-300'
                                          }`}>
                                            {opt}
                                          </span>
                                          {isCorrect && (
                                            <span className="ml-auto text-xs text-green-400 font-semibold">CORRECT</span>
                                          )}
                                          {isSelected && !isCorrect && (
                                            <span className="ml-auto text-xs text-red-400 font-semibold">YOUR ANSWER</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contests;
