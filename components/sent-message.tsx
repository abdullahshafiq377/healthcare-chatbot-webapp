import { Card, CardBody } from "@heroui/card";

const SentMessage = ({ text }: { text: string }) => {
  return (
    <div className="flex justify-end">
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
