import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { ArtistCardProps } from "@/custom/interfaces/Search/ArtistCard";
import { BACKEND_URL, encodeToBase64 } from "@/utils/Helpers";
import { Box, Icon, Image, Show, Text } from "@chakra-ui/react";
import { ImUser } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const ArtistCard = ({ artist }: ArtistCardProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { colorMode } = useColorMode();

    const bannerUrl = artist.cover 
    ? `${BACKEND_URL}/covers/${artist.cover}` 
    : undefined;

    const handleNavigateProfile = (artistId: number) => {
        if(artistId){
            const encodedUserId = encodeToBase64(artistId);
            const encodedModule = encodeToBase64(user && artistId == user.userId ? 'OwnProfile':'VisitProfile');

            const safeUserId = encodeURIComponent(encodedUserId);
            const safeModule = encodeURIComponent(encodedModule);
            
            navigate(`/Profile/${safeUserId}/${safeModule}`);
        }
    }
    
    return (
        <Box
            w="450px" 
            h="200px"
            borderRadius="sm"
            position="relative"
            overflow="hidden"
            cursor="pointer"
            onClick={() => handleNavigateProfile(artist.artistId)}
            bgGradient={!bannerUrl ? "to-br" : undefined}
            gradientFrom={colorMode === 'light' ? "purple.500":"pink.700"} 
            gradientTo={colorMode === 'light' ? "teal.400":"cyan.900"}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.02)" }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Show
                when={bannerUrl}
            >
                <Image
                    src={bannerUrl}
                    alt="Cover"
                    position="absolute"
                    top={0}
                    left={0}
                    w="full"
                    h="full"
                    objectFit="cover"
                    zIndex={0}
                />
            </Show>

            <Box
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="full"
                bg="blackAlpha.600"
                zIndex={1}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Show
                    when={artist.avatar}
                    fallback={
                        <Icon
                            as={ImUser}
                            boxSize="150px"
                            color={colorMode === 'light' ? 'teal.100' : 'pink.100'}
                            bg={colorMode === 'light' ? 'teal.400' : 'pink.600'}
                            rounded={'full'}
                            cursor="pointer"
                        />
                    }
                >
                    <Image
                        src={`${BACKEND_URL}/avatars/${artist.avatar}`}
                        alt="Artist Avatar"
                        boxSize="150px"
                        borderRadius="full"
                        fit="cover"
                        cursor="pointer"
                        border="4px solid"
                        borderColor={colorMode === 'light' ? 'teal.400' : 'pink.600'}
                    />
                </Show>
                
                <Text 
                    fontWeight="bold" 
                    fontSize="lg" 
                    color="white" 
                    textShadow="0px 2px 4px rgba(0,0,0,0.8)"
                >
                    @{artist.username}
                </Text>
            </Box>
        </Box>
    );
};

export default ArtistCard;