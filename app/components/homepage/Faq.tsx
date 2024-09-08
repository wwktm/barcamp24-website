import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { ReactNode } from "react";

const faqs: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "What is BarCamp Kathmandu?",
    answer: (
      <p>
        BarCamp Kathmandu is an unconference - an ad hoc gathering born from the
        desire for people to share and learn in an open environment. The focus
        of the event is <strong>sharing ideas</strong>
      </p>
    ),
  },
  {
    question: "Wait, what is an unconference?",
    answer: (
      <>
        <p>
          An unconference is a gathering for attendees <em>by the attendees</em>
          . This means, You decide what to talk about and what talks to listen
          to. You are the attendee, you are the speaker.
        </p>
        <p>
          Unconferences do not have speaker list or a fixed schedule until the
          actual event date. The sessions are around a variety of topics, and
          the day is created collaboratively - built by you and the other
          attendees who have a topic, story, knowledge, or experience to share
          with the rest of the community.
        </p>
      </>
    ),
  },
  {
    question: "Who should attend BarCamp Kathmandu?",
    answer: (
      <p>
        Everyone. Session categories range from technology, music, arts,
        lifestyle, fitness, to design, arts, philosophy. So, yeah, we do really
        mean <strong>everyone</strong> can attend
      </p>
    ),
  },
  {
    question: "How can I stay updated on the event details?",
    answer: (
      <p>
        Please follow us on{" "}
        <a
          href="https://x.com/weekend_web"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter / X
        </a>{" "}
        to keep up with our announcements{" "}
      </p>
    ),
  },
  {
    question: "Can I present at the BarCamp? What topics can I cover?",
    answer: (
      <p>
        Yes you can!
        <br />
        Giving a session is a{" "}
        <strong>
          perfect opportunity to speak about that cool topic you are interested
          in
        </strong>
        : whether it be about your unique take on Fitness and Art, about that
        cool use case for AI you discovered, or about the rabbit hole you went
        down last year about Nepali traditional <em>Dhunge dharas</em>. If
        you&apos;re interested,{" "}
        <Link to="/submit-proposal">please submit a proposal!</Link>
      </p>
    ),
  },
  {
    question: "How are topics chosen?",
    answer: (
      <>
        <p>
          Most session topics are scheduled the morning of the event and are
          provided by the attendees.
        </p>
        <p>
          Speakers can also submit proposals before the day of the event and
          attendees can upvote to indicate your interest in the talk. (if you
          plan to give a talk, we highly encourage you to{" "}
          <Link to="/submit-proposal">submit a proposal!</Link>)
        </p>
        <p>
          The idea however, is that there will be large amounts of open space in
          the calendar in the morning of the event, and if someone wants to give
          a talk on the day of the event, they will have space and time to do so
        </p>
        <p>
          If you&apos;re at the conference and there is no session that
          interests you, recognize that this is <em>your conference</em>! So,
          please go ahead and have a impromptu session in the open spaces at the
          venue.
        </p>
      </>
    ),
  },
  {
    question: "Does BarCamp have something to do with bars and alcohol?",
    answer: (
      <p>
        <strong>No, it doesn&apos;t.</strong> Its actually a hacker reference to
        FooBar which is typically used as a placeholder name when describing
        something in software code. BarCamp arose as an open to the public
        alternative to Foo Camp, which is an invitation-only conference.
      </p>
    ),
  },
  {
    question: "Who is organizing this?",
    answer: (
      <p>
        Well, this is an unconference, so all attendees (yes, YOU!) will play an
        important role in organizing it, selecting talks, etc. But, the event
        will be managed by the team behind Web Weekend Kathmandu.
      </p>
    ),
  },
];

export default function Faq() {
  return (
    <div id="faq" className="py-14">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <h2 className="sm:text-3xl text-3xl font-bold mb-12 text-center">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-8 divide-y divide-gray-300">
            {faqs.map((faq) => (
              <Disclosure key={faq.question} as="div" className="pt-6">
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-black">
                    <span className="text-lg font-semibold leading-7">
                      {faq.question}
                    </span>
                    <span className="ml-6 flex h-7 items-center">
                      <PlusIcon
                        aria-hidden="true"
                        className="h-6 w-6 group-data-[open]:hidden"
                      />
                      <MinusIcon
                        aria-hidden="true"
                        className="h-6 w-6 [.group:not([data-open])_&]:hidden"
                      />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-2 pr-12">
                  <div className="flex flex-col gap-3 text-base leading-7 text-gray-800 ">
                    {faq.answer}
                  </div>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
