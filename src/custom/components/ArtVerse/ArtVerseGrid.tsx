import { For, Grid } from "@chakra-ui/react"
import ArtVerseGridItem from "./ArtVerseGridItem"
import { ArtVerseGridProps } from "@/custom/interfaces/ArtVerse/ArtVerseGrid";

const ArtVerseGrid = ({artworks}: ArtVerseGridProps) => {
    const columns = 7;
    const templateColumns = `repeat(${columns}, 1fr)`;

    return (
        <Grid
            templateRows="repeat(auto, auto)"
            templateColumns={templateColumns}
            gap={1}
            w={"full"}
        >
            <For each={artworks}>
                {(artwork) => (
                    <ArtVerseGridItem key={artwork.artworkId} artwork={artwork} />
                )}
            </For>
        </Grid>
    )
}

export default ArtVerseGrid