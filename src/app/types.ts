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
  reply?: {
    parent?: {
      cid: string;
      record: {
        reply?: {
          parent?: {
            cid: string;
          };
          root?: {
            cid: string;
          };
        };
        text?: string;
      };
    };
    root?: {
      cid: string;
      record: {
        text?: string;
      };
    };
  };
};
