import Fuse from "fuse.js";
import React, { useEffect, useRef, useState, useMemo } from "react";
import dayjs from "dayjs";
import slugify from "@utils/slugify";
import type { BlogFrontmatter } from "@content/_schemas";

export type SearchItem = {
  title: string;
  description: string;
  data: BlogFrontmatter;
  slug: string;
  type: "journal" | "article" | "archive" | "record";
  content: string;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
  matches: Fuse.FuseResultMatch[];
}

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: ["title", "description", "content"],
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.0, // 稍微提高阈值
        ignoreLocation: true, // 忽略位置，搜索整个字段
        useExtendedSearch: true,
      }),
    [searchList]
  );

  useEffect(() => {
    // if URL has search query,
    // insert that search query in input field
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    // put focus cursor at the end of the string
    setTimeout(function () {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    let inputResult = inputVal.length > 1 ? fuse.search(`'${inputVal}`) : [];
    setSearchResults(inputResult);

    // 只在有搜索输入时输出日志
    if (inputVal.length > 1) {
      console.log("Search input:", inputVal);
      console.log("Number of results:", inputResult.length);

      // 输出更详细的匹配信息
      inputResult.forEach((result, index) => {
        console.log(`Result ${index + 1}:`);
        console.log(`  Title: ${result.item.title}`);
        console.log(`  Type: ${result.item.type}`);
        console.log(
          `  Matched fields:`,
          result.matches?.map(match => match.key)
        );
        // 如果匹配了内容，显示匹配的部分
        const contentMatch = result.matches?.find(
          match => match.key === "content"
        );
        if (contentMatch) {
          console.log(
            `  Matched content: "${contentMatch.value?.slice(0, 50)}..."`
          );
        }
      });
    }

    // Update search string in URL
    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.replaceState(null, "", newRelativePathQuery);
    } else {
      history.replaceState(null, "", window.location.pathname);
    }
  }, [inputVal]);

  const getHighlightedText = (
    text: string,
    indices: readonly [number, number][]
  ) => {
    let highlightedText = "";
    let lastIndex = 0;
    indices.forEach(([start, end]) => {
      highlightedText += text.slice(lastIndex, start);
      highlightedText += `<mark>${text.slice(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    });
    highlightedText += text.slice(lastIndex);
    return highlightedText;
  };

  const getPostUrl = (item: SearchItem) => {
    switch (item.type) {
      case "journal":
        return `/journals/${slugify(item.data)}`;
      case "record":
        return `/records/${slugify(item.data)}`;
      case "article":
        return `/posts/${slugify(item.data)}`;
      case "archive":
        return `/posts/${slugify(item.data)}`;
      default:
        return `/posts/${slugify(item.data)}`;
    }
  };

  return (
    <>
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
          </svg>
        </span>
        <input
          className="block w-full rounded border border-skin-fill 
        border-opacity-40 bg-skin-fill py-3 pl-10
        pr-3 placeholder:italic placeholder:text-opacity-75 
        focus:border-skin-accent focus:outline-none"
          placeholder="Search for anything..."
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
          ref={inputRef}
        />
      </label>

      {inputVal.length > 1 && (
        <div className="mt-8">
          Found {searchResults ? searchResults.length : 0}
          {searchResults && searchResults.length === 1
            ? " result"
            : " results"}{" "}
          for '{inputVal}'
        </div>
      )}

      <ul>
        {searchResults && searchResults.length > 0
          ? searchResults.map(({ item, refIndex, matches }) => {
              const contentMatch = matches.find(
                match => match.key === "content"
              );
              let highlightedContent = "";
              if (contentMatch) {
                const startIndex = Math.max(0, contentMatch.indices[0][0] - 50);
                const endIndex = Math.min(
                  item.content.length,
                  contentMatch.indices[contentMatch.indices.length - 1][1] + 50
                );
                const contentSlice = item.content.slice(startIndex, endIndex);
                highlightedContent = getHighlightedText(
                  contentSlice,
                  contentMatch.indices.map(([start, end]) => [
                    start - startIndex,
                    end - startIndex,
                  ])
                );
              }

              return (
                <li key={refIndex} className="my-6">
                  <div className="w-18 text-gray-500 text-sm">
                    {dayjs(item.data.pubDatetime).format("YYYY/MM/DD")}
                  </div>
                  <a
                    href={getPostUrl(item)}
                    className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
                  >
                    <h2 className="text-lg font-medium decoration-dashed hover:underline">
                      {item.title}
                    </h2>
                  </a>
                  <p className="text-gray-600 mt-2 text-sm">
                    {contentMatch ? (
                      <span
                        dangerouslySetInnerHTML={{ __html: highlightedContent }}
                      />
                    ) : (
                      item.description || item.content.slice(0, 150)
                    )}
                    ...
                  </p>
                </li>
              );
            })
          : inputVal.length > 1 && <li>No results found</li>}
      </ul>
    </>
  );
}
