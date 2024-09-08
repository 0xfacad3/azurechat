import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
}

export const ChatGroup = (props: Props) => {
  return (
    <div className="flex flex-col">
      <div className="text-white text-sm font-medium text-muted-foreground p-4 border-b">
        {props.title}
      </div>
      <div>{props.children}</div>
    </div>
  );
};
