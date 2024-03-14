"use client";

import { RiCheckboxCircleFill, RiErrorWarningFill } from "@remixicon/react";
import { Callout } from "@tremor/react";

type CalloutCardProps = {
  message: string;
  warning?: boolean;
};

function CalloutCard({ message, warning }: CalloutCardProps) {
  return (
    <Callout
      className="mt-4"
      title={message}
      icon={warning ? RiErrorWarningFill : RiCheckboxCircleFill}
      color={warning ? "rose" : "teal"}
    />
  );
}

export default CalloutCard;
