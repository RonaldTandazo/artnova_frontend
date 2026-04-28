import { useColorMode } from "@/components/ui/color-mode";
import ArtVerseGrid from "@/custom/Components/ArtVerse/ArtVerseGrid";
import Empty from "@/custom/Components/States/Empty";
import LoadingProgress from "@/custom/Components/States/LoadingProgress";
import { Results } from "@/custom/interfaces/Search/SearchPage";
import { useGetSearchResults } from "@/services/Search/SearchService";
import { Box, Button, For, Heading, HStack, Show, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import FiltersDrawer from "./FiltersDrawer";
import ArtistCard from "@/custom/Components/Artist/ArtistCard";

const SearchPage = () => {
    const { colorMode } = useColorMode();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("s");
    const [loading, setLoading] = useState<boolean>(true);
    const [results, setResults] = useState<Results>({artworks: [], artists: []});
    const [pageArtworks, setPageArtworks] = useState<number>(1);
    const [_, setPageArtists] = useState<number>(1);
    const [hasMoreArtworks, setHasMoreArtworks] = useState<boolean>(false);
    const [loadingArtworks, setLoadingArtworks] = useState<boolean>(false);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false)

    const { getSearchResults, data: resultsData } = useGetSearchResults();
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoading(true)
        setResults({artworks: [], artists: []})
        setPageArtworks(1)
        setPageArtists(1)
        getSearchResults({search: query, pageArtworks: 1, pageArtists: 1, type: 'both'});
    }, [query]);
    
    useEffect(() => {
        if (resultsData?.getSearchResults) {
            const { artworks, artists, hasMoreArtworks, type } = resultsData?.getSearchResults

            const previousArtworks = results.artworks;
            const previousArtists = results.artists;

            const newResults: Results = {
                artworks: type == 'both' || type == 'artworks' ? [...previousArtworks, ...artworks]:[...previousArtworks],
                artists: type == 'both' || type == 'artists' ? [...previousArtists, ...artists]:[...previousArtists]
            }

            setResults(newResults)

            if(type == 'both' || type == 'artworks'){
                setHasMoreArtworks(hasMoreArtworks)
                setLoadingArtworks(false)
            }

            setLoading(false)
        }
    }, [resultsData]);

    const loadMoreArtworks = useCallback(async () => {
        if (loadingArtworks || !hasMoreArtworks) return;

        setLoadingArtworks(true);
        const nextPage = pageArtworks + 1;
        setPageArtworks(nextPage);
        await getSearchResults({ search: query, pageArtworks: nextPage, type: 'artworks' });
    }, [loadingArtworks, hasMoreArtworks, pageArtworks, query, getSearchResults]);

    useEffect(() => {
        const target = observerTarget.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreArtworks && !loadingArtworks) {
                    loadMoreArtworks();
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(target);

        return () => {
            if (target) observer.unobserve(target);
        };
    }, [loadMoreArtworks, hasMoreArtworks, loadingArtworks]);

    return (
        <Show
            when={!loading}
            fallback={
                <LoadingProgress />
            }
        >
            <Box
                h={"full"}
            >
                <HStack justifyContent="space-between" mb={3}>
                    <Text fontSize="md">
                        Showing results for: <strong>"{query}"</strong>
                    </Text>

                    <Button
                        size="sm"
                        bg={colorMode === "light" ? "teal.400" : "pink.600"}
                        color={"white"}
                        shadow={"md"}
                        borderRadius={"md"}
                        onClick={() => setOpenDrawer(true)}
                    >
                        <FaFilter /> Filters
                    </Button>
                </HStack>

                <Show
                    when={results.artworks.length > 0 || results.artists.length > 0}
                    fallback={
                        <Empty 
                            title="Oooh no!...It seems there are no Results 😢"
                        />
                    }
                >
                    <Show
                        when={results.artists.length > 0}
                    >
                        <HStack justifyContent="space-between" mb={3}>
                            <Heading size={"3xl"}>Artists</Heading>
                        </HStack>

                        <HStack 
                            overflowX="auto" 
                            pb={4}
                            css={{
                                '&::-webkit-scrollbar': { display: 'none' },
                                '-ms-overflow-style': 'none',
                                'scrollbar-width': 'none',
                            }}
                        >
                            <For
                                each={results.artists}
                            >
                                {(artist) => (
                                    <ArtistCard key={artist.artistId} artist={artist} />
                                )}
                            </For>
                        </HStack>
                    </Show>

                    <Show
                        when={results.artworks.length > 0}
                    >
                        <HStack justifyContent="space-between" mb={3}>
                            <Heading size={"3xl"}>ArtWorks</Heading>
                        </HStack>

                        <ArtVerseGrid 
                            artworks={results.artworks}
                        />

                        <Box 
                            ref={observerTarget} 
                            h="40px" 
                            w="full" 
                            display="flex" 
                            alignItems="center" 
                            justifyContent="center"
                            
                        >
                            <Show
                                when={loadingArtworks}
                            >
                                <LoadingProgress />
                            </Show>
                        </Box>
                    </Show>
                </Show>

            </Box>

            <FiltersDrawer 
                isOpen={openDrawer}
                onClose={() => setOpenDrawer(false)}
            />
        </Show>
    );
};

export default SearchPage;