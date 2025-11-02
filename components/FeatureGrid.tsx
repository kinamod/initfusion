'use client';

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
    <section
      style={{
        backgroundImage: 'linear-gradient(115.12deg, rgb(19, 123, 183), rgb(0, 68, 138))',
        color: 'rgb(255, 255, 255)',
        fontWeight: '400',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        display: 'flex',
        flexDirection: 'column',
        padding: '38px 0 75px',
      }}
    >
      <div
        style={{
          display: 'grid',
          fontWeight: '400',
          gap: '10px',
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
          gridTemplateAreas: `'myArea myTop myTop ' 'myArea . . '`,
          gridTemplateRows: '275px 275px',
          gridTemplateColumns: '50% 1fr 1fr',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {/* First card - featured image outside grid initially */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            height: '200px',
            gridArea: 'myArea',
          }}
        >
          <img
            loading="lazy"
            alt={cards[0].alt}
            src={cards[0].image}
            style={{
              fontWeight: '400',
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              gridArea: 'myArea',
              objectFit: 'cover',
              fontSize: '0px',
              backgroundImage: `url(${cards[0].image})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />
        </div>

        {/* Second card */}
        <article
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '8px',
            fontWeight: '400',
            gridArea: 'myTop',
            overflowWrap: 'break-word',
            overflowX: 'hidden',
            overflowY: 'hidden',
            wordWrap: 'break-word',
          }}
        >
          <div
            style={{
              fontWeight: '400',
              height: '265px',
              overflowWrap: 'break-word',
              overflowX: 'hidden',
              overflowY: 'hidden',
              position: 'relative',
              width: '100%',
              wordWrap: 'break-word',
            }}
          >
            <img
              loading="lazy"
              width="1280"
              height="720"
              alt={cards[1].alt}
              src={cards[1].image}
              style={{
                display: 'block',
                aspectRatio: 'auto 1280 / 720',
                fontWeight: '400',
                height: '100%',
                objectFit: 'cover',
                overflowWrap: 'break-word',
                transitionDuration: '0.25s',
                transitionProperty: 'transform',
                transitionTimingFunction: 'ease-in-out',
                width: '100%',
                wordWrap: 'break-word',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)',
              flexDirection: 'column',
              fontWeight: '400',
              height: '100%',
              justifyContent: 'flex-end',
              overflowWrap: 'break-word',
              position: 'relative',
              wordWrap: 'break-word',
              zIndex: '1',
              padding: '30px',
            }}
          >
            <div
              style={{
                marginBottom: '20px',
                maxWidth: '275px',
                overflowWrap: 'break-word',
                textTransform: 'uppercase',
                wordWrap: 'break-word',
                font: '700 20px/27px Ubuntu, sans-serif ',
              }}
            >
              {cards[1].title}
            </div>
            <div
              style={{
                fontWeight: '400',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
              }}
            >
              <a
                title={cards[1].linkText}
                href={cards[1].link}
                style={{
                  display: 'inline',
                  fontWeight: '700',
                  overflowWrap: 'break-word',
                  transitionDuration: '0.25s',
                  transitionProperty: 'opacity',
                  transitionTimingFunction: 'ease-in-out',
                  wordWrap: 'break-word',
                }}
              >
                {cards[1].linkText}
              </a>
            </div>
          </div>
        </article>

        {/* Third card */}
        <article
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '8px',
            fontWeight: '400',
            overflowWrap: 'break-word',
            overflowX: 'hidden',
            overflowY: 'hidden',
            wordWrap: 'break-word',
          }}
        >
          <div
            style={{
              fontWeight: '400',
              height: '265px',
              overflowWrap: 'break-word',
              overflowX: 'hidden',
              overflowY: 'hidden',
              position: 'relative',
              width: '100%',
              wordWrap: 'break-word',
            }}
          >
            <img
              loading="lazy"
              width="1280"
              height="720"
              alt={cards[2].alt}
              src={cards[2].image}
              style={{
                display: 'block',
                aspectRatio: 'auto 1280 / 720',
                fontWeight: '400',
                height: '100%',
                objectFit: 'cover',
                overflowWrap: 'break-word',
                transitionDuration: '0.25s',
                transitionProperty: 'transform',
                transitionTimingFunction: 'ease-in-out',
                width: '100%',
                wordWrap: 'break-word',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)',
              flexDirection: 'column',
              fontWeight: '400',
              height: '100%',
              justifyContent: 'flex-end',
              overflowWrap: 'break-word',
              position: 'relative',
              wordWrap: 'break-word',
              zIndex: '1',
              padding: '30px',
            }}
          >
            <div
              style={{
                marginBottom: '20px',
                maxWidth: '275px',
                overflowWrap: 'break-word',
                textTransform: 'uppercase',
                wordWrap: 'break-word',
                font: '700 20px/27px Ubuntu, sans-serif ',
              }}
            >
              360° overview of our Group that's shaping sustainable construction
            </div>
            <div
              style={{
                fontWeight: '400',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
              }}
            >
              <a
                title={cards[2].linkText}
                href={cards[2].link}
                style={{
                  display: 'inline',
                  fontWeight: '700',
                  overflowWrap: 'break-word',
                  transitionDuration: '0.25s',
                  transitionProperty: 'opacity',
                  transitionTimingFunction: 'ease-in-out',
                  wordWrap: 'break-word',
                }}
              >
                {cards[2].linkText}
              </a>
            </div>
          </div>
        </article>

        {/* Fourth card */}
        <article
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '8px',
            fontWeight: '400',
            overflowWrap: 'break-word',
            overflowX: 'hidden',
            overflowY: 'hidden',
            wordWrap: 'break-word',
          }}
        >
          <div
            style={{
              fontWeight: '400',
              height: '265px',
              overflowWrap: 'break-word',
              overflowX: 'hidden',
              overflowY: 'hidden',
              position: 'relative',
              width: '100%',
              wordWrap: 'break-word',
            }}
          >
            <img
              loading="lazy"
              width="800"
              height="490"
              alt={cards[3].alt}
              src={cards[3].image}
              style={{
                display: 'block',
                aspectRatio: 'auto 800 / 490',
                fontWeight: '400',
                height: '100%',
                objectFit: 'cover',
                overflowWrap: 'break-word',
                transitionDuration: '0.25s',
                transitionProperty: 'transform',
                transitionTimingFunction: 'ease-in-out',
                width: '100%',
                wordWrap: 'break-word',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)',
              flexDirection: 'column',
              fontWeight: '400',
              height: '100%',
              justifyContent: 'flex-end',
              overflowWrap: 'break-word',
              position: 'relative',
              wordWrap: 'break-word',
              zIndex: '1',
              padding: '30px',
            }}
          >
            <div
              style={{
                marginBottom: '20px',
                maxWidth: '275px',
                overflowWrap: 'break-word',
                textTransform: 'uppercase',
                wordWrap: 'break-word',
                font: '700 20px/27px Ubuntu, sans-serif ',
              }}
            >
              {cards[3].title}
            </div>
            <div
              style={{
                fontWeight: '400',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
              }}
            >
              <a
                title={cards[3].linkText}
                href={cards[3].link}
                style={{
                  display: 'inline',
                  fontWeight: '700',
                  overflowWrap: 'break-word',
                  transitionDuration: '0.25s',
                  transitionProperty: 'opacity',
                  transitionTimingFunction: 'ease-in-out',
                  wordWrap: 'break-word',
                }}
              >
                {cards[3].linkText}
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
