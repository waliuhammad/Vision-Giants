/**
 * Open positions. Intentionally EMPTY: no confirmed vacancies were supplied.
 * Add real roles here; the Careers page renders job cards automatically when this list is non-empty.
 */
export interface Position {
  id: string;
  title: string;
  type: string;
  location: string;
  summary: string;
}

export const openPositions: Position[] = [];

/** Disciplines the team works across. Shown as context, not as active vacancies. */
export const disciplines = [
  { title: 'Frontend Development', text: 'Building accessible, high-performance interfaces with React.' },
  { title: 'Backend Development', text: 'Designing APIs, data models and reliable services with Node.js.' },
  { title: 'Full-Stack Development', text: 'Working across the stack to ship complete features end to end.' },
  { title: 'UI/UX Design', text: 'Researching, prototyping and crafting clear, usable product design.' },
];
