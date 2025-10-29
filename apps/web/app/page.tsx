import Image from "next/image";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem",
        textAlign: "center",
        gap: "2rem"
      }}
    >
      <div
        style={{
          maxWidth: "50rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.75rem, 4vw, 3.5rem)",
            lineHeight: 1.05,
            margin: 0,
            color: "#0b3d2e",
            textTransform: "uppercase",
            letterSpacing: "0.08em"
          }}
        >
          Exporting Nature Without Borders
        </h1>
        <p
          style={{
            fontSize: "1.15rem",
            lineHeight: 1.6,
            margin: 0,
            color: "#1f2933"
          }}
        >
          Forestal Murillo Tejada connects the ancestral ethnobotanical heritage of Honduras with the world. Explore batana oil,
          melipona honey, and traditional herbs crafted alongside indigenous communities with full traceability.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
          gap: "1.5rem",
          width: "min(60rem, 100%)"
        }}
      >
        {[
          {
            title: "Batana Oil",
            description: "Ancestral Miskito elixir for hair, skin, and beard care.",
            image: "/images/batana-placeholder.svg",
            alt: "Stylized gradient background representing batana oil"
          },
          {
            title: "Melipona Honey",
            description: "Raw stingless bee honey treasured by the Mayans.",
            image: "/images/melipona-placeholder.svg",
            alt: "Amber gradient background symbolizing melipona honey"
          },
          {
            title: "Traditional Herbs",
            description: "Wildcrafted botanicals preserving sacred Honduran wisdom.",
            image: "/images/herbs-placeholder.svg",
            alt: "Green gradient background suggesting Honduran traditional herbs"
          }
        ].map((item) => (
          <article
            key={item.title}
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "1.5rem",
              padding: "1.5rem",
              boxShadow: "0 18px 36px rgba(31, 41, 51, 0.12)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              border: "1px solid rgba(19, 111, 73, 0.12)"
            }}
          >
            <div
              style={{
                width: "100%",
                position: "relative",
                aspectRatio: "4 / 3",
                borderRadius: "1rem",
                overflow: "hidden",
                background: "#e7e2d5"
              }}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  objectFit: "cover",
                  filter: "grayscale(100%)",
                  opacity: 0.4
                }}
              />
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.25rem",
                color: "#0b3d2e"
              }}
            >
              {item.title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "1rem",
                lineHeight: 1.5,
                color: "#425466"
              }}
            >
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
