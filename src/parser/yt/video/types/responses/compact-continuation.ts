import { ContinuationItem } from "@yt/components/continuation";
import { BaseResponse } from "@yt/core/api";
import { Action } from "@yt/core/internals";
import { CompactVideo } from "@yt/video/processors/compact";

export type CompactContinuationResponse = BaseResponse & {
  onResponseReceivedEndpoints: [
    Action<
      "appendContinuationItems",
      {
        continuationItems: (CompactVideo | ContinuationItem)[];
        targetId: string;
      }
    >
  ];
};
