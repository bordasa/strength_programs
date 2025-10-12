import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { programsAPI } from '../services/api';

const LIFT_NAMES = {
  3: ['upper_body_press', 'upper_body_pull', 'squat'],
  4: ['upper_body_press', 'upper_body_pull', 'hip_hinge', 'squat'],
  6: ['horz_press', 'horz_pull', 'vert_press', 'vert_pull', 'hinge', 'squat']
};

export const LIFT_LABELS: Record<string, string> = {
  upper_body_press: 'Upper Body Press',
  upper_body_pull: 'Upper Body Pull',
  squat: 'Squat',
  hip_hinge: 'Hip Hinge',
  horz_press: 'Horizontal Press',
  horz_pull: 'Horizontal Pull',
  vert_press: 'Vertical Press',
  vert_pull: 'Vertical Pull',
  hinge: 'Hip Hinge'
};

const LIFT_EXAMPLES: Record<string, string> = {
  upper_body_press: 'e.g., Bench Press, Military Press, etc.',
  upper_body_pull: 'e.g., Chin Up, Pendlay Row, etc.',
  squat: 'e.g., Back Squat, Zercher Squat, etc.',
  hip_hinge: 'e.g., Deadlift, Good Morning, etc.',
  horz_press: 'e.g., Bench Press, Floor Press, etc.',
  horz_pull: 'e.g., Pendlay Row, One-Arm Row, etc.',
  vert_press: 'e.g., Military Press, KB MP, etc.',
  vert_pull: 'e.g., Pull Up, Chin Up, etc.',
  hinge: 'e.g., Deadlift, Good Morning, etc.'
};

interface LiftData {
  weights: {
    H: number | string;  // 85% 1RM or variation (e.g., "225" or "Push Ups")
    M: number | string;  // 75% 1RM or variation
    L: number | string;  // 65% 1RM or variation
  };
  rms: {
    H: number;  // RM at heavy weight
    M: number;  // RM at medium weight
    L: number;  // RM at light weight
  };
}

