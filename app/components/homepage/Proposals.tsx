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
        <h2 className="sm:text-3xl text-3xl font-bold mb-12 text-center">
          Suggested Proposals
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 my-8">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="proposal relative rounded-xl border-2 border-gray-300 bg-white px-6 py-6 shadow-sm  hover:border-gray-300"
            >
              <div className=" ">
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
                <div className="flex items-start justify-between">
                  <div className="my-4">
                    <h3 className="text-xl font-semibold mb-4">
                      {proposal.title}
                    </h3>
                    <div className="mb-4 text-xs font-medium text-gray-900">
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
                  <div className="my-2">
                    <button
                      className={`interested rounded-full p-0 h-12 w-12 ms-3${
                        upVotedProposals.includes(proposal.id)
                          ? "has-voted"
                          : ""
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
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14 mb-5 text-center">
          <Link
            className="bg-orange-500 inline-flex items-center justify-center rounded-full border border-transparent px-6 py-4 text-base font-medium text-white transition hover:bg-orange-700 focus-visible:outline"
            to="/request-proposal"
          >
            Submit your Proposal
          </Link>
        </div>
      </div>
    </div>
  );
}
