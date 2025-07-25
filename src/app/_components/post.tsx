import { FeedViewPostExtended } from "../types";
import styles from "./post.module.css";

export default function Post(props: FeedViewPostExtended) {
  const { text } = props.post.record;

  const isReply = props.reply;
  const isRepost = props.reason?.$type === "app.bsky.feed.defs#reasonRepost";
  const isGrandchild =
    isReply &&
    props.reply?.parent?.record?.reply?.parent?.cid ===
      props.reply?.parent?.record?.reply?.root?.cid &&
    props.reply?.parent?.cid !== props.reply?.root?.cid;
  const isGreatOrGreaterGrandchild =
    isReply &&
    props.reply?.parent?.record?.reply?.parent?.cid !==
      props.reply?.parent?.record?.reply?.root?.cid &&
    props.reply?.parent?.cid !== props.reply?.root?.cid;

  const hasEmbeddedPost =
    props.post.embed?.$type === "app.bsky.embed.record#view";

  const hasEmbeddedLink =
    props.post.embed?.$type === "app.bsky.embed.external#view";

  const embeddedPostLink = props.post.embed?.record?.embeds?.find(
    (embed) => embed.$type === "app.bsky.embed.external#view",
  );

  const domainFromUrl = (url: string) => {
    let domain;
    if (url.startsWith("https://")) {
      domain = url.slice(8);
    } else if (url.startsWith("http://")) {
      domain = url.slice(7);
    }
    if (domain && domain.startsWith("www.")) {
      domain = domain.slice(4);
    }
    if (domain && domain.includes("/")) {
      domain = domain.split("/")[0];
    }
    return domain;
  };

  let embedDomain;
  if (hasEmbeddedLink && props.post.embed?.external?.uri) {
    embedDomain = domainFromUrl(props.post.embed?.external?.uri);
  }

  let embeddedPostLinkDomain;
  if (embeddedPostLink && embeddedPostLink.external?.uri) {
    embeddedPostLinkDomain = domainFromUrl(embeddedPostLink.external?.uri);
  }

  return (
    <li className={styles.post}>
      <p className={styles.postStart}>-</p>
      <p className={styles.postDate}>
        {new Date(props.post.indexedAt).toLocaleDateString()}
      </p>
      {isRepost && (
        <p className={styles.postRepostAuthor}>
          <span className={styles.subtle}>&#61;&gt;</span>{" "}
          {props.post.author.displayName}{" "}
          <span className={styles.postRepostHandle}>
            @{props.post.author.handle}
          </span>
        </p>
      )}
      {(isGrandchild || isGreatOrGreaterGrandchild) && (
        <div>
          <p>{props.reply?.root.record.text}</p>
          <div className={styles.replyConnector}>|</div>
        </div>
      )}
      {isGreatOrGreaterGrandchild && (
        <div className={styles.replyConnector}>
          <p>&lt;/&hellip;/&gt;</p>
          <div>|</div>
        </div>
      )}
      {isReply && (
        <div>
          <p>{props.reply?.parent?.record?.text}</p>
          <div className={styles.replyConnector}>|</div>
        </div>
      )}
      <p className={styles.postText}>{text}</p>
      {hasEmbeddedPost && (
        <div className={styles.postQuoted}>
          <p>
            <span
              className={styles.subtle}
            >{`${isRepost ? "=>>" : "=>"}`}</span>{" "}
            {props.post.embed?.record?.author?.displayName}{" "}
            <span className={styles.postRepostHandle}>
              @{props.post.embed?.record?.author?.handle}
            </span>
          </p>
          <p className={styles.postQuotedText}>
            {props.post.embed?.record?.value?.text}
          </p>
          {embeddedPostLink && (
            <a href={embeddedPostLink.external?.uri}>
              {embeddedPostLink.external?.title} ::{" "}
              {embeddedPostLink.external?.description} [{embeddedPostLinkDomain}
              ]
            </a>
          )}
        </div>
      )}
      {hasEmbeddedLink && (
        <a href={props.post.embed?.external?.uri}>
          {props.post.embed?.external?.title} ::{" "}
          {props.post.embed?.external?.description} [{embedDomain}]
        </a>
      )}
    </li>
  );
}
