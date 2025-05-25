import { SpeakerProfile } from "../proposals/ProposalForm";

const SpeakerSingle = ({ speaker }: { speaker: SpeakerProfile }) => {
  const nameArray = speaker?.name.split(" ");
  const firstName = nameArray.shift();
  const remainingName = nameArray.join(" ");

  return (
    <h2 className="text-xl">
      <a
        href={speaker?.profileLink}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col gap-1 text-black"
      >
        <span className="font-bold">{firstName}</span>
        <span> {remainingName}</span>
      </a>
    </h2>
  );
};

export default function Speakers({ speakers }: { speakers: SpeakerProfile[] }) {
  return (
    <div className="flex items-center">
      <div className={speakers.length > 1 ? "avatars" : "avatar"}>
        {Array.isArray(speakers) &&
          speakers.map((speaker) => (
            <img key={speaker.name} src={speaker.photoUrl} alt={speaker.name} />
          ))}
      </div>
      {speakers.length === 1 ? (
        <SpeakerSingle speaker={speakers?.[0]} />
      ) : (
        <div>
          {speakers.map((speaker, index) => (
            <span className="font-bold text-xl" key={speaker.name}>
              <a href={speaker.profileLink} target="_blank" rel="noreferrer">
                {speaker.name}
              </a>
              {index < speakers.length - 1 && <span> and </span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
