import { Card, CardBody } from "@heroui/card";

const ConversationItem = ({ title }: { title: string }) => {
  return (
    <Card
      isHoverable
      isPressable
      className="border dark:border-default/50"
      radius="sm"
      shadow="sm"
    >
      <CardBody>
        <span className="text-sm font-medium">{title}</span>
      </CardBody>
    </Card>
  );
};

export default ConversationItem;
