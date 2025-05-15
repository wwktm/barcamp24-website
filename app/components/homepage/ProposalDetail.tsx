import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import { Database } from "~/types/database.types";

export default function ProposalDetail({
  proposalDetail,
  setProposalDetail,
}: {
  proposalDetail: Database["public"]["Tables"]["proposals"]["Row"] | undefined;
  setProposalDetail: Dispatch<
    SetStateAction<Database["public"]["Tables"]["proposals"]["Row"] | undefined>
  >;
}) {
  if (!proposalDetail) return null;

  return (
    <Dialog
      open={!!proposalDetail}
      onClose={() => setProposalDetail(undefined)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <div
                  key={proposalDetail.id}
                  className="proposal relative flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2">
                    <div>
                      {proposalDetail.speakers && (
                        <div
                          className={
                            proposalDetail.speakers.length > 1
                              ? "avatars"
                              : "avatar"
                          }
                        >
                          {Array.isArray(proposalDetail.speakers) &&
                            proposalDetail.speakers.map((speaker) => (
                              <img
                                key={speaker.name}
                                src={speaker.photoUrl}
                                alt={speaker.name}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        {proposalDetail.title}
                      </DialogTitle>
                      <div className="mb-4 text-xs font-medium text-gray-900">
                        Proposal by{" "}
                        {proposalDetail.speakers.map((speaker, index) => (
                          <span key={speaker.name}>
                            <a
                              href={speaker.profileLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {speaker.name}
                            </a>
                            {index < proposalDetail.speakers.length - 1 && (
                              <span> and </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">
                    {proposalDetail?.speakers?.[0]?.introduction}
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="tags">
                      {proposalDetail.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm">{proposalDetail.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
