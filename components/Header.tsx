'use client';

import React, { useState } from 'react';
import { Flex, Box, Link, Button, Text } from '@radix-ui/themes';
import { useTheme } from 'next-themes';
import styles from './Header.module.css';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  card?: {
    title: string;
    description: string;
    image?: string;
  };
}

const navigationLeft: NavItem[] = [
  {
    label: 'Group',
    href: '/en/group',
    children: [
      { label: 'Who are we?', href: '/en/group/who-are-we' },
      { label: 'Our Purpose', href: '/en/group/our-purpose' },
      { label: 'Our strategic plan', href: '/en/group/lead-grow-our-strategic-plan' },
      { label: 'Innovative company', href: '/en/innovation' },
      { label: 'Corporate Governance', href: '/en/group/corporate-governance' },
      { label: 'Ethics and compliance', href: '/en/corporate-responsibility/our-pillars/business-ethics' },
      { label: 'Our brands', href: '/en/group/our-brands' },
      { label: 'Saint-Gobain worldwide', href: '/en/group/saint-gobain-worldwide' },
      { label: 'Our history', href: '/en/group/our-history' },
      { label: 'Our foundation', href: '/en/our-foundation-our-philanthropic-actions' },
    ],
  },
  {
    label: 'Solutions',
    href: '/en/solutions',
    children: [
      { label: 'OUR MARKETS', href: '/en/our-solutions/solutions/our-markets' },
      { label: 'OUR BRANDS', href: '/en/group/our-brands' },
      { label: 'Our expertise', href: '/en/solutions/our-expertise' },
      { label: 'Our solution-based approach', href: '/en/solutions/our-solution-based-approach' },
      { label: 'Zoom on light construction', href: '/en/solutions/zoom-light-construction' },
    ],
  },
  {
    label: 'Sustainability',
    href: '/en/corporate-responsibility',
    children: [
      { label: 'Sustainable Development Goals (SDGS)', href: '/en/sustainability/sustainable-development-goals-sdgs' },
      { label: 'Our Pillars of Commitments', href: '/en/corporate-responsibility/our-pillars' },
      { label: 'Our foundation, our philanthropic actions', href: '/en/our-foundation-our-philanthropic-actions' },
      { label: 'Resource Center', href: '/en/corporate-responsibility/resource-center' },
      { label: 'CSR indicators and significant events', href: '/en/news/csr-indicators-and-significant-events' },
    ],
  },
  {
    label: 'Observatory',
    href: '/en/sustainable-construction-observatory',
  },
];

const navigationRight: NavItem[] = [
  {
    label: 'Finance',
    href: '/en/finance',
    children: [
      { label: 'Saint-Gobain in figures', href: '/en/finance/saint-gobain-figures' },
      { label: 'Financial results', href: '/en/finance/financial-results' },
      { label: 'Events', href: '/en/finance/financial-events' },
      { label: 'Investor days', href: '/en/finance/investor-days' },
      { label: 'Ownership structure', href: '/en/finance/ownership-structure' },
      { label: 'Individual Shareholders', href: '/en/individual-shareholders' },
      { label: 'General Meeting', href: '/en/finance/general-meeting' },
      { label: 'Participating stocks', href: '/en/finance/participating-stocks' },
      { label: 'Stock information', href: '/en/finance/stock-information' },
      { label: 'Bond Financings', href: '/en/finance/bond-financings' },
      { label: 'Regulated information', href: '/en/finance/regulated-information' },
      { label: 'Agenda', href: '/en/finance/events-and-financial-results/calendar' },
    ],
  },
  {
    label: 'Careers',
    href: '/en/careers',
    children: [
      { label: 'The Saint-Gobain Experience', href: '/en/careers/life-saint-gobain' },
      { label: 'Our commitments', href: '/en/careers/our-commitments' },
      { label: 'Our professions', href: '/en/careers/our-professions' },
      { label: 'Your evolution', href: '/en/careers/career-development-and-international-mobility' },
      { label: 'Our job offers', href: 'https://joinus.saint-gobain.com/en' },
      { label: 'Internship, Work-study & V.I.E', href: '/en/students-trainees-work-experience-vie' },
      { label: 'Our tips', href: '/en/careers/guidelines-apply' },
    ],
  },
  {
    label: 'Media',
    href: '/en/media',
    children: [
      { label: 'Press releases', href: '/en/press/press-releases' },
      { label: 'Press contact', href: '/en/press/press-contact' },
      { label: 'News', href: '/en/saint-gobain-news/saint-gobain-live' },
      { label: 'Financial Calendar', href: '/en/press/calendar-of-events' },
      { label: 'Corporate publications', href: '/en/press/corporate-publications' },
      { label: 'Tribunes', href: '/en/linkedin-tribunes-saint-gobain' },
      { label: 'Interviews', href: '/en/articles/scoopit/saint-gobain-interviews' },
      { label: 'Our campaigns', href: '/en/media/our-campaigns' },
    ],
  },
];

