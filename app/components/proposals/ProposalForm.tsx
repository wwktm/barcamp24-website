import { useCallback, useEffect, useRef, useState } from "react";
import { Form, useNavigation } from "@remix-run/react";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Select,
  Textarea,
  RadioGroup,
  Radio,
} from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

export interface SpeakerProfile {
  name: string;
  photoUrl: string;
  profileLink: string;
  introduction?: string;
}

const initalSpeakersValue: SpeakerProfile[] = [
  { name: "", photoUrl: "", profileLink: "", introduction: "" },
];

const sessionCategories = [
  "Information Technology",
  "Music",
  "Design",
  "Arts",
  "Philosophy",
  "Life and Lifestyle",
  "AI",
  "Blockchain",
  "Futuristic",
  "Nostalgia",
  "Standup Comedy",
  "Deep Dive",
  "Education and Training",
  "Health and Fitness",
  "Other",
];

export default function ProposalForm({
  isSuccess,
  hasError,
}: {
  isSuccess?: boolean;
  hasError?: boolean;
}) {
  const form = useRef<HTMLFormElement>(null);
  const navigation = useNavigation();

  const [speakers, setSpeakers] =
    useState<SpeakerProfile[]>(initalSpeakersValue);

  const [sessionCategory, setSessionCategory] = useState<string>();

  const addSpeaker = () => {
    setSpeakers([...speakers, { name: "", photoUrl: "", profileLink: "" }]);
  };

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  const handleSpeakerChange = (
    index: number,
    field: keyof SpeakerProfile,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedSpeakers = speakers.map((speaker, i) =>
      i === index ? { ...speaker, [field]: event.target.value } : speaker
    );
    setSpeakers(updatedSpeakers);
  };

  useEffect(() => {
    if (isSuccess) {
      form.current?.reset();
      form.current?.scrollIntoView();
      setSpeakers(initalSpeakersValue);
      setSessionCategory(undefined);
    }
  }, [isSuccess]);

  const getSubmitButtonText = useCallback(() => {
    if (isSuccess) return "Submitted";

    if (navigation.state === "submitting") return "Submitting...";

    return "Submit";
  }, [isSuccess, navigation.state]);

  return (
    <div className="container my-20">
      <p className="max-w-3xl m-auto mt-2 p-4 text-lg">
        <ul className="flex flex-col gap-6 ml-3 list-disc">
          <li>
            BarCamp Kathmandu is an <em>unconference</em> - an ad hoc gathering
            born from the&nbsp;
            <strong>desire for people to share and learn</strong>&nbsp;in an
            open environment.
          </li>
          <li>
            Giving a session is a{" "}
            <strong>
              perfect opportunity to speak about that cool topic you are
              interested in
            </strong>
            : whether it be about your unique take on Fitness and Art, about
            that cool usecase for AI you discovered, or about the rabbithole you
            went down last year about Nepali traditional <em>Dhunge dharas</em>{" "}
            (We highly encourage varied topics, please checkout the
            &quot;Session Categories&quot; below!)
          </li>
          <li>
            The format of the event is that there will be{" "}
            <strong>3/4 parallel tracks</strong>, and our main sessions will be{" "}
            <strong>20 minutes</strong> each. Other than this, you can also opt
            to present a <strong>5-minute lightning talk</strong>. There is no
            set agenda, the sessions will be assigned to a track/room &amp; time
            on the event day itself (on a BIG PHYSICAL timetable!)
          </li>
          <li>
            Since this is an unconference, you also have the option to show up
            on the event day itself with a talk idea. However,{" "}
            <strong>we encourage you to submit a proposal earlier</strong> for
            the following reasons:
            <ol className="ml-8 mt-4 list-decimal">
              <li>
                We will be sharing the suggested proposals on social media, so a
                proposal on a topic is a good way to attract like-minded people
                to the event. Who knows, your proposal may encourage other
                like-minded people to submit proposals about your area of
                interest, and you may end up with a mini-conference of your
                niche interest.
              </li>
              <li>
                An unconference is a gathering for attendees{" "}
                <em>by attendees</em>. Submitting a proposal is a way of
                contributing to the event: by continuing as such and generating
                excitement, you will be making the event better for everyone
              </li>
              <li>
                Attendees will be able to upvote sessions they are interested in
                and which they would like to attend. Pre submitting your session
                proposal will therefore allow you to get a sense of which of
                your ideas resonate. Note that you are welcome to submit
                multiple proposals.
              </li>
              <li>
                Psychology studies have shown that for rewarding but difficult
                tasks (like giving a talk), you are much more likely to go
                through with it if you pre-commit to it. Filling up this form
                can be thought of as such a precommitment device.
              </li>
            </ol>
          </li>
          <li>
            Most sessions do not require prepared slides and we even encourage
            you not to use them. We also do not enforce any language or
            presentation style so be yourself. However, we do require that all
            sessions adhere to our{" "}
            <a href="https://wwktm.co/2023/code-of-conduct/">code of conduct</a>
          </li>
          <li>
            If you have any questions, please do not hesitate to{" "}
            <a href="https://x.com/weekend_web">contact us</a>
          </li>
        </ul>
      </p>
      <Form
        ref={form}
        method="post"
        className="flex flex-col gap-4 max-w-3xl m-auto mt-4 p-4"
      >
        {isSuccess ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-green-400"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Proposal Sent Successfully
                </p>
              </div>
            </div>
          </div>
        ) : null}
        {hasError ? (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-red-400"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  Sorry there was an error submitting your proposal
                </p>
              </div>
            </div>
          </div>
        ) : null}
        <Field>
          <Label className="block text-gray-900 font-semibold">
            Contact Email
          </Label>
          <div className="text-sm text-gray-500 mb-3">
            We will use this to contact you
          </div>
          <Input
            type="email"
            name="email"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
            required
          />
        </Field>
        <Field>
          <Label className="block text-gray-900 font-semibold mb-3">
            Session length
          </Label>
          <Select
            name="duration"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
            required
          >
            <option value="regular">Regular: 20mins</option>
            <option value="lightning">Lightning: 5mins</option>
          </Select>
        </Field>
        <Fieldset>
          <Legend className="block text-gray-900 font-semibold mb-3">
            Session Category
          </Legend>
          <RadioGroup
            name="session_category"
            value={sessionCategory}
            onChange={setSessionCategory}
            aria-label="Session Category"
            className="flex flex-col gap-2"
          >
            {sessionCategories.map((category) => (
              <Field key={category} className="flex items-center gap-2">
                <Radio
                  value={category}
                  className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-blue-400"
                >
                  <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
                </Radio>
                <Label className=" font-medium">{category}</Label>
              </Field>
            ))}
          </RadioGroup>
          {sessionCategory === "Other" ? (
            <Input
              name="category_other"
              type="text"
              placeholder="Please specify"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none mt-3"
            />
          ) : null}
        </Fieldset>
        <Field>
          <Label className="block text-gray-900 font-semibold mb-3">
            Topic Title
          </Label>
          <Input
            type="text"
            name="title"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
            required
          />
        </Field>
        <Field>
          <Label className="block text-gray-900 font-semibold mb-3">
            Topic Tags
          </Label>
          <Input
            type="text"
            name="tags"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
            placeholder="Comma separated tags"
            required
          />
        </Field>
        <Field>
          <Label className="block text-gray-700 font-bold mb-2">
            Short Description
          </Label>
          <Textarea
            name="description"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
            rows={3}
            required
          />
        </Field>
        <Fieldset className="flex flex-col gap-2">
          <Legend className="block text-gray-700 font-bold mb-2">
            Speaker Profile
          </Legend>
          {speakers.map((speaker, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border border-gray-200 p-4"
            >
              <Input
                type="text"
                name={`speakers[${index}][name]`}
                placeholder="Your Name"
                value={speaker.name}
                onChange={(e) => handleSpeakerChange(index, "name", e)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
                required
              />
              <Input
                type="url"
                name={`speakers[${index}][photoUrl]`}
                placeholder="Your Photo URL"
                value={speaker.photoUrl}
                onChange={(e) => handleSpeakerChange(index, "photoUrl", e)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
              />
              <Input
                type="url"
                name={`speakers[${index}][profileLink]`}
                placeholder="Social Media / Website Link"
                value={speaker.profileLink}
                onChange={(e) => handleSpeakerChange(index, "profileLink", e)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
              />
              <Textarea
                name={`speakers[${index}][introduction]`}
                placeholder="About you / Introduction"
                value={speaker?.introduction}
                onChange={(e) => handleSpeakerChange(index, "introduction", e)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeSpeaker(index)}
                  className="text-red-500 hover:underline self-end"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSpeaker}
            className=" text-orange-500 hover:underline self-end"
          >
            Add another speaker
          </button>
        </Fieldset>
        <Button
          disabled={isSuccess || navigation.state === "submitting"}
          type="submit"
          className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 disabled:bg-slate-100 disabled:text-slate-400"
        >
          {getSubmitButtonText()}
        </Button>
      </Form>
    </div>
  );
}
