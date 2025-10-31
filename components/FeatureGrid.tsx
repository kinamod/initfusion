'use client';

import styles from './FeatureGrid.module.css';

interface FeatureCard {
  image: string;
  title: string;
  link: string;
  linkText: string;
  alt: string;
}

export function FeatureGrid() {
  const cards: FeatureCard[] = [
    {
      image: 'https://www.saint-gobain.com/sites/saint-gobain.com/files/styles/16_10_crop/public/media/image/2025-02/360-Saint-Gobain.webp?itok=fgU1rd9R',
      title: '360 Years Young',
      link: 'https://www.saint-gobain.com/en/360-years',
      linkText: '360 Years Young',
      alt: '360'
    },
    {
      image: 'https://www.saint-gobain.com/sites/saint-gobain.com/files/styles/16_10_crop/public/media/image/2025-10/website%20_2_1920x1080%403x.webp?itok=nEJOu5Wk',
      title: 'Lead & Grow : our strategic plan',
      link: 'https://www.saint-gobain.com/en/group/lead-grow-our-strategic-plan',
      linkText: 'Lead & Grow : our strategic plan',
      alt: 'Lead & Grow'
    },
    {
      image: 'https://www.saint-gobain.com/sites/saint-gobain.com/files/styles/16_10_crop/public/media/image/2025-01/Cover%20360%20Manifesto%20Film.webp?itok=ofd5EKn9',
      title: "360° overview of our Group that's shaping sustainable construction",
      link: 'https://www.saint-gobain.com/en/solutions',
      linkText: 'Our solutions for sustainable construction',
      alt: 'cover 360 manifesto'
    },
    {
      image: 'https://www.saint-gobain.com/sites/saint-gobain.com/files/styles/16_10_crop/public/media/image/2025-10/Observatoire-Construction-Durable-logo-VA-HP.webp?itok=EKnoe21C',
      title: 'The Sustainable Construction Observatory',
      link: 'https://www.saint-gobain.com/en/sustainable-construction-observatory',
      linkText: 'Sustainable Construction Observatory',
      alt: 'Observatoire-Construction-Durable'
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Featured large card */}
          <article className={`${styles.card} ${styles.cardLarge}`}>
            <img
              loading="lazy"
              alt={cards[0].alt}
              src={cards[0].image}
            />
          </article>

          {/* Second card */}
          <article className={`${styles.card} ${styles.cardSmall}`}>
            <div className={styles.cardImage}>
              <img
                loading="lazy"
                width="1280"
                height="720"
                alt={cards[1].alt}
                src={cards[1].image}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{cards[1].title}</h3>
              <div className={styles.cardLink}>
                <a href={cards[1].link} title={cards[1].linkText}>
                  {cards[1].linkText}
                </a>
              </div>
            </div>
          </article>

          {/* Third card */}
          <article className={`${styles.card} ${styles.cardSmall}`}>
            <div className={styles.cardImage}>
              <img
                loading="lazy"
                width="1280"
                height="720"
                alt={cards[2].alt}
                src={cards[2].image}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{cards[2].title}</h3>
              <div className={styles.cardLink}>
                <a href={cards[2].link} title={cards[2].linkText}>
                  {cards[2].linkText}
                </a>
              </div>
            </div>
          </article>

          {/* Fourth card */}
          <article className={`${styles.card} ${styles.cardSmall}`}>
            <div className={styles.cardImage}>
              <img
                loading="lazy"
                width="800"
                height="490"
                alt={cards[3].alt}
                src={cards[3].image}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{cards[3].title}</h3>
              <div className={styles.cardLink}>
                <a href={cards[3].link} title={cards[3].linkText}>
                  {cards[3].linkText}
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
