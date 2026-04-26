import ArtVerseGrid from "@/custom/Components/ArtVerse/ArtVerseGrid";
import Empty from "@/custom/Components/States/Empty";
import LoadingProgress from "@/custom/Components/States/LoadingProgress";
import { ArtVerseArtWork } from "@/custom/interfaces/ArtVerse/ArtVerse";
import { useGetUserFavoritesArtworks } from "@/services/Favorites/FavoritesService";
import { Box, Heading, Show } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Favorites = () => {
    const [favoritesArtWorks, setFavoritesArtWorks] = useState<ArtVerseArtWork[]>([])
    const { getUserFavoritesArtworks, data: favoritesArtworks, loading: favoritesLoading } = useGetUserFavoritesArtworks();

    useEffect(() => {
        getUserFavoritesArtworks()
    }, []);

    useEffect(() => {
        if (favoritesArtworks?.getUserFavoritesArtworks) {
            setFavoritesArtWorks(favoritesArtworks.getUserFavoritesArtworks)
        }
    }, [favoritesArtworks]);
    
    return (
        <Box 
            h={
                favoritesArtWorks.length > 0 
                ? "auto"
                : "97%"
            }
        >
            <Heading size={"4xl"} mb={4}>Favorites ArtWorks</Heading>
            <Show
                when={!favoritesLoading}
                fallback={
                    <LoadingProgress />
                }
            >
                <Show
                    when={favoritesArtWorks.length > 0}
                    fallback={
                        <Empty 
                            title="No Favorites ArtWorks"
                            description="Oooh no!... It seems you haven't set any favorite ArtWorks yet 😢"
                        />
                    }
                >
                    <ArtVerseGrid 
                        artworks={favoritesArtWorks}
                    />
                </Show>
            </Show>
        </Box>
    );
};

export default Favorites;