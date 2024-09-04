import { Link } from "@remix-run/react";
import { Database } from "~/types/database.types";

export default function Proposals({
  proposals,
}: {
  proposals: Database["public"]["Tables"]["proposals"]["Row"][];
}) {
  return (
    <div className="proposals">
      <main className="container">
        <h2 className="text-3xl font-bold mb-7">Suggested Proposals</h2>
        {proposals.map((proposal) => (
          <div key={proposal.id} className="proposal">
            <div className="flex">
              {proposal.speakers && (
                <div
                  className={
                    proposal.speakers.length > 1 ? "avatars" : "avatar"
                  }
                >
                  {Array.isArray(proposal.speakers) &&
                    proposal.speakers.map((speaker) => (
                      <img
                        key={speaker.name}
                        src={speaker.photoUrl}
                        alt={speaker.name}
                      />
                    ))}
                </div>
              )}
              <div className="flex grow flex-col">
                <h3>{proposal.title}</h3>
                <div>
                  Proposal by{" "}
                  {proposal.speakers.map((speaker, index) => (
                    <span key={speaker.name}>
                      <a
                        href={speaker.profileLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {speaker.name}
                      </a>
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
                <div className="interested-count">{proposal.upvotes}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-5 mb-5 text-center">
          <Link className="rounded-button" to="/request-proposal">
            Submit your Proposal
          </Link>
        </div>
      </main>
    </div>
  );
}
