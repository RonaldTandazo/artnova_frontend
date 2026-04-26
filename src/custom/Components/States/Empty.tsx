import { useColorMode } from "@/components/ui/color-mode";
import { EmptyProps } from "@/custom/interfaces/States/Empty";
import { EmptyState, Flex, Icon, Show, VStack } from "@chakra-ui/react"
import { MdHideSource } from "react-icons/md"

const Empty = ({
    title = "No Data Available",
    description = "No Content to Show",
    showIcon = true,
    showDescription = true
}: EmptyProps) => {
    const { colorMode } = useColorMode();

    return (
        <Flex 
            h="full" 
            align="center" 
            justify="center"
        >
            <EmptyState.Root>
                <EmptyState.Content>
                    <Show
                        when={showIcon}
                    >
                        <EmptyState.Indicator>
                            <Icon
                                boxSize={"300px"}
                                color={colorMode === "light" ? "teal.400":"pink.600"}
                            >        
                                <MdHideSource />
                            </Icon>
                        </EmptyState.Indicator>
                    </Show>

                    <VStack 
                        textAlign="center"
                        color={colorMode === "light" ? "black":"white"}
                    >
                        <EmptyState.Title>{ title }</EmptyState.Title>
                        <Show
                            when={showDescription}
                        >
                            <EmptyState.Description>{ description }</EmptyState.Description>
                        </Show>
                    </VStack>
                </EmptyState.Content>
            </EmptyState.Root>
        </Flex>
    )
}

export default Empty