import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

export type FeedViewPostExtended = FeedViewPost & {
  post: {
    record: {
      text?: string;
    };
    embed?: {
      record?: {
        author?: {
          displayName?: string;
          handle?: string;
        };
        value?: {
          text?: string;
        };
      };
    };
  };
};
