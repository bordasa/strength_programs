import { Program } from '../types';
import { assignReps, formatRepScheme } from './repLadder';
import { LIFT_LABELS } from '../pages/CreateProgramPage';

interface ExportOptions {
  includeCoachInfo: boolean; // dice rolls, RMs, etc.
}

// Helper function to get display name for a lift
function getLiftDisplayName(liftKey: string, customNames?: Record<string, string>): string {
  // First check if there's a custom name
  if (customNames && customNames[liftKey]) {
    return customNames[liftKey];
  }
  // Fall back to default label or formatted key
  const defaultLabel = LIFT_LABELS[liftKey] || liftKey.replace(/_/g, ' ');
  // Capitalize first letter of each word
  return defaultLabel.replace(/\b\w/g, l => l.toUpperCase());
}

export function generateMarkdown(program: Program, options: ExportOptions): string {
  const { includeCoachInfo } = options;
  const programName = program.name || 'The Battleship Program';
  const config = program.config;
  const weeks = program.weeks || [];
  const template = config?.weekly_template;
  
  let markdown = '';
  
  // Header
  markdown += `# ${programName}\n\n`;
  markdown += `**Program Type:** Battleship\n`;
  markdown += `**Duration:** 8 Weeks\n`;
  markdown += `**Lifts:** ${config?.num_lifts}\n`;
  markdown += `**Sessions per Week:** ${template?.sessions_per_week}\n`;
  markdown += `**Status:** ${program.status.toUpperCase()}\n`;
  
  if (includeCoachInfo) {
    markdown += `\n---\n`;
    markdown += `## Coach's Notes\n\n`;
    markdown += `This view includes all program details including dice rolls and rep maxes.\n`;
  }
  
  markdown += `\n---\n\n`;
  
  // Lift Configuration (Coach view only)
  if (includeCoachInfo && config?.lift_weights && config?.lift_intensity_rms) {
    markdown += `## Lift Configuration\n\n`;
    const lifts = Object.keys(config.lift_rms);
    
    for (const lift of lifts) {
      const liftName = getLiftDisplayName(lift, config.lift_names);
      markdown += `### ${liftName}\n\n`;
      markdown += `| Intensity | Weight | RM |\n`;
      markdown += `|-----------|--------|----|\n`;
      const heavyWeight = config.lift_weights[lift]?.H;
      const mediumWeight = config.lift_weights[lift]?.M;
      const lightWeight = config.lift_weights[lift]?.L;
      markdown += `| Heavy (85% 1RM) | ${heavyWeight || 'N/A'} | ${config.lift_intensity_rms[lift]?.H || 0} reps |\n`;
      markdown += `| Medium (75% 1RM) | ${mediumWeight || 'N/A'} | ${config.lift_intensity_rms[lift]?.M || 0} reps |\n`;
      markdown += `| Light (65% 1RM) | ${lightWeight || 'N/A'} | ${config.lift_intensity_rms[lift]?.L || 0} reps |\n`;
      markdown += `\n`;
    }
    
    markdown += `---\n\n`;
  }
  
  // Week by week breakdown
  for (let weekNum = 1; weekNum <= 8; weekNum++) {
    const week = weeks.find(w => w.week_number === weekNum);
    if (!week) continue;
    
    markdown += `## Week ${weekNum}\n\n`;
    
    // Dice rolls (Coach view only)
    if (includeCoachInfo && week.dice_rolls) {
      markdown += `**Dice Rolls:**\n\n`;
      for (const [lift, rolls] of Object.entries(week.dice_rolls)) {
        const liftName = getLiftDisplayName(lift, config?.lift_names);
        markdown += `- ${liftName}: 🎲 ${rolls[0]}, ${rolls[1]}\n`;
      }
      markdown += `\n`;
    }
    
    // Sessions
    if (template?.sessions) {
      const sessionNames = Object.keys(template.sessions).sort();
      
      for (const sessionName of sessionNames) {
        markdown += `### Session ${sessionName}\n\n`;
        
        const sessionLifts = template.sessions[sessionName];
        
        // Organize lifts by intensity (H, M, L)
        const liftsWithIntensity: Array<{
          lift: string;
          intensity: string;
          totalReps: number;
          weight: number | string;
          rm: number;
        }> = [];
        
        for (const [lift, intensity] of Object.entries(sessionLifts)) {
          const totalReps = week.weekly_data?.[lift]?.[intensity as string] || 0;
          const weight = config?.lift_weights?.[lift]?.[intensity as string] || 0;
          const rm = config?.lift_intensity_rms?.[lift]?.[intensity as string] || config?.lift_rms?.[lift] || 10;
          
          liftsWithIntensity.push({
            lift,
            intensity: intensity as string,
            totalReps,
            weight,
            rm
          });
        }
        
        // Sort by intensity: H first, then M, then L
        const intensityOrder: Record<string, number> = { 'H': 1, 'M': 2, 'L': 3 };
        liftsWithIntensity.sort((a, b) => {
          return (intensityOrder[a.intensity] || 99) - (intensityOrder[b.intensity] || 99);
        });
        
        // Output each lift
        for (const { lift, intensity, totalReps, weight, rm } of liftsWithIntensity) {
          const liftName = getLiftDisplayName(lift, config?.lift_names);
          const intensityName = intensity === 'H' ? 'Heavy' : intensity === 'M' ? 'Medium' : 'Light';
          const repScheme = assignReps(rm, totalReps, intensity as 'H' | 'M' | 'L');
          
          markdown += `#### ${liftName} - ${intensityName}\n\n`;
          
          if (includeCoachInfo) {
            // Coach's view: show everything
            markdown += `- **Weight/Variation:** ${weight}\n`;
            markdown += `- **Total Reps:** ${totalReps}\n`;
            markdown += `- **RM at this weight:** ${rm} reps\n`;
            markdown += `- **Suggested Rep Scheme:** ${formatRepScheme(repScheme)}\n`;
          } else {
            // Athlete's view: simplified (no labels, just the info)
            markdown += `${weight} × ${totalReps} reps\n\n`;
            markdown += `${formatRepScheme(repScheme)}\n`;
          }
          
          markdown += `\n`;
        }
      }
    }
    
    markdown += `---\n\n`;
  }
  
  // Footer
  markdown += `## Notes\n\n`;
  
  if (includeCoachInfo) {
    markdown += `- This is the coach's view with complete program details\n`;
    markdown += `- Dice rolls determine the total reps (NL) for each lift at each intensity\n`;
    markdown += `- Rep schemes are calculated based on the athlete's RM at each weight\n`;
    markdown += `- Athletes can adjust set/rep schemes as long as total reps are completed\n`;
  } else {
    markdown += `- Complete the total reps listed for each exercise\n`;
    markdown += `- Use the suggested rep scheme or adjust as needed\n`;
    markdown += `- Rest 3-5 minutes between sets for heavy lifts\n`;
    markdown += `- Rest as needed (1-2 minutes) between sets for medium/light lifts\n`;
    markdown += `- Track your completed sets and reps for each session\n`;
  }
  
  markdown += `\n---\n\n`;
  markdown += `*Generated by Strength Programs - Battleship Program Generator*\n`;
  
  return markdown;
}

