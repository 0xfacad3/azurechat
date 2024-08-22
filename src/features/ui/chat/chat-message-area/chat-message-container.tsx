import React, { ForwardRefRenderFunction } from "react";
import { ScrollArea } from "../../scroll-area";

interface ChatMessageContainerProps {
  children?: React.ReactNode;
  className?: string;
}

const ChatMessageContainer: ForwardRefRenderFunction<
  HTMLDivElement,
  ChatMessageContainerProps
> = (props, ref) => {
  return (
    <ScrollArea ref={ref} className={`flex-1  h-full ${props.className}`} type="always">
      {props.children}
    </ScrollArea>
  );
};

export default React.forwardRef(ChatMessageContainer);
