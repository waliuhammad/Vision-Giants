
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Search,
  Code2,
  Smartphone,
  Monitor,
  Bot,
  BrainCircuit,
  Cpu,
  Megaphone,
  Palette,
  Video,
  ShoppingCart,
  Database,
  Cloud,
  Info,
  Layers,
  X,
} from 'lucide-react';

import {
  technologies,
  supportingStack,
  type TechId,
} from '../data/technologies';

import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TechnologyCard } from '../components/ui/TechnologyCard';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { TechLogo } from '../components/visuals/TechLogos';
import { usePageText } from '../content/ContentContext';

const categories = [
  {
    name: 'All Technologies',
    icon: Layers,
    description: 'Explore our complete technology ecosystem.',
    keywords: [] as string[],
  },
  {
    name: 'Website Development',
    icon: Code2,
    description: 'Modern tools for fast, responsive web experiences.',
    keywords: [
      'HTML5', 'CSS3', 'JavaScript', 'TypeScript',
      'React', 'Next.js', 'Vue.js', 'Angular',
      'Tailwind CSS', 'Bootstrap',
    ],
  },
  {
    name: 'App Development',
    icon: Smartphone,
    description: 'Technologies powering Android and iOS applications.',
    keywords: [
      'Flutter', 'React Native', 'Kotlin',
      'Swift', 'Android Studio', 'Expo',
    ],
  },
  {
    name: 'Software Development',
    icon: Monitor,
    description: 'Languages and frameworks for scalable software.',
    keywords: [
      'Python', 'Java', 'C++', 'C#',
      '.NET', 'Electron', 'Qt',
    ],
  },
  {
    name: 'Robotics',
    icon: Bot,
    description: 'Tools for automation, intelligent machines and robotics.',
    keywords: [
      'ROS', 'ROS 2', 'Arduino',
      'Raspberry Pi', 'NVIDIA Jetson', 'MATLAB',
    ],
  },
  {
    name: 'Artificial Intelligence',
    icon: BrainCircuit,
    description: 'Frameworks for machine learning and intelligent systems.',
    keywords: [
      'TensorFlow', 'PyTorch', 'Keras',
      'OpenCV', 'Scikit-learn', 'Hugging Face', 'LangChain',
    ],
  },
  {
    name: 'IoT Development',
    icon: Cpu,
    description: 'Connected devices, sensors and smart automation.',
    keywords: [
      'MQTT', 'Node-RED', 'ESP32',
      'ESP8266', 'Arduino', 'Raspberry Pi', 'AWS IoT',
    ],
  },
  {
    name: 'Social Media Marketing',
    icon: Megaphone,
    description: 'Platforms for digital advertising and social growth.',
    keywords: [
      'Meta Business Suite', 'Google Ads',
      'TikTok Ads', 'Buffer', 'Hootsuite', 'Canva',
    ],
  },
  {
    name: 'Graphic Design',
    icon: Palette,
    description: 'Creative tools for visual identity and design.',
    keywords: [
      'Adobe Photoshop', 'Illustrator',
      'InDesign', 'Figma', 'CorelDRAW', 'Canva',
    ],
  },
  {
    name: 'Video Editing',
    icon: Video,
    description: 'Professional tools for video production and editing.',
    keywords: [
      'Adobe Premiere Pro', 'After Effects',
      'DaVinci Resolve', 'CapCut', 'Final Cut Pro',
    ],
  },
  {
    name: 'E-Commerce',
    icon: ShoppingCart,
    description: 'Platforms for online stores and digital commerce.',
    keywords: [
      'Shopify', 'WooCommerce', 'Magento', 'WordPress',
    ],
  },
  {
    name: 'Database & Backend',
    icon: Database,
    description: 'Backend frameworks, databases and server technologies.',
    keywords: [
      'Node.js', 'Express.js', 'MongoDB',
      'MySQL', 'PostgreSQL', 'Firebase',
    ],
  },
  {
    name: 'Cloud & DevOps',
    icon: Cloud,
    description: 'Cloud infrastructure, deployment and development operations.',
    keywords: [
      'AWS', 'Azure', 'Google Cloud',
      'Docker', 'Kubernetes', 'GitHub',
    ],
  },
];

const architecture: {
  label: string;
  nodes: { id: TechId; name: string; role: string }[];
}[] = [
  {
    label: 'Interface',
    nodes: [
      { id: 'react', name: 'React', role: 'Web interfaces & components' },
      { id: 'flutter', name: 'Flutter', role: 'Cross-platform mobile apps' },
    ],
  },
  {
    label: 'Services & Intelligence',
    nodes: [
      { id: 'node', name: 'Node.js', role: 'APIs & business logic' },
      { id: 'python', name: 'Python', role: 'AI pipelines & automation' },
    ],
  },
  {
    label: 'Cloud & Infrastructure',
    nodes: [
      { id: 'aws', name: 'AWS', role: 'Cloud compute & infrastructure' },
      { id: 'firebase', name: 'Firebase', role: 'Data, authentication & hosting' },
    ],
  },
];

export default function TechnologiesPage() {
  const t = usePageText('technologies');

  const [activeCategory, setActiveCategory] = useState('All Technologies');
  const [search, setSearch] = useState('');

  const filteredTechnologies = useMemo(() => {
    const category = categories.find(
      (item) => item.name === activeCategory
    );

    return technologies.filter((tech) => {
      const matchesSearch =
        tech.name.toLowerCase().includes(search.toLowerCase()) ||
        tech.category.toLowerCase().includes(search.toLowerCase()) ||
        tech.description.toLowerCase().includes(search.toLowerCase()) ||
        tech.uses.some((u) => u.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        activeCategory === 'All Technologies' ||
        tech.category.toLowerCase() === activeCategory.toLowerCase() ||
        (!!category?.keywords.some(
          (keyword) =>
            keyword.toLowerCase() === tech.name.toLowerCase() ||
            tech.name.toLowerCase().includes(keyword.toLowerCase())
        ));

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, search]);

  return (
    <>
      <PageHero
        crumb="Technologies"
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        lead={t('heroLead')}
        actions={
          <Button to="/contact/" icon={<ArrowRight size={18} />}>
            Discuss Your Stack
          </Button>
        }
        visual={
          <div className="page-hero-photo-wrap">
            <img
              src="/images/technologies/hero.jpg"
              alt="Modern technology development workspace"
              className="page-hero-photo"
              loading="eager"
              width={560}
              height={400}
            />
            <div className="page-hero-photo__badge">
              <span className="page-hero-photo__dot" />
              <span>Modern Tech Stack</span>
            </div>
          </div>
        }
      />

      {/* Technology Categories */}
      <section className="section section--tight">
        <div className="container">
          <SectionHeading
            eyebrow="Our Technology Ecosystem"
            title="Technologies We Work With"
            lead="From intelligent software to creative digital solutions, we use modern technologies to build reliable products."
          />

          {/* Search */}
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto 32px',
              position: 'relative',
            }}
          >
            <Search
              size={19}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0.55,
              }}
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search technologies..."
              aria-label="Search technologies"
              style={{
                width: '100%',
                padding: '15px 46px',
                borderRadius: '12px',
                border: '1px solid var(--border-color, #ddd)',
                background: 'var(--surface, #fff)',
                color: 'inherit',
                fontSize: '15px',
                outlineOffset: '3px',
              }}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '42px',
            }}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              const active = activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setActiveCategory(category.name)}
                  aria-pressed={active}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 16px',
                    borderRadius: '30px',
                    border: active
                      ? '1px solid var(--color-primary, #6366f1)'
                      : '1px solid var(--border-color, #ddd)',
                    background: active
                      ? 'var(--color-primary, #6366f1)'
                      : 'transparent',
                    color: active ? '#fff' : 'inherit',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    transition: 'all 0.25s ease',
                  }}
                >
                  <Icon size={16} />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Category Description */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>
              {activeCategory}
            </h3>
            <p style={{ opacity: 0.7 }}>
              {
                categories.find(
                  (item) => item.name === activeCategory
                )?.description
              }
            </p>
          </div>

          {/* Technology Cards */}
          {filteredTechnologies.length > 0 ? (
            <div className="grid grid--4">
              {filteredTechnologies.map((tech, index) => (
                <Reveal key={tech.id} delay={(index % 4) * 70}>
                  <TechnologyCard tech={tech} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                border: '1px dashed var(--border-color, #ddd)',
                borderRadius: '16px',
              }}
            >
              <Search size={35} style={{ opacity: 0.4 }} />
              <h3>No technologies found</h3>
              <p>Try another search or select a different category.</p>
              <Button onClick={() => {
                setSearch('');
                setActiveCategory('All Technologies');
              }}>
                Reset Filters
              </Button>
            </div>
          )}

          <p
            style={{
              textAlign: 'center',
              marginTop: '24px',
              opacity: 0.6,
              fontSize: '13px',
            }}
          >
            Showing {filteredTechnologies.length} technologies
          </p>
        </div>
      </section>

      {/* Architecture */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading
            id="arch-title"
            eyebrow={t('archEyebrow')}
            title={t('archTitle')}
            lead={t('archLead')}
            align="center"
          />

          <Reveal className="arch">
            {architecture.map((col) => (
              <div key={col.label} className="arch__col">
                <span className="arch__label">{col.label}</span>

                {col.nodes.map((node) => (
                  <div key={node.id} className="card arch__node">
                    <TechLogo id={node.id} />
                    <div>
                      <strong>{node.name}</strong>
                      <span>{node.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Supporting Tools */}
      <section className="section">
        <div className="container">
          <SectionHeading
            id="supporting-title"
            eyebrow="Supporting Tools"
            title="Beyond the Core Stack"
            lead="Our workflow combines specialised tools to deliver complete digital solutions."
          />

          <div className="grid grid--3">
            {supportingStack.map((group, index) => (
              <Reveal key={group.group} delay={index * 70}>
                <article
                  className="card stack-list"
                  style={{ height: '100%' }}
                >
                  <h3>{group.group}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p
              className="note"
              style={{ marginTop: 'var(--space-6)' }}
            >
              <Info size={16} aria-hidden="true" />
              Technology choices are made per project. We recommend
              the simplest stack that meets your requirements for
              performance, security and long-term maintenance.
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection
        title={t('ctaTitle')}
        text={t('ctaText')}
        secondary={{
          label: 'View Services',
          to: '/services/',
        }}
      />
    </>
  );
}
