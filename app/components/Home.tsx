"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import dynamic from 'next/dynamic';
import { PlayList, DeezerResp } from "../types/types";

const Musics = dynamic(() => import('./Musics'), {
    ssr: false,
  });

const Home = ({ songPlay, search }:{ songPlay: (song: PlayList) => void; search: string }) => {
    const [apiSongs, setApiSongs] = useState<DeezerResp[]>([]);
    const [error, setError] = useState<any>({});
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

    useEffect(() => {
        let param = {q: "Kanye West"};
        if (search.length > 1) {
            param = { q: search };
        }
        if (typeof window !== "undefined") {
            const options = {
                method: "GET",
                url: "https://deezerdevs-deezer.p.rapidapi.com/search",
                params: param,
                headers: {
                    "X-RapidAPI-Key": `${apiKey}`,
                    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
                },
            };
            axios
                .request(options)
                .then(function (response) {
                    setApiSongs(response.data.data);
                })
                .catch(function (error) {
                    setError(error);
                    console.error(error);
                });
        }
    }, [search, apiKey]);

    return (
        <>
            <div className="flex justify-center w-full h-full flex-wrap pt-16 pb-20 dark:bg-slate-800">            
            {apiSongs?.length > 1 ? apiSongs.map((data: any) => (                            
                    <Musics
                        key={data.id}
                        id={data.id}
                        title={data.title}
                        artist={data.artist.name}
                        preview={data.preview}
                        img_small={data.album.cover_small}
                        img_medium={data.album.cover_medium}
                        songPlay={songPlay}
                    />
            )) : null}
            </div>
        </>
    )
}
export default Home;