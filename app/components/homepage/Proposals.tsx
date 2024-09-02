import { useState, useEffect } from "react";

interface Speaker {
  name: string;
  avatar: string;
  link: string;
}

interface Proposal {
  id: number;
  title: string;
  speakers: Speaker[];
  tags: string[];
  interestedCount: number;
}

const proposalsData: Proposal[] = [
  {
    id: 1,
    title: "Rammed earth technology and impact of climate change",
    speakers: [
      {
        name: "Narayan Acharya",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfK7hNMWPxVymdUKcKrjNBDxlXyvom8XjCNQ&s",
        link: "#",
      },
    ],
    tags: ["Sustainability", "Climate Change"],
    interestedCount: 75,
  },
  {
    id: 2,
    title: "Murphyjitsu - how to get work done under uncertainty",
    speakers: [
      {
        name: "Baibhav Bista",
        avatar:
          "https://pbs.twimg.com/profile_images/1751983430496337920/Xl80qYh5_400x400.jpg",
        link: "#",
      },
    ],
    tags: ["Uncertainty", "Productivity", "Work"],
    interestedCount: 33,
  },
  {
    id: 3,
    title: "How can software engineers be better (colleges and beyond)",
    speakers: [
      {
        name: "Topraj Gurung",
        avatar: "https://www.tejcenter.org/images/topraj_gurung.jpeg",
        link: "#",
      },
      {
        name: "Rushil Shakya",
        avatar: "https://www.tejcenter.org/images/rushil-shakya.jpeg",
        link: "#",
      },
    ],
    tags: ["Education", "Bootcamp", "Impact"],
    interestedCount: 42,
  },
  // ... add more proposals as needed
];

export default function Proposals() {
  const [shuffledProposals, setShuffledProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    const shuffleProposals = () => {
      const shuffled = [...proposalsData].sort(() => Math.random() - 0.5);
      setShuffledProposals(shuffled);
    };
    shuffleProposals();
  }, []);

  return (
    <div className="proposals">
      <main className="container">
        <h2 className="text-3xl font-bold mb-7">Suggested Proposals</h2>
        {shuffledProposals.map((proposal) => (
          <div key={proposal.id} className="proposal">
            <div className="flex">
              <div
                className={proposal.speakers.length > 1 ? "avatars" : "avatar"}
              >
                {proposal.speakers.map((speaker) => (
                  <img
                    key={speaker.name}
                    src={speaker.avatar}
                    alt={speaker.name}
                  />
                ))}
              </div>
              <div className="flex grow flex-col">
                <h3>{proposal.title}</h3>
                <div>
                  Proposal by{" "}
                  {proposal.speakers.map((speaker, index) => (
                    <span key={speaker.name}>
                      <a href={speaker.link}>{speaker.name}</a>
                      {index < proposal.speakers.length - 1 && (
                        <span> and </span>
                      )}
                    </span>
                  ))}
                </div>
                <div className="tags">
                  {proposal.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="interested">
                <div className="interested-arrow">▲</div>
                <div className="interested-count">
                  {proposal.interestedCount}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-5 mb-5 text-center">
          <a
            className="rounded-button"
            href="https://forms.gle/x4kEuvwEoJ5qsP3y7"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Submit your proposal</strong>
          </a>
        </div>
      </main>
    </div>
  );
}
