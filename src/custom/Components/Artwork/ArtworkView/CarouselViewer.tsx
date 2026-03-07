import { useState } from 'react';
import { Box, Flex, For, IconButton, Image, Show } from '@chakra-ui/react';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { BACKEND_URL } from '@/utils/Helpers';

const CarouselViewer = ({ type, files = []} : {
    type: "images" | "videos",
    files: string[]
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slidesCount = files.length;

    const prevSlide = () => {
        setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
    };

    const nextSlide = () => {
        setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
    };

    const carouselProperties = {
        transition: 'transform 0.5s ease-in-out',
        transform: `translateX(-${currentSlide * (100 / slidesCount)}%)`,
        w: `${slidesCount * 100}%`,
        h: 'full'
    };

    return (
        <Box 
            position="relative" 
            overflow="hidden" 
            h="full"
        >
            <Flex {...carouselProperties}>
                <For each={files}>
                    {(file, index) => (
                        <Flex
                            key={index}
                            w={`${100 / slidesCount}%`}
                            h="full"
                            align="center"
                            justify="center"
                        >
                            <Show
                                when={type == 'images'}
                            >
                                <Image
                                    src={`${BACKEND_URL}/images/${file}`}
                                    alt={`Artwork Slide ${index + 1}`}
                                    objectFit="contain"
                                    maxH="full"
                                    w="full"
                                    loading="lazy"
                                    // borderRadius="xs"
                                    // shadow="md"
                                />
                            </Show>
                            <Show
                                when={type == 'videos'}
                            >
                                <Box
                                    as="video"
                                    src={`${BACKEND_URL}/videos/${file}`}
                                    controls
                                    objectFit="contain"
                                    maxH="full"
                                    w="full"
                                />
                            </Show>
                        </Flex>
                    )}
                </For>
            </Flex>
            <Show when={slidesCount > 1}>
                <IconButton
                    aria-label="Previous slide"
                    onClick={prevSlide}
                    position="absolute"
                    left="5"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex="2"
                    bg="blackAlpha.600"
                    color="white"
                    _hover={{ bg: 'blackAlpha.800' }}
                    size="lg"
                >
                    <MdArrowBackIosNew />
                </IconButton>

                <IconButton
                    aria-label="Next slide"
                    onClick={nextSlide}
                    position="absolute"
                    right="5"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex="2"
                    bg="blackAlpha.600"
                    color="white"
                    _hover={{ bg: 'blackAlpha.800' }}
                    size="lg"
                >
                    <MdArrowForwardIos />
                </IconButton>


                {/* Indicadores (Puntos) */}
                <Flex 
                    position="absolute"
                    bottom="8"
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex="2"
                    gap={2}
                >
                    <For each={files}>
                        {(_, index) => (
                            <Box
                                key={index}
                                w="6"
                                h="1"
                                borderRadius="full"
                                bg={index === currentSlide ? "white" : "whiteAlpha.500"}
                                cursor="pointer"
                                onClick={() => setCurrentSlide(index)}
                                transition="background-color 0.3s"
                            />
                        )}
                    </For>
                </Flex>
            </Show>
        </Box>
    );
}

export default CarouselViewer;