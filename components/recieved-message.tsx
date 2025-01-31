import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

const ReceivedMessage = ({
  text,
  isLoading,
}: {
  text: string;
  isLoading?: boolean;
}) => {
  return (
    <div className="flex justify-start">
      <Card className="rounded-tl-none max-w-[280px] md:max-w-lg border dark:border-default/50">
        <CardBody>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="w-full rounded-full">
                <div className="h-3 w-[250px] rounded-lg bg-default-300" />
              </Skeleton>
              <Skeleton className="w-full rounded-full">
                <div className="h-3 w-[250px] rounded-lg bg-default-300" />
              </Skeleton>
              <Skeleton className="w-full rounded-full">
                <div className="h-3 w-[250px] md:w-[600px] rounded-lg bg-default-300" />
              </Skeleton>
            </div>
          ) : (
            text
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ReceivedMessage;
