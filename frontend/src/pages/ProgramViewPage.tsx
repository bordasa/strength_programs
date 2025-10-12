import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { programsAPI } from '../services/api';
import { Program } from '../types';
import { assignReps, formatRepScheme } from '../utils/repLadder';
import { downloadMarkdown } from '../utils/exportMarkdown';
import { LIFT_LABELS } from './CreateProgramPage';

// Helper function to get display name for a lift
function getLiftDisplayName(liftKey: string, customNames?: Record<string, string>): string {
  // First check if there's a custom name
  if (customNames && customNames[liftKey]) {
    return customNames[liftKey];
  }
  // Fall back to default label or formatted key
  return LIFT_LABELS[liftKey] || liftKey.replace(/_/g, ' ');
}

export default function ProgramViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedSession, setSelectedSession] = useState<string>('1');
  const [viewMode, setViewMode] = useState<'overview' | 'weekly' | 'daily'>('daily');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [programName, setProgramName] = useState('');
  const [saving, setSaving] = useState(false);
  const [rerolling, setRerolling] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (id) {
      programsAPI.get(id)
        .then((prog) => {
          setProgram(prog);
          setProgramName(prog.name || '');
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSaveAndFinalize = async () => {
    if (!id || !programName.trim()) return;
    
    setSaving(true);
    try {
      const updated = await programsAPI.update(id, {
        name: programName,
        status: 'active'
      });
      setProgram(updated);
      setShowSaveModal(false);
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Failed to save program');
    } finally {
      setSaving(false);
    }
  };

  const handleRerollWeek = async (lift?: string) => {
    if (!id || rerolling) return;
    
    const message = lift 
      ? `Are you sure you want to reroll the dice for ${getLiftDisplayName(lift, program?.config?.lift_names)} in Week ${selectedWeek}?`
      : `Are you sure you want to reroll ALL dice for Week ${selectedWeek}? This will generate new dice rolls and rep counts for all lifts.`;
    
    if (!confirm(message)) {
      return;
    }
    
    setRerolling(true);
    try {
      // Call the reroll API
      await programsAPI.rerollWeek(id, selectedWeek, lift);
      
      // Reload the page to show the changes
      window.location.reload();
    } catch (error) {
      console.error('Error rerolling:', error);
      alert(`Failed to reroll dice: ${error}`);
      setRerolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading program...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Program not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-gray-900 hover:text-gray-700 underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const weekData = program.weeks?.[selectedWeek - 1];
  const template = program.config?.weekly_template;
  const sessionNames = template?.sessions ? Object.keys(template.sessions).sort() : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-900 hover:text-gray-700 font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {program.config?.num_lifts} Lifts • {program.config?.weekly_template?.sessions_per_week} Days/Week
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Program Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {program.name || 'The Battleship Program'}
              </h1>
              <p className="text-gray-600">8-Week Strength Training Program</p>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  program.status === 'active' ? 'bg-green-100 text-green-800 border border-green-300' :
                  program.status === 'completed' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                  'bg-gray-200 text-gray-700 border border-gray-300'
                }`}>
                  {program.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              {/* Export Dropdown */}
              <div className="relative group">
                <button
                  className="px-4 py-2 bg-white text-gray-900 font-medium rounded-lg border-2 border-gray-900 hover:bg-gray-50 transition"
                >
                  📥 Download
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => downloadMarkdown(program, true)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm border-b border-gray-200"
                  >
                    <div className="font-medium text-gray-900">Coach's View</div>
                    <div className="text-xs text-gray-600">Includes dice rolls & RMs</div>
                  </button>
                  <button
                    onClick={() => downloadMarkdown(program, false)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
                  >
                    <div className="font-medium text-gray-900">Athlete's View</div>
                    <div className="text-xs text-gray-600">Clean workout plan only</div>
                  </button>
                </div>
              </div>
              
              {program.status === 'draft' && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  💾 Save & Finalize
                </button>
              )}
            </div>
          </div>
          
          {weekData && (
            <div className="mt-4">
              <div className="flex items-center space-x-4 text-sm mb-3">
                <span className="text-gray-600 font-medium">
                  Week {selectedWeek} of 8
                </span>
                {program.status === 'draft' && (
                  <button
                    onClick={() => handleRerollWeek()}
                    disabled={rerolling}
                    className="px-3 py-1 bg-white text-gray-900 text-xs font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {rerolling ? '🔄 Rerolling...' : '🎲 Reroll All Dice'}
                  </button>
                )}
              </div>
              {weekData.dice_rolls && (
                <div className="flex flex-wrap gap-2" key={`dice-${selectedWeek}-${refreshKey}`}>
                  {Object.entries(weekData.dice_rolls).map(([lift, rolls]) => (
                    <div key={`${lift}-${rolls[0]}-${rolls[1]}-${refreshKey}`} className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-900 rounded-full border border-gray-300 text-xs">
                      <span className="font-medium">{getLiftDisplayName(lift, program?.config?.lift_names)}:</span>
                      <span>🎲 {rolls[0]}, {rolls[1]}</span>
                      {program.status === 'draft' && (
                        <button
                          onClick={() => handleRerollWeek(lift)}
                          disabled={rerolling}
                          className="ml-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={`Reroll ${getLiftDisplayName(lift, program?.config?.lift_names)}`}
                        >
                          🔄
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save & Finalize Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Save & Finalize Program
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Give your program a name and finalize it. Once finalized, the program status will change to "Active" and you won't be able to reroll weeks.
              </p>
              <div className="mb-4">
                <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name
                </label>
                <input
                  type="text"
                  id="programName"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="e.g., Spring 2025 Battleship"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAndFinalize}
                  disabled={saving || !programName.trim()}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save & Finalize'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Mode Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === 'daily'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              Day-by-Day
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === 'weekly'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              Week-by-Week
            </button>
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === 'overview'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              Weekly NL
            </button>
          </div>
        </div>

        {/* Week Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Week</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`py-3 rounded-lg font-medium transition border ${
                  selectedWeek === week
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                Week {week}
              </button>
            ))}
          </div>
        </div>

        {/* Session Selector (only for Day-by-Day view) */}
        {viewMode === 'daily' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Session</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sessionNames.map((sessionName) => (
                <button
                  key={sessionName}
                  onClick={() => setSelectedSession(sessionName)}
                  className={`py-3 rounded-lg font-medium transition border ${
                    selectedSession === sessionName
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  Session {sessionName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content based on view mode */}
        {viewMode === 'daily' ? (
          <DailyView program={program} weekNumber={selectedWeek} sessionName={selectedSession} />
        ) : viewMode === 'weekly' ? (
          <WeeklyView program={program} weekNumber={selectedWeek} />
        ) : (
          <OverviewView program={program} weekNumber={selectedWeek} />
        )}
      </main>
    </div>
  );
}

interface LiftWithIntensity {
  lift: string;
  intensity: string;
  totalReps: number;
  weight: number | string;
  rm: number;
}

function DailyView({ program, weekNumber, sessionName }: { program: Program; weekNumber: number; sessionName: string }) {
  const template = program.config?.weekly_template;
  const weekData = program.weeks?.[weekNumber - 1];
  const liftWeights = program.config?.lift_weights;
  const liftIntensityRMs = program.config?.lift_intensity_rms;

  if (!template || !weekData) return null;

  const sessions = template.sessions || {};
  const sessionLifts = sessions[sessionName];

  if (!sessionLifts) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">No session data available.</p>
      </div>
    );
  }

  // Organize lifts by intensity and sort: Heavy first, then Medium, then Light
  const liftsWithIntensity: LiftWithIntensity[] = [];
  
  Object.entries(sessionLifts).forEach(([lift, intensity]) => {
    const totalReps = weekData.weekly_data?.[lift]?.[intensity as string] || 0;
    const weight = liftWeights?.[lift]?.[intensity as string] || 0;
    const rm = liftIntensityRMs?.[lift]?.[intensity as string] || program.config?.lift_rms?.[lift] || 10;
    
    liftsWithIntensity.push({
      lift,
      intensity: intensity as string,
      totalReps,
      weight,
      rm
    });
  });

  // Sort by intensity: H first, then M, then L
  const intensityOrder = { 'H': 1, 'M': 2, 'L': 3 };
  liftsWithIntensity.sort((a, b) => {
    return (intensityOrder[a.intensity as keyof typeof intensityOrder] || 99) - 
           (intensityOrder[b.intensity as keyof typeof intensityOrder] || 99);
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-900 px-6 py-4">
        <h3 className="text-xl font-bold text-white">
          Week {weekNumber} - Session {sessionName}
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {liftsWithIntensity.map(({ lift, intensity, totalReps, weight, rm }) => {
            const repScheme = assignReps(rm, totalReps, intensity as 'H' | 'M' | 'L');
            
            return (
              <div key={`${lift}-${intensity}`} className="border-l-4 border-gray-900 pl-4 py-3 bg-gray-50 rounded-r">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {getLiftDisplayName(lift, program.config?.lift_names)}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    intensity === 'H' ? 'bg-red-100 text-red-800 border border-red-300' :
                    intensity === 'M' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                    'bg-green-100 text-green-800 border border-green-300'
                  }`}>
                    {intensity === 'H' ? 'Heavy' : intensity === 'M' ? 'Medium' : 'Light'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Weight/Variation:</span>
                    <span className="font-semibold text-gray-900">{typeof weight === 'number' ? `${weight} lbs` : weight}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Reps:</span>
                    <span className="font-semibold text-gray-900">{totalReps} reps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Your RM at this weight:</span>
                    <span className="font-semibold text-gray-900">{rm} reps</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-gray-700 font-medium mb-1">Suggested Rep Scheme:</p>
                    <p className="text-gray-900 font-semibold">{formatRepScheme(repScheme)}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 You can adjust the sets/reps as needed, as long as you complete {totalReps} total reps.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WeeklyView({ program, weekNumber }: { program: Program; weekNumber: number }) {
  const template = program.config?.weekly_template;
  const weekData = program.weeks?.[weekNumber - 1];
  const liftWeights = program.config?.lift_weights;
  const liftIntensityRMs = program.config?.lift_intensity_rms;

  if (!template || !weekData) return null;

  const sessions = template.sessions || {};
  const sessionNames = Object.keys(sessions).sort();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Week {weekNumber} - Calendar View
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sessionNames.map((sessionName) => {
            const sessionLifts = sessions[sessionName];
            
            // Organize lifts by intensity
            const liftsWithIntensity: LiftWithIntensity[] = [];
            
            Object.entries(sessionLifts).forEach(([lift, intensity]) => {
              const totalReps = weekData.weekly_data?.[lift]?.[intensity as string] || 0;
              const weight = liftWeights?.[lift]?.[intensity as string] || 0;
              const rm = liftIntensityRMs?.[lift]?.[intensity as string] || program.config?.lift_rms?.[lift] || 10;
              
              liftsWithIntensity.push({
                lift,
                intensity: intensity as string,
                totalReps,
                weight,
                rm
              });
            });

            // Sort by intensity: H first, then M, then L
            const intensityOrder = { 'H': 1, 'M': 2, 'L': 3 };
            liftsWithIntensity.sort((a, b) => {
              return (intensityOrder[a.intensity as keyof typeof intensityOrder] || 99) - 
                     (intensityOrder[b.intensity as keyof typeof intensityOrder] || 99);
            });
            
            return (
              <div key={sessionName} className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-900 transition">
                <div className="bg-gray-900 px-4 py-2">
                  <h4 className="font-bold text-white text-center">
                    Session {sessionName}
                  </h4>
                </div>
                <div className="p-3 space-y-2">
                  {liftsWithIntensity.map(({ lift, intensity, totalReps, weight, rm }) => {
                    const repScheme = assignReps(rm, totalReps, intensity as 'H' | 'M' | 'L');
                    
                    return (
                      <div key={`${lift}-${intensity}`} className="text-xs border-l-2 border-gray-700 pl-2 py-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900 text-xs">
                            {getLiftDisplayName(lift, program.config?.lift_names)}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            intensity === 'H' ? 'bg-red-100 text-red-800' :
                            intensity === 'M' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {intensity}
                          </span>
                        </div>
                        <div className="text-gray-600 space-y-0.5">
                          <p>{typeof weight === 'number' ? `${weight} lbs` : weight} × {totalReps} reps</p>
                          <p className="text-gray-500">{formatRepScheme(repScheme)}</p>
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
  );
}

function OverviewView({ program, weekNumber }: { program: Program; weekNumber: number }) {
  const weekData = program.weeks?.[weekNumber - 1];
  
  if (!weekData) return null;

  const lifts = Object.keys(weekData.weekly_data || {});

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Week {weekNumber} - Weekly NL (Total Reps by Intensity)
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Lift
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Heavy (H)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Medium (M)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Light (L)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lifts.map((lift) => {
              const data = weekData.weekly_data[lift];
              const total = (data.H || 0) + (data.M || 0) + (data.L || 0);
              
              return (
                <tr key={lift} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getLiftDisplayName(lift, program.config?.lift_names)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {data.H || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {data.M || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {data.L || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}