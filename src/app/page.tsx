"use client";
import { useEffect, useState } from "react";
import Post from "./_components/post";
import debounce from "lodash/debounce";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { FeedViewPostExtended } from "./types";
import styles from "./page.module.css";

export default function Home() {
  const actor = "jasonwilkens.website";
  const atProtoProfileURL = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${actor}`;
  const atProtoFeedURL = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${actor}&filter=posts_and_author_threads`;
  const [atProtoFeedData, setAtProtoFeedData] =
    useState<Array<FeedViewPostExtended>>();
  const [atProtoProfile, setAtProtoProfile] = useState<ProfileViewDetailed>();
  const [atProtoFeedCursor, setAtProtoFeedCursor] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cursorParam = `&cursor=${atProtoFeedCursor}`;

  const fetchFeed = async () => {
    if (isLoading) {
      return;
    }
    if (
      atProtoFeedData &&
      atProtoProfile &&
      // @ts-expect-error there is atProtoProfile
      atProtoFeedData?.length >= atProtoProfile?.postsCount
    ) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      let response;
      if (atProtoFeedCursor) {
        response = await fetch(atProtoFeedURL + cursorParam);
      } else {
        response = await fetch(atProtoFeedURL);
      }
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      const cursor = data.cursor;
      const feed = data.feed;

      let parentIndex;
      let rootIndex;

      for (let i = 0; i < feed.length; i++) {
        if (feed[i].reply?.parent?.cid) {
          let next100 = feed.slice(i, Math.min(feed.length, i + 100));
          parentIndex = next100.findIndex(
            (postObj: FeedViewPostExtended) =>
              postObj.post.cid === feed[i].reply.parent.cid,
          );
          if (parentIndex > -1) {
            feed.splice(parentIndex + i, 1);
          }

          next100 = feed.slice(i, Math.min(feed.length, i + 100));
          rootIndex = next100.findIndex(
            (postObj: FeedViewPostExtended) =>
              postObj.post.cid === feed[i].reply.root.cid,
          );
          if (rootIndex > -1) {
            feed.splice(rootIndex + i, 1);
          }
        }
      }

      if (atProtoFeedData) {
        let concatedFeed = atProtoFeedData.concat(feed);
        if (
          atProtoProfile?.postsCount &&
          concatedFeed.length >= atProtoProfile.postsCount
        ) {
          concatedFeed = concatedFeed.slice(0, atProtoProfile.postsCount);
        }
        setAtProtoFeedData(concatedFeed);
      } else {
        setAtProtoFeedData(feed);
      }
      setAtProtoFeedCursor(cursor);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(atProtoProfileURL);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      setAtProtoProfile(data);
      document.title = data.handle;
    } catch (error) {
      console.error(error);
    }
  };

  const handleScroll = () => {
    const scrollHeight = document.body.scrollHeight;
    const viewed = window.scrollY + window.innerHeight;
    if (scrollHeight - viewed < 1000) {
      setIsLoading(true);
      fetchFeed();
    }
  };

  const debouncedHandleScroll = debounce(handleScroll, 100);

  useEffect(() => {
    fetchProfile();
    fetchFeed();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, [atProtoFeedCursor, atProtoFeedData, debouncedHandleScroll, isLoading]);

  const feedPosts = atProtoFeedData
    ? atProtoFeedData.map((postObj, i) => (
        <Post {...postObj} key={postObj.post.cid + i} />
      ))
    : null;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {atProtoProfile && (
          <div className={styles.bio}>
            <p>
              {atProtoProfile.displayName}
              <span className={styles.handle}> @{atProtoProfile.handle}</span>
              <br />
              {atProtoProfile.description}
            </p>
          </div>
        )}
        {feedPosts ? (
          <>
            <p>---</p>
            <ul className={styles.feed}>{feedPosts}</ul>
          </>
        ) : null}
        {(!feedPosts || isLoading) && (
          <p className={styles.loader}>Loading&hellip;</p>
        )}
        {feedPosts &&
          atProtoProfile &&
          feedPosts.length === atProtoProfile.postsCount && (
            <>
              <p>---</p>
              <p className={styles.feedEnd}>End of feed</p>
            </>
          )}
      </main>
    </div>
  );
}
