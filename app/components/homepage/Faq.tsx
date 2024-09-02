import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const faqs: Array<{ question: string; answer: string }> = [
  {
    question: "What is Barcamp Kathmandu?",
    answer:
      "Barcamp Kathmandu is an unconference - an ad hoc gathering born from the desire for people to share and learn in an open environment.",
  },
  {
    question: "Who should attend BarCamp?",
    answer: "Everyone. Barcamp Kathmandu is open to the community.",
  },
  {
    question: "How are topics chosen?",
    answer:
      "Most session topics are scheduled the morning of the event and are provided by the attendees.",
  },
  {
    question: "Does BarCamp have something to do with bars and alcohol?",
    answer:
      "No, it doesn't. Its actually a hacker reference to FooBar which is typically used as a placeholder name when describing something in software code. BarCamp arose as an open to the public alternative to Foo Camp, which is an invitation-only conference.",
  },
];

export default function Faq() {
  return (
    <div className="my-10">
      <div className="container">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure key={faq.question} as="div" className="pt-6">
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                    <span className="text-base font-semibold leading-7">
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
                  <p className="text-base leading-7 text-gray-600">
                    {faq.answer}
                  </p>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
