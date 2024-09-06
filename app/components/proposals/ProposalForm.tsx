import { useCallback, useEffect, useRef, useState } from "react";
import { Form, useNavigation } from "@remix-run/react";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Textarea,
} from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

export interface SpeakerProfile {
  name: string;
  photoUrl: string;
  profileLink: string;
}

const initalSpeakersValue: SpeakerProfile[] = [
  { name: "", photoUrl: "", profileLink: "" },
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

  const addSpeaker = () => {
    setSpeakers([...speakers, { name: "", photoUrl: "", profileLink: "" }]);
  };

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  const handleSpeakerChange = (
    index: number,
    field: keyof SpeakerProfile,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedSpeakers = speakers.map((speaker, i) =>
      i === index ? { ...speaker, [field]: event.target.value } : speaker
    );
    setSpeakers(updatedSpeakers);
  };

  useEffect(() => {
    if (isSuccess) {
      form.current?.reset();
      setSpeakers(initalSpeakersValue);
    }
  }, [isSuccess]);

  const getSubmitButtonText = useCallback(() => {
    if (isSuccess) return "Submitted";

    if (navigation.state === "submitting") return "Submitting...";

    return "Submit";
  }, [isSuccess, navigation.state]);

  return (
    <div className="container my-20">
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
                placeholder="Speaker Name"
                value={speaker.name}
                onChange={(e) => handleSpeakerChange(index, "name", e)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
                required
              />
              <Input
                type="url"
                name={`speakers[${index}][photoUrl]`}
                placeholder="Photo URL"
                value={speaker.photoUrl}
                onChange={(e) => handleSpeakerChange(index, "photoUrl", e)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
              />
              <Input
                type="url"
                name={`speakers[${index}][profileLink]`}
                placeholder="Profile Link"
                value={speaker.profileLink}
                onChange={(e) => handleSpeakerChange(index, "profileLink", e)}
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
            Add Speaker
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
