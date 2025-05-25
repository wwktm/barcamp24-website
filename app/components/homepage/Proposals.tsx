import { useState } from "react";
import { Link } from "@remix-run/react";

import { Database } from "~/types/database.types";
import ProposalDetail from "./ProposalDetail";
import Speakers from "../common/Speakers";

export default function Proposals({
  proposals,
}: {
  proposals: Database["public"]["Tables"]["proposals"]["Row"][];
}) {
  const [proposalDetail, setProposalDetail] = useState<
    Database["public"]["Tables"]["proposals"]["Row"] | undefined
  >();

  return (
    <div className="proposals py-12">
      <ProposalDetail
        proposalDetail={proposalDetail}
        setProposalDetail={setProposalDetail}
      />
      <div className="container">
        <h2 className="sm:text-3xl text-3xl font-bold mb-12 text-center">
          Suggested Proposals
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 my-8">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="flex flex-col gap-3 justify-between proposal relative rounded-xl border-1 border-gray-300 bg-white px-6 py-6 shadow-sm border border-gray-100 hover:border-gray-300"
            >
              <button
                className="text-left"
                onClick={(e) => {
                  e.preventDefault();
                  setProposalDetail(proposal);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="">
                    <h3 className="text-xl font-semibold mb-2 capitalize">
                      <button
                        className="text-left"
                        onClick={(e) => {
                          e.preventDefault();
                          setProposalDetail(proposal);
                        }}
                      >
                        {proposal.title}
                      </button>
                    </h3>
                    <div className="tags">
                      {proposal.tags
                        .sort(() => 0.5 - Math.random()) // Shuffle
                        .slice(0, 3)
                        .map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </button>
              {proposal.speakers && <Speakers speakers={proposal.speakers} />}
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
