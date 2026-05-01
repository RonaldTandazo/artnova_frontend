import { Box, Show } from '@chakra-ui/react';
import ArtVerseGrid from '@/custom/components/ArtVerse/ArtVerseGrid';
import LoadingProgress from '@/custom/components/States/LoadingProgress';
import { useEffect, useState } from 'react';
import { useGetArtVerseArtworks } from '@/services/Artwork/ArtworkService';
import { ArtVerseArtWork } from '@/custom/interfaces/ArtVerse/ArtVerse';
import Empty from '@/custom/components/States/Empty';

const ArtVerse = () => {
  const [artworks, setArtworks] = useState<ArtVerseArtWork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    <Show 
      when={!loading}
      fallback={
        <LoadingProgress />
      }
    >
      <Box
        h={"full"}
      >
        <Show
          when={artworks.length > 0}
          fallback={
            <Empty 
              title="Oooh no!...It seems there are no ArtWorks yet 😢"
              description="Be the first to publish an amazing one!"
            />
          }
        >
            <ArtVerseGrid 
              artworks={artworks}
            />
        </Show>
      </Box>
    </Show>
  );
};

export default ArtVerse;