export function generateTableView(program: Program): string {
  const programName = program.name || 'The Battleship Program';
  const config = program.config;
  const weeks = program.weeks || [];
  const template = config?.weekly_template;
  
  let markdown = '';
  
  // Header
  markdown += `# ${programName}\n`;
  markdown += `**Table View** - Optimized for Printing\n\n`;
  markdown += `**Duration:** 8 Weeks\n`;
  markdown += `**Lifts:** ${config?.num_lifts}\n`;
  markdown += `**Sessions per Week:** ${template?.sessions_per_week}\n\n`;
  markdown += `---\n\n`;
  
  // Generate a table for each week
  for (let weekNum = 1; weekNum <= 8; weekNum++) {
    const week = weeks.find(w => w.week_number === weekNum);
    if (!week) continue;
    
    markdown += `## Week ${weekNum}\n\n`;
    
    // Create table header
    markdown += `| Session | Exercise | Load/Variation | Total Reps | Suggested Rep Scheme |\n`;
    markdown += `|---------|----------|----------------|------------|---------------------|\n`;
    
    if (template?.sessions) {
      const sessionNames = Object.keys(template.sessions).sort();
      
      for (const sessionName of sessionNames) {
        const sessionLifts = template.sessions[sessionName];
        
        // Organize lifts by intensity for this session
        const liftsWithIntensity: Array<{
          lift: string;
          intensity: string;
          totalReps: number;
          weight: number | string;
          rm: number;
        }> = [];
        
        Object.entries(sessionLifts).forEach(([lift, intensity]) => {
          const totalReps = week.weekly_data?.[lift]?.[intensity as string] || 0;
          const weight = config?.lift_weights?.[lift]?.[intensity as string] || 0;
          const rm = config?.lift_intensity_rms?.[lift]?.[intensity as string] || config?.lift_rms?.[lift] || 10;
          
          liftsWithIntensity.push({
            lift,
            intensity: intensity as string,
            totalReps,
            weight,
            rm
          });
        });
        
        // Sort by intensity: H first, then M, then L
        const intensityOrder: Record<string, number> = { 'H': 1, 'M': 2, 'L': 3 };
        liftsWithIntensity.sort((a, b) => {
          return (intensityOrder[a.intensity] || 99) - (intensityOrder[b.intensity] || 99);
        });
        
        // Add rows for each lift in this session
        liftsWithIntensity.forEach(({ lift, intensity, totalReps, weight, rm }, index) => {
          const liftName = getLiftDisplayName(lift, config?.lift_names);
          const repScheme = assignReps(rm, totalReps, intensity as 'H' | 'M' | 'L');
          const repSchemeStr = formatRepScheme(repScheme);
          
          // Only show session number for the first lift of each session
          const sessionDisplay = index === 0 ? sessionName : '';
          
          markdown += `| ${sessionDisplay} | ${liftName} | ${weight} | ${totalReps} | ${repSchemeStr} |\n`;
        });
      }
    }
    
    markdown += `\n`;
    
    // Add page break suggestion for printing
    if (weekNum < 8) {
      markdown += `<div style="page-break-after: always;"></div>\n\n`;
    }
    
    markdown += `---\n\n`;
  }
  
  // Footer with instructions
  markdown += `## Instructions\n\n`;
  markdown += `- Complete the total reps listed for each exercise\n`;
  markdown += `- Use the suggested rep scheme or adjust as needed\n`;
  markdown += `- Rest 3-5 minutes between sets for heavy lifts\n`;
  markdown += `- Rest as needed (1-2 minutes) between sets for medium/light lifts\n`;
  markdown += `- Track your completed sets and reps for each session\n\n`;
  markdown += `---\n\n`;
  markdown += `*Generated by Strength Programs - Battleship Program Generator*\n`;
  
  return markdown;
}

export function downloadMarkdown(program: Program, includeCoachInfo: boolean) {
  const markdown = generateMarkdown(program, { includeCoachInfo });
  const viewType = includeCoachInfo ? 'coach' : 'athlete';
  const programName = program.name || 'battleship_program';
  const filename = `${programName.toLowerCase().replace(/\s+/g, '_')}_${viewType}_view.md`;
  
  // Create blob and download
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadTableView(program: Program) {
  const markdown = generateTableView(program);
  const programName = program.name || 'battleship_program';
  const filename = `${programName.toLowerCase().replace(/\s+/g, '_')}_table_view.md`;
  
  // Create blob and download
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
