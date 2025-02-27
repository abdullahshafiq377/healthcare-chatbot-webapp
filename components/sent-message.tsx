import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";

const SentMessage = ({ text }: { text: string }) => {
  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Text-to-Speech is not supported in this browser.");

      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US"; // Change language if needed
    utterance.rate = 1; // Speed of speech (0.5 to 2)
    utterance.pitch = 1; // Voice pitch
    utterance.volume = 1; // Volume (0 to 1)

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex justify-end items-end">
      <Button isIconOnly className="bg-transparent" onPress={() => speak(text)}>
        <SpeakerWaveIcon height={20} width={20} />
      </Button>
      <Card
        isBlurred
        className="max-w-[280px] md:max-w-lg bg-lime-500/20 dark:bg-lime-500/20 border border-lime-500/40 dark:border-lime-500/40 rounded-tr-none"
      >
        <CardBody>{text}</CardBody>
      </Card>
    </div>
  );
};

export default SentMessage;
