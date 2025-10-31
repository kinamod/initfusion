'use client';

import styles from './FeatureGridAlt.module.css';

export function FeatureGridAlt() {
  return (
    <div className={styles.grid}>
      {/* First card - Large */}
      <div className={styles.cardWrapper}>
        <div className={styles.cardContainer}>
          <div className={styles.cardInner}>
            <div className={styles.imageWrapper}>
              <img
                loading="lazy"
                width="432"
                height="384"
                alt="360"
                src="https://www.saint-gobain.com/sites/saint-gobain.com/files/styles/16_10_crop/public/media/image/2025-02/360-Saint-Gobain.webp?itok=fgU1rd9R"
              />
            </div>
            <div className={styles.linkWrapper}>
              <a
                title="360 Years Young"
                href="https://www.saint-gobain.com/en/360-years"
              >
                360 Years Young
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Second card */}
      <div className={styles.cardWrapperSmall}>
        <div className={styles.cardContainer}>
          <div className={styles.cardInner}>
            <div className={styles.cardImageContainer}>
              <div className={styles.imageWrapper}>
                <img
                  loading="lazy"
                  width="1280"
                  height="720"
                  alt="Lead & Grow"
                  src="https://www.saint-gobain.com/sites/saint-gobain.com/files/styles/16_10_crop/public/media/image/2025-10/website%20_2_1920x1080%403x.webp?itok=nEJOu5Wk"
                />
              </div>
            </div>
            <div className={styles.cardTitleWrapper}>
              <p className={styles.cardTitle}>Lead & Grow : our strategic plan</p>
            </div>
            <div className={styles.linkWrapper}>
              <a
                title="Lead & Grow : our strategic plan"
                href="https://www.saint-gobain.com/en/group/lead-grow-our-strategic-plan"
              >
                Lead & Grow : our strategic plan
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Third card */}
      <div className={styles.cardWrapperSmall}>
        <div className={styles.cardContainer}>
          <div className={styles.cardInner}>
            <div className={styles.cardImageContainer}>
              <div className={styles.imageWrapper}>
                <img
                  loading="lazy"
                  width="1280"
                  height="720"
                  alt="cover 360 manifesto"
                  src="https://www.saint-gobain.com/sites/saint-gobain.com/files/styles/16_10_crop/public/media/image/2025-01/Cover%20360%20Manifesto%20Film.webp?itok=ofd5EKn9"
                />
              </div>
            </div>
            <div className={styles.cardTitleWrapper}>
              <h2 className={styles.heading}>
                360° overview of our Group that's shaping sustainable construction
              </h2>
            </div>
            <div className={styles.cardDescWrapper}>
              <p className={styles.cardDesc}>
                360° overview of our Group that's shaping sustainable construction
              </p>
            </div>
            <div className={styles.linkWrapper}>
              <a
                title="Our solutions for sustainable construction"
                href="https://www.saint-gobain.com/en/solutions"
              >
                Our solutions for sustainable construction
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Fourth card */}
      <div className={styles.cardWrapperSmall}>
        <div className={styles.cardContainer}>
          <div className={styles.cardInner}>
            <div className={styles.cardImageContainer}>
              <div className={styles.imageWrapper}>
                <img
                  loading="lazy"
                  width="800"
                  height="490"
                  alt="Observatoire-Construction-Durable"
                  src="https://www.saint-gobain.com/sites/saint-gobain.com/files/styles/16_10_crop/public/media/image/2025-10/Observatoire-Construction-Durable-logo-VA-HP.webp?itok=EKnoe21C"
                />
              </div>
            </div>
            <div className={styles.cardTitleWrapper}>
              <h2 className={styles.heading}>The Sustainable Construction Observatory</h2>
            </div>
            <div className={styles.linkWrapper}>
              <a
                title="Sustainable Construction Observatory"
                href="https://www.saint-gobain.com/en/sustainable-construction-observatory"
              >
                Sustainable Construction Observatory
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
