import { Link, useNavigation, useSearchParams } from "@remix-run/react";
import { useCallback } from "react";
import { Database } from "~/types/database.types";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

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
  const navigation = useNavigation();
  const [, setUrlSearchParams] = useSearchParams();
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
                  <div className="my-2 text-center ms-3">
                    <button
                      className={`interested rounded-full bg-white border border-gray-300 px-4 py-1 h-12 w-12 mb-2 ${
                        upVotedProposals.includes(proposal.id)
                          ? "has-voted"
                          : ""
                      }`}
                      disabled={navigation.state === "submitting"}
                      title={getUpvoteText(proposal.id)}
                      onClick={() => {
                        if (!userId) {
                          setUrlSearchParams((prevParams) => {
                            prevParams.set("action", "login");
                            return prevParams;
                          });
                        } else {
                          handleUpvoteChange(proposal.id);
                        }
                      }}
                    >
                      {navigation.state === "submitting" ? (
                        <ArrowPathIcon className="animate-spin" />
                      ) : (
                        <span className="interested-arrow leading-none">▲</span>
                      )}
                    </button>
                    <div className="interested-count leading-none">
                      {proposal.proposal_upvotes[0].count}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14 mb-5 text-center">
          <Link
            className="bg-orange-500 inline-flex items-center justify-center rounded-full border border-transparent px-6 py-4 text-base font-medium text-white transition hover:bg-orange-700 focus-visible:outline"
            to="/submit-proposal"
          >
            Submit your Proposal
          </Link>
        </div>
      </div>
    </div>
  );
}
