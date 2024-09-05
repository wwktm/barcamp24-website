import { Link } from "@remix-run/react";
import { useCallback } from "react";
import { Database } from "~/types/database.types";

export default function Proposals({
  proposals,
  userId,
  upVotedProposals,
  handleUpvoteChange,
}: {
  proposals: Database["public"]["Tables"]["proposals"]["Row"][];
  upVotedProposals: number[];
  userId?: string;
  handleUpvoteChange: (proposaslId: number) => void;
}) {
  const getUpvoteText = useCallback(
    (currentProposalId: number) => {
      if (!userId) return "Please login to upvote";

      if (upVotedProposals?.includes(currentProposalId)) return "Upvoted";

      return "Upvote";
    },
    [userId, upVotedProposals]
  );

  return (
    <div className="proposals py-12">
      <div className="container">
        <h2 className="sm:text-2xl text-2xl font-bold mb-6">
          Suggested Proposals
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 my-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="proposal relative rounded-lg border border-gray-300 bg-white px-3 py-5 shadow-sm  hover:border-gray-300"
            >
              <div className="flex items-start justify-between ">
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
                <div className="">
                  <h3 className="text-base font-semibold mb-2">
                    {proposal.title}
                  </h3>
                  <div className="mb-3 text-sm font-medium">
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
                <button
                  className={`interested rounded-full p-0 bg-gray-100 h-12 w-12 ms-3${
                    upVotedProposals.includes(proposal.id) ? "has-voted" : ""
                  }`}
                  disabled={!userId}
                  title={getUpvoteText(proposal.id)}
                  onClick={() => {
                    if (!userId) return;
                    handleUpvoteChange(proposal.id);
                  }}
                >
                  <div className="interested-arrow">▲</div>
                  <div className="interested-count">{proposal.upvotes}</div>
                </button>
              </div>
            </div>
          ))}
          <div className="mt-10 mb-5">
            <Link
              className="bg-orange-500 inline-flex items-center justify-center rounded-full border border-transparent px-6 py-4 text-base font-medium text-white transition hover:bg-orange-700 focus-visible:outline"
              to="/request-proposal"
            >
              Submit your Proposal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