const NavigationItem: React.FC<{ item: NavItem; isSecondary?: boolean }> = ({ item, isSecondary = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles['nav-item']} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <Link href={item.href} className={styles['nav-link']}>
        {item.label}
      </Link>
      {item.children && (
        <>
          <button
            className={styles['expand-button']}
            onClick={() => setIsOpen(!isOpen)}
            aria-hidden="true"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {isOpen && (
            <div className={styles['submenu-container']}>
              <div className={styles['submenu-content']}>
                <ul className={styles['submenu-list']}>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href} className={styles['submenu-link']}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className={styles['header']}>
      <div className={styles['header-top']}>
        <div className={styles['container']}>
          <div className={styles['header-top-left']}>
            <ul className={styles['top-links']}>
              <li><Link href="#accessibility">Adapt the display</Link></li>
              <li><Link href="/en/contact">Contact</Link></li>
              <li><Link href="/en/group/saint-gobain-worldwide">Saint-Gobain in the world</Link></li>
            </ul>
          </div>
          <div className={styles['header-top-right']}>
            <div className={styles['stock-info']}>
              <span className={styles['stock-price']}>83.96 €</span>
              <span className={styles['stock-change']}>- 3.72%</span>
              <span className={styles['stock-time']}>12:35</span>
              <span className={styles['stock-location']}>(Paris)</span>
            </div>
            <div className={styles['theme-toggle']}>
              <button
                className={`${styles['theme-button']} ${styles['light']}`}
                onClick={() => setTheme('light')}
                aria-label="Enable light mode"
              />
              <label className={styles['checkbox-label']}>
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                  className={styles['theme-checkbox']}
                />
                <span>Dark Mode</span>
              </label>
              <button
                className={`${styles['theme-button']} ${styles['dark']}`}
                onClick={() => setTheme('dark')}
                aria-label="Enable dark mode"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles['header-bottom']}>
        <div className={styles['container']}>
          <nav className={styles['navbar-left']}>
            {navigationLeft.map((item) => (
              <NavigationItem key={item.href} item={item} />
            ))}
          </nav>

          <div className={styles['logo-wrapper']}>
            <Link href="/en" className={styles['logo-link']}>
              <svg width="146" height="61" viewBox="0 0 45.74491 19.415368" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sg-gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#54b6ae" />
                    <stop offset="0.1" stopColor="#54b6ae" />
                    <stop offset="0.3" stopColor="#3b98da" />
                    <stop offset="0.42" stopColor="#254a9a" />
                    <stop offset="0.55" stopColor="#ed1443" />
                    <stop offset="0.84" stopColor="#f25c19" />
                    <stop offset="1" stopColor="#f25c19" />
                  </linearGradient>
                </defs>
                <text x="5" y="15" fill="url(#sg-gradient)" fontSize="14" fontWeight="bold">
                  Saint-Gobain
                </text>
              </svg>
            </Link>
          </div>

          <nav className={styles['navbar-right']}>
            {navigationRight.map((item) => (
              <NavigationItem key={item.href} item={item} isSecondary />
            ))}
          </nav>

          <button className={styles['search-button']} aria-label="Search">
            🔍
          </button>
        </div>
      </div>
    </header>
  );
}
