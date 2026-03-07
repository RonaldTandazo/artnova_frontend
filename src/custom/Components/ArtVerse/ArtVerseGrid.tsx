import { For, Grid } from "@chakra-ui/react"
import ArtVerseGridItem from "./ArtVerseGridItem"
import { useEffect, useState } from "react";
import { useGetArtVerseArtworks } from "@/services/Artwork/ArtworkService";
import { useGlobalState } from "@/context/GlobalContext";

const ArtVerseGrid = () => {
    const columns = 7;
    const templateColumns = `repeat(${columns}, 1fr)`;
    const { setLoading } = useGlobalState();
    const [artworks, setArtworks] = useState([]);

    const { getArtVerseArtworks, data: artVerseArtworksData } = useGetArtVerseArtworks();

    useEffect(() => {
        getArtVerseArtworks();
    }, []);

    useEffect(() => {
        if (artVerseArtworksData?.getArtVerseArtworks) {
            setArtworks(artVerseArtworksData.getArtVerseArtworks)
            setLoading(false)
        }
    }, [artVerseArtworksData]);

    return (
        <Grid
            templateRows="repeat(auto, auto)"
            templateColumns={templateColumns}
            gap={1}
            w={"full"}
        >
            <For each={artworks}>
                {(artwork: any) => (
                    <ArtVerseGridItem artwork={artwork} key={artwork.artworkId} />
                )}
            </For>
        </Grid>
    )
}

export default ArtVerseGrid