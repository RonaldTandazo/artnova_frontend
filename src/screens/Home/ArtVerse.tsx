import { Box, Show } from '@chakra-ui/react';
import ArtVerseGrid from '@/custom/Components/ArtVerse/ArtVerseGrid';
import { useGlobalState } from '@/context/GlobalContext';
import LoadingProgress from '@/custom/Components/States/LoadingProgress';

const ArtVerse = () => {
  const { loading } = useGlobalState();

  return (
    <>
      <Show 
        when={loading}
      >
        <LoadingProgress />
      </Show>
      <Box>
        <ArtVerseGrid />
      </Box>
    </>
  );
};

export default ArtVerse;
