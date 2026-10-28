import { company } from './company';

/**
 * Company profile shown on the Portfolio page. These are the built-in defaults; once the page is
 * saved in Admin → Portfolio page, the website shows the saved version (Firestore `pages/portfolio`).
 */
export interface ProfileFact {
  label: string;
  value: string;
}

export interface ProfileAward {
  title: string;
  issuer: string;
  year: string;
  /** Sample entry that still needs replacing with a real one; shown with a "Placeholder" badge. */
  placeholder?: boolean;
}

export interface CompanyProfile {
  /** Short bio, about three lines, centred at the top of the page. */
  bio: string;
  introTitle: string;
  introText: string;
  facts: ProfileFact[];
  /** Paragraphs separated by a blank line. */
  whoWeAre: string;
  whatWeDo: string;
  mission: string;
  vision: string;
  certifications: ProfileAward[];
  honours: ProfileAward[];
}

export const defaultProfile: CompanyProfile = {
  bio: `${company.name} is a software development studio based in Multan, Pakistan. We design and build web applications, mobile apps and custom software for businesses that want dependable, well-crafted digital products.`,
  introTitle: 'A software house built around your goals',
  introText:
    'We combine product thinking, design and engineering so that what gets built is useful, usable and technically sound. Every engagement starts with understanding your business and the people you serve.',
  facts: [
    { label: 'Registered name', value: company.legalName },
    { label: 'Headquarters', value: 'Multan, Pakistan' },
    { label: 'Focus', value: 'Web, mobile & custom software' },
  ],
  whoWeAre: `${company.name} is a team of developers, designers and problem-solvers who help businesses turn ideas into dependable digital products.\n\nWhether you need a new web application, a mobile app or custom software for your team, we work alongside you from discovery to launch, and we care about the details that make products feel right.`,
  whatWeDo:
    'End-to-end digital services, from strategy and design to development, launch and ongoing support.',
  mission: 'To help businesses grow with well-crafted software that solves real problems and is a pleasure to use.',
  vision: 'To be a trusted technology partner known for thoughtful engineering, clear communication and lasting quality.',
  certifications: [
    { title: 'Certification name', issuer: 'Issuing organisation', year: 'Year', placeholder: true },
    { title: 'Certification name', issuer: 'Issuing organisation', year: 'Year', placeholder: true },
    { title: 'Certification name', issuer: 'Issuing organisation', year: 'Year', placeholder: true },
  ],
  honours: [
    { title: 'Award or recognition', issuer: 'Awarding body', year: 'Year', placeholder: true },
    { title: 'Award or recognition', issuer: 'Awarding body', year: 'Year', placeholder: true },
    { title: 'Award or recognition', issuer: 'Awarding body', year: 'Year', placeholder: true },
  ],
};
