import { useColorMode } from "@/components/ui/color-mode"
import { LoadingProgressProps } from "@/custom/interfaces/States/LoadingProgress"
import { Box, ProgressCircle, Show, Text } from "@chakra-ui/react"

const LoadingProgress = ({ 
    message = 'Loading',
    showMessage = false
}: LoadingProgressProps) => {
    const { colorMode } = useColorMode()

    return (
        <Box 
            w={"full"} 
            h={"full"}
            display={"flex"}
            flexDirection={"column"} 
            justifyContent={"center"}
            alignItems={"center"}
            gap={3}
        >
            <ProgressCircle.Root size={"xl"} value={null}>
                <ProgressCircle.Circle>
                    <ProgressCircle.Track />
                    <ProgressCircle.Range strokeLinecap="round" stroke={colorMode === "light" ? "teal.400":"pink.600"}/>
                </ProgressCircle.Circle>
            </ProgressCircle.Root>
            <Show
                when={showMessage}
            >
                <Text>
                    {message}
                </Text>
            </Show>
        </Box>
    )
}

export default LoadingProgress