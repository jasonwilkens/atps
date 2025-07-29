import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

export type FeedViewPostExtended = FeedViewPost & {
  post: {
    record: {
      text?: string;
    };
    embed?: {
      images?: [
        {
          alt: string;
          aspectRatio: {
            height: number;
            width: number;
          };
          thumb: string;
          fullsize: string;
        },
      ];
      external: {
        title: string;
        description: string;
        uri: string;
      };
      $type?: string;
      record?: {
        author?: {
          displayName?: string;
          handle?: string;
        };
        embeds?: [
          {
            $type: string;
            external?: {
              description: string;
              thumb: string;
              title: string;
              uri: string;
            };
          },
        ];
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
