import React from "react";

export const ChatTextInput = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className="p-4 w-full h-full focus:outline-none bg-transparent resize-none"
      placeholder="Type your message here..."
      style={{ minHeight: '200px', maxHeight: '400px' }}
      {...props}
    />
  );
});
ChatTextInput.displayName = "ChatTextInput";