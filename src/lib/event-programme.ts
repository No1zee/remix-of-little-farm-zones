export const decemberEvent = {
  date: '2026-12-05',
  start: '10:00',
  end: '17:00',
  timezone: 'Africa/Harare',
  status: 'proposed',
} as const;

export type ProgrammeSession = { id: string; zone: string; start: string; end: string; title: string };
export const programme: ProgrammeSession[] = [
  { id: 'baby-1', zone: 'baby', start: '10:30', end: '11:00', title: 'Storytelling in the garden' },
  { id: 'baby-2', zone: 'baby', start: '11:30', end: '12:00', title: 'Soft play & tiny discoveries' },
  { id: 'baby-3', zone: 'baby', start: '13:00', end: '13:30', title: 'Toys & foam pool play' },
  { id: 'baby-4', zone: 'baby', start: '14:30', end: '15:00', title: 'Afternoon story time' },
  { id: 'baby-5', zone: 'baby', start: '15:30', end: '16:00', title: 'Gentle soft play' },
  { id: 'adventure-1', zone: 'adventure', start: '10:30', end: '11:15', title: 'Jumping castle adventures' },
  { id: 'adventure-2', zone: 'adventure', start: '11:30', end: '12:00', title: 'Meet the animals' },
  { id: 'adventure-3', zone: 'adventure', start: '13:00', end: '13:45', title: 'Giant Tic-Tac-Toe & hoop shooting' },
  { id: 'adventure-4', zone: 'adventure', start: '14:00', end: '14:45', title: 'Inflatables & outdoor games' },
  { id: 'adventure-5', zone: 'adventure', start: '15:30', end: '16:00', title: 'Animal encounters' },
  { id: 'creative-1', zone: 'creative', start: '10:30', end: '11:15', title: 'Painting little masterpieces' },
  { id: 'creative-2', zone: 'creative', start: '11:30', end: '12:00', title: 'Bracelet making' },
  { id: 'creative-3', zone: 'creative', start: '13:00', end: '13:45', title: 'Arts & crafts workshop' },
  { id: 'creative-4', zone: 'creative', start: '14:00', end: '14:45', title: 'Playful spelling activities' },
  { id: 'creative-5', zone: 'creative', start: '15:30', end: '16:00', title: 'Afternoon painting' },
  { id: 'discovery-1', zone: 'discovery', start: '10:30', end: '11:15', title: 'Science Lab: colour mixing' },
  { id: 'discovery-2', zone: 'discovery', start: '11:30', end: '12:00', title: 'Volcano eruptions' },
  { id: 'discovery-3', zone: 'discovery', start: '13:00', end: '13:45', title: 'Build cardboard cars & rockets' },
  { id: 'discovery-4', zone: 'discovery', start: '14:00', end: '14:45', title: 'Mini plant pots' },
  { id: 'discovery-5', zone: 'discovery', start: '15:30', end: '16:00', title: 'Giant chess, Jenga & puzzle play' },
  { id: 'stage-1', zone: 'stage', start: '10:00', end: '10:30', title: 'Welcome to Bambino Wonder Day' },
  { id: 'stage-2', zone: 'stage', start: '12:00', end: '13:00', title: 'Lunch break & family time' },
  { id: 'stage-3', zone: 'stage', start: '14:45', end: '15:30', title: 'Clown & live entertainment' },
  { id: 'stage-4', zone: 'stage', start: '16:00', end: '16:30', title: 'Music, dancing & group games' },
  { id: 'stage-5', zone: 'stage', start: '16:30', end: '17:00', title: 'Prizes, giveaways & goodbye' },
];

export function sessionsOverlap(a: ProgrammeSession, b: ProgrammeSession) {
  return a.id !== b.id && a.start < b.end && b.start < a.end;
}