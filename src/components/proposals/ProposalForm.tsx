import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  LIMITS,
  PHOTO_TYPES,
  SESSION_CATEGORIES,
  parseProposalForm,
  validateProposal,
  type ProposalErrors,
} from "../../utils/proposal-validation";

export interface SpeakerProfile {
  name: string;
  photoUrl: string;
  profileLink: string;
  introduction?: string;
}

const initalSpeakersValue: SpeakerProfile[] = [
  { name: "", photoUrl: "", profileLink: "", introduction: "" },
];

const inputClass =
  "w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300";

/** Maps a validation key (`speakers.0.name`) back to the form field name. */
const fieldName = (key: string) => {
  const m = key.match(/^speakers\.(\d+)\.(\w+)$/);
  return m ? `speakers[${m[1]}][${m[2]}]` : key;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <div
      className={`mt-1 text-right text-xs ${over ? "text-red-600" : "text-gray-400"}`}
    >
      {value.length}/{max}
    </div>
  );
}

export default function ProposalForm({ ticketsUrl }: { ticketsUrl?: string }) {
  const form = useRef<HTMLFormElement>(null);

  const [speakers, setSpeakers] =
    useState<SpeakerProfile[]>(initalSpeakersValue);

  // "" not undefined: keeps the RadioGroup controlled from first render
  const [sessionCategory, setSessionCategory] = useState("");
  const [categoryOther, setCategoryOther] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<ProposalErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  const addSpeaker = () => {
    setSpeakers([
      ...speakers,
      { name: "", photoUrl: "", profileLink: "", introduction: "" },
    ]);
  };

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
    setErrors({});
  };

  /** Clears one field's error as soon as the user starts fixing it. */
  const clearError = useCallback((key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleSpeakerChange = (
    index: number,
    field: keyof SpeakerProfile,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedSpeakers = speakers.map((speaker, i) =>
      i === index ? { ...speaker, [field]: event.target.value } : speaker
    );
    setSpeakers(updatedSpeakers);
    clearError(`speakers.${index}.${field}`);
  };

  useEffect(() => {
    if (submitSuccess) {
      form.current?.reset();
      form.current?.scrollIntoView({ behavior: "smooth" });
      setSpeakers(initalSpeakersValue);
      setSessionCategory("");
      setCategoryOther("");
      setDescription("");
      setErrors({});
    }
  }, [submitSuccess]);

  const getSubmitButtonText = useCallback(() => {
    if (submitSuccess) return "Submitted";
    if (isSubmitting) return "Submitting...";
    return "Submit";
  }, [submitSuccess, isSubmitting]);

  /** Scrolls the first offending field into view and focuses it. */
  const focusFirstError = (found: ProposalErrors) => {
    const first = Object.keys(found)[0];
    if (!first) return;
    const el = form.current?.querySelector<HTMLElement>(
      `[name="${fieldName(first)}"]`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(undefined);

    const formData = new FormData(e.currentTarget);
    if (sessionCategory) {
      formData.set("session_category", sessionCategory);
    }

    // Validate with the same code the API runs, so the two can't disagree.
    const found = validateProposal(parseProposalForm(formData));
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/submit-proposal", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (data?.success) {
        setSubmitSuccess(true);
        return;
      }

      // Server rejected it — mirror its field errors and message.
      if (data?.errors) {
        setErrors(data.errors);
        focusFirstError(data.errors);
      }
      setSubmitError(
        data?.error ?? "Sorry, there was an error submitting your proposal."
      );
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(
        "We couldn't reach the server. Check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const border = (key: string) =>
    errors[key] ? "border-red-400" : "border-gray-300";

  return (
    <div className="container my-20 mx-auto px-4">
      <div className="max-w-3xl m-auto mt-2 p-4 text-lg">
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
      </div>
      <form
        ref={form}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 max-w-3xl m-auto mt-4 p-4"
      >
        {/* honeypot: hidden from humans; bots that fill it are dropped server-side */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        {submitSuccess ? (
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
                  Your proposal has been saved with us Successfully! We will be
                  reviewing your content and making it appear in the website
                  soon.
                </p>
              </div>
            </div>
          </div>
        ) : null}
        {submitError ? (
          <div role="alert" className="rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{submitError}</p>
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
            maxLength={LIMITS.email.max}
            autoComplete="email"
            aria-invalid={!!errors.email}
            onInput={() => clearError("email")}
            className={`${inputClass} ${border("email")}`}
          />
          <FieldError message={errors.email} />
        </Field>
        <Field>
          <Label className="block text-gray-900 font-semibold">
            Contact Phone
          </Label>
          <div className="text-sm text-gray-500 mb-3">
            For anything that needs a quicker answer than email. Never shown
            publicly.
          </div>
          <Input
            type="tel"
            name="phone"
            maxLength={LIMITS.phone.max}
            autoComplete="tel"
            placeholder="98XXXXXXXX"
            aria-invalid={!!errors.phone}
            onInput={() => clearError("phone")}
            className={`${inputClass} ${border("phone")}`}
          />
          <FieldError message={errors.phone} />
        </Field>
        <Field>
          <Label className="block text-gray-900 font-semibold mb-3">
            Session length
          </Label>
          <Select
            name="duration"
            aria-invalid={!!errors.duration}
            className={`${inputClass} ${border("duration")}`}
          >
            <option value="regular">Regular: 20mins</option>
            <option value="lightning">Lightning: 5mins</option>
          </Select>
          <FieldError message={errors.duration} />
        </Field>
        <Fieldset>
          <Legend className="block text-gray-900 font-semibold mb-3">
            Session Category
          </Legend>
          <RadioGroup
            name="session_category"
            value={sessionCategory}
            onChange={(value: string) => {
              setSessionCategory(value);
              clearError("session_category");
            }}
            aria-label="Session Category"
            className="flex flex-col gap-2"
          >
            {SESSION_CATEGORIES.map((category) => (
              <Field key={category} className="flex items-center gap-2">
                <Radio
                  value={category}
                  className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-blue-400 cursor-pointer"
                >
                  <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
                </Radio>
                <Label className="font-medium cursor-pointer">{category}</Label>
              </Field>
            ))}
          </RadioGroup>
          <FieldError message={errors.session_category} />
          {sessionCategory === "Other" ? (
            <div className="mt-3">
              <Input
                name="category_other"
                type="text"
                placeholder="Please specify"
                value={categoryOther}
                maxLength={LIMITS.categoryOther.max}
                aria-invalid={!!errors.category_other}
                onChange={(e) => {
                  setCategoryOther(e.target.value);
                  clearError("category_other");
                }}
                className={`${inputClass} ${border("category_other")}`}
              />
              <FieldError message={errors.category_other} />
            </div>
          ) : null}
        </Fieldset>
        <Field>
          <Label className="block text-gray-900 font-semibold mb-3">
            Topic Title
          </Label>
          <Input
            type="text"
            name="title"
            maxLength={LIMITS.title.max}
            aria-invalid={!!errors.title}
            onInput={() => clearError("title")}
            className={`${inputClass} ${border("title")}`}
          />
          <FieldError message={errors.title} />
        </Field>
        <Field>
          <Label className="block text-gray-900 font-semibold mb-3">
            Topic Tags
          </Label>
          <div className="text-sm text-gray-500 mb-3">
            Up to {LIMITS.tagCount.max}, comma separated
          </div>
          <Input
            type="text"
            name="tags"
            aria-invalid={!!errors.tags}
            onInput={() => clearError("tags")}
            className={`${inputClass} ${border("tags")}`}
            placeholder="e.g. design, typography, workshop"
          />
          <FieldError message={errors.tags} />
        </Field>
        <Field>
          <Label className="block text-gray-700 font-bold mb-2">
            Short Description
          </Label>
          <Textarea
            name="description"
            value={description}
            maxLength={LIMITS.description.max}
            rows={3}
            aria-invalid={!!errors.description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearError("description");
            }}
            className={`${inputClass} ${border("description")}`}
          />
          <CharCount value={description} max={LIMITS.description.max} />
          <FieldError message={errors.description} />
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
              <div>
                <Input
                  type="text"
                  name={`speakers[${index}][name]`}
                  placeholder="Your Name"
                  value={speaker.name}
                  maxLength={LIMITS.speakerName.max}
                  aria-invalid={!!errors[`speakers.${index}.name`]}
                  onChange={(e) => handleSpeakerChange(index, "name", e)}
                  className={`${inputClass} ${border(`speakers.${index}.name`)}`}
                />
                <FieldError message={errors[`speakers.${index}.name`]} />
              </div>
              <div>
                <Label className="block text-gray-900 font-semibold mb-2">
                  Speaker photo
                </Label>
                <input
                  type="file"
                  name={`speakers[${index}][photo]`}
                  accept={PHOTO_TYPES.join(",")}
                  aria-invalid={!!errors[`speakers.${index}.photo`]}
                  onChange={() => clearError(`speakers.${index}.photo`)}
                  className="w-full text-sm text-gray-600 file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-orange-100 file:text-orange-700 file:font-semibold hover:file:bg-orange-200 file:cursor-pointer"
                />
                <div className="text-sm text-gray-500 mt-1.5">
                  JPEG, PNG or WebP, up to 2 MB. No file handy? Paste a link
                  instead.
                </div>
                <Input
                  type="url"
                  name={`speakers[${index}][photoUrl]`}
                  placeholder="https://… link to a photo of you"
                  value={speaker.photoUrl}
                  maxLength={LIMITS.url.max}
                  aria-invalid={!!errors[`speakers.${index}.photoUrl`]}
                  onChange={(e) => {
                    handleSpeakerChange(index, "photoUrl", e);
                    clearError(`speakers.${index}.photo`);
                  }}
                  className={`${inputClass} ${border(`speakers.${index}.photoUrl`)} mt-2`}
                />
                <FieldError message={errors[`speakers.${index}.photo`]} />
                <FieldError message={errors[`speakers.${index}.photoUrl`]} />
              </div>
              <div>
                <Input
                  type="url"
                  name={`speakers[${index}][profileLink]`}
                  placeholder="Social Media / Website Link (optional)"
                  value={speaker.profileLink}
                  maxLength={LIMITS.url.max}
                  aria-invalid={!!errors[`speakers.${index}.profileLink`]}
                  onChange={(e) => handleSpeakerChange(index, "profileLink", e)}
                  className={`${inputClass} ${border(`speakers.${index}.profileLink`)}`}
                />
                <FieldError message={errors[`speakers.${index}.profileLink`]} />
              </div>
              <div>
                <Textarea
                  name={`speakers[${index}][introduction]`}
                  placeholder="About you / Introduction (optional)"
                  value={speaker?.introduction}
                  maxLength={LIMITS.speakerIntro.max}
                  aria-invalid={!!errors[`speakers.${index}.introduction`]}
                  onChange={(e) =>
                    handleSpeakerChange(index, "introduction", e)
                  }
                  className={`${inputClass} ${border(`speakers.${index}.introduction`)}`}
                />
                <CharCount
                  value={speaker.introduction ?? ""}
                  max={LIMITS.speakerIntro.max}
                />
                <FieldError message={errors[`speakers.${index}.introduction`]} />
              </div>
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
            className="text-orange-500 hover:underline self-end"
          >
            Add another speaker
          </button>
        </Fieldset>
        <div className="rounded-xl border border-orange-200 bg-orange-50/60 px-5 py-4">
          <p className="font-semibold text-gray-900">
            BarCamp runs on the people who turn up, not on sponsors.
          </p>
          <p className="mt-1 text-gray-700">
            Everyone buys a ticket, organisers included, whether or not this
            proposal gets picked.{" "}
            {ticketsUrl && (
              <a
                href={ticketsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-orange-700 underline decoration-orange-300 underline-offset-2 hover:decoration-orange-600"
              >
                Tickets are live now →
              </a>
            )}
          </p>
        </div>
        <Button
          disabled={submitSuccess || isSubmitting}
          type="submit"
          className="bg-orange-400 text-white px-6 py-2.5 rounded-full hover:bg-orange-500 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
        >
          {getSubmitButtonText()}
        </Button>
      </form>
    </div>
  );
}