export default function CreateProgramPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [programName, setProgramName] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [numLifts, setNumLifts] = useState<3 | 4 | 6>(4);
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(3);
  const [liftData, setLiftData] = useState<Record<string, LiftData>>({});
  const [liftNames, setLiftNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lifts = LIFT_NAMES[numLifts];

  // Initialize lift data when changing number of lifts
  const handleLiftChange = (newNumLifts: 3 | 4 | 6) => {
    setNumLifts(newNumLifts);
    const newData: Record<string, LiftData> = {};
    const newNames: Record<string, string> = {};
    LIFT_NAMES[newNumLifts].forEach(lift => {
      newData[lift] = {
        weights: { H: '', M: '', L: '' },
        rms: { H: 10, M: 10, L: 10 }
      };
      newNames[lift] = '';  // Initialize empty custom names
    });
    setLiftData(newData);
    setLiftNames(newNames);
    
    // Auto-select sessions per week
    if (newNumLifts === 3) {
      setSessionsPerWeek(3);
    } else if (newNumLifts === 6) {
      setSessionsPerWeek(4);
    }
  };

  // Initialize on mount
  if (Object.keys(liftData).length === 0) {
    const initialData: Record<string, LiftData> = {};
    const initialNames: Record<string, string> = {};
    lifts.forEach(lift => {
      initialData[lift] = {
        weights: { H: '', M: '', L: '' },
        rms: { H: 10, M: 10, L: 10 }
      };
      initialNames[lift] = '';
    });
    setLiftData(initialData);
    setLiftNames(initialNames);
  }

  const updateWeight = (lift: string, intensity: 'H' | 'M' | 'L', value: string) => {
    // Accept both numbers and strings (e.g., "225" or "Push Ups")
    setLiftData(prev => ({
      ...prev,
      [lift]: {
        ...prev[lift],
        weights: {
          ...prev[lift].weights,
          [intensity]: value
        }
      }
    }));
  };

  const updateRM = (lift: string, intensity: 'H' | 'M' | 'L', value: string) => {
    const rm = parseInt(value) || 0;
    setLiftData(prev => ({
      ...prev,
      [lift]: {
        ...prev[lift],
        rms: {
          ...prev[lift].rms,
          [intensity]: rm
        }
      }
    }));
  };

  const updateLiftName = (lift: string, name: string) => {
    setLiftNames(prev => ({
      ...prev,
      [lift]: name
    }));
  };

  const handleNext = () => {
    // Validate step 1
    for (const lift of lifts) {
      const data = liftData[lift];
      if (!data || !data.weights.H || !data.weights.M || !data.weights.L) {
        setError('Please enter weights or variations for all lifts at all intensities');
        return;
      }
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate step 2
    for (const lift of lifts) {
      const data = liftData[lift];
      if (!data || data.rms.H === 0 || data.rms.M === 0 || data.rms.L === 0) {
        setError('Please enter rep maxes for all lifts at all intensities');
        return;
      }
    }

    setLoading(true);

    try {
      // Prepare lift data for backend
      const lift_rms: Record<string, number> = {};
      const lift_weights: Record<string, Record<string, number>> = {};
      const lift_intensity_rms: Record<string, Record<string, number>> = {};
      
      lifts.forEach(lift => {
        // Use Heavy RM as the main RM for backward compatibility
        lift_rms[lift] = liftData[lift].rms.H;
        
        // Send all weights and RMs for each intensity
        lift_weights[lift] = {
          H: liftData[lift].weights.H,
          M: liftData[lift].weights.M,
          L: liftData[lift].weights.L
        };
        
        lift_intensity_rms[lift] = {
          H: liftData[lift].rms.H,
          M: liftData[lift].rms.M,
          L: liftData[lift].rms.L
        };
      });

      // Prepare lift names (only send non-empty custom names)
      const custom_lift_names: Record<string, string> = {};
      lifts.forEach(lift => {
        if (liftNames[lift] && liftNames[lift].trim() !== '') {
          custom_lift_names[lift] = liftNames[lift].trim();
        }
      });

      const program = await programsAPI.create({
        name: programName || undefined,
        athlete_id: user!.athlete_id!,
        created_by: user!.id,
        num_lifts: numLifts,
        lift_rms: lift_rms,
        lift_weights: lift_weights,
        lift_intensity_rms: lift_intensity_rms,
        lift_names: Object.keys(custom_lift_names).length > 0 ? custom_lift_names : undefined,
        sessions_per_week: sessionsPerWeek
      });

      navigate(`/programs/${program.id}`);
    } catch (err: any) {
      console.error('Program creation error:', err);
      const errorMessage = err.response?.data?.detail 
        || err.message 
        || 'Failed to create program. Please try again.';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-900 hover:text-gray-700"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Battleship Program
            </h2>
            <div className="mt-4 flex items-center">
              <div className={`flex items-center ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Weights</span>
              </div>
              <div className="mx-4 h-0.5 w-16 bg-gray-300"></div>
              <div className={`flex items-center ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Rep Maxes</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              {/* Program Name */}
              <div>
                <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name (Optional)
                </label>
                <input
                  type="text"
                  id="programName"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="e.g., Spring 2025 Battleship"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              {/* Number of Lifts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Lifts
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[3, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleLiftChange(num as 3 | 4 | 6)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                        numLifts === num
                          ? 'border-gray-900 bg-gray-50 text-gray-900'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {num} Lifts
                    </button>
                  ))}
                </div>
              </div>

              {/* Sessions Per Week (only for 4 lifts) */}
              {numLifts === 4 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sessions Per Week
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSessionsPerWeek(num)}
                        className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                          sessionsPerWeek === num
                            ? 'border-gray-900 bg-gray-50 text-gray-900'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {num} Days/Week
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Weights for Each Lift */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Step 1: Enter Training Weights or Variations
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the weight (e.g., "225") or variation (e.g., "Push Ups") for each intensity level:
                </p>
                <div className="space-y-6">
                  {lifts.map((lift) => (
                    <div key={lift} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-1 capitalize">
                        {LIFT_LABELS[lift]}
                      </h4>
                      <div className="mb-3">
                        <input
                          type="text"
                          value={liftNames[lift] || ''}
                          onChange={(e) => updateLiftName(lift, e.target.value)}
                          placeholder={LIFT_EXAMPLES[lift] || 'e.g., Bench Press, Back Squat, etc.'}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Specify the exact exercise (optional)</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Heavy (85% 1RM)
                          </label>
                          <input
                            type="text"
                            value={liftData[lift]?.weights.H || ''}
                            onChange={(e) => updateWeight(lift, 'H', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Medium (75% 1RM)
                          </label>
                          <input
                            type="text"
                            value={liftData[lift]?.weights.M || ''}
                            onChange={(e) => updateWeight(lift, 'M', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Light (65% 1RM)
                          </label>
                          <input
                            type="text"
                            value={liftData[lift]?.weights.L || ''}
                            onChange={(e) => updateWeight(lift, 'L', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Specify weights or variations for each intensity</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Next: Enter Rep Maxes →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                  ← Back to Weights
                </button>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Step 2: Enter Rep Maxes (RM)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  For each weight, enter the maximum number of reps you can complete (4-15 reps):
                </p>
                <div className="space-y-6">
                  {lifts.map((lift) => (
                    <div key={lift} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                        {LIFT_LABELS[lift]}
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Heavy RM ({liftData[lift]?.weights.H || 0} lbs)
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="4"
                              max="15"
                              value={liftData[lift]?.rms.H || ''}
                              onChange={(e) => updateRM(lift, 'H', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                              placeholder="10"
                            />
                            <span className="ml-2 text-sm text-gray-500">reps</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Medium RM ({liftData[lift]?.weights.M || 0} lbs)
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="4"
                              max="15"
                              value={liftData[lift]?.rms.M || ''}
                              onChange={(e) => updateRM(lift, 'M', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                              placeholder="10"
                            />
                            <span className="ml-2 text-sm text-gray-500">reps</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Light RM ({liftData[lift]?.weights.L || 0} lbs)
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="4"
                              max="15"
                              value={liftData[lift]?.rms.L || ''}
                              onChange={(e) => updateRM(lift, 'L', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                              placeholder="10"
                            />
                            <span className="ml-2 text-sm text-gray-500">reps</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  📋 Program Summary
                </h3>
                <ul className="text-gray-800 text-sm space-y-1">
                  <li>• 8-week Battleship program</li>
                  <li>• {numLifts} lifts, {sessionsPerWeek} sessions per week</li>
                  <li>• Dice-based volume variation</li>
                  <li>• Rep ladders based on your RMs at each intensity</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating Program...' : 'Generate Program'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}