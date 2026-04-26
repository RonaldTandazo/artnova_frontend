import { useColorMode } from "@/components/ui/color-mode";
import { WarningDialogProps } from "@/custom/interfaces/Dialogs/WarningDialog";
import { Button, Dialog, For, HStack, Icon, Portal, Show, SimpleGrid, Text } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { MdCancel } from "react-icons/md";

const WarningDialog = ({
    isOpen,
    title = 'Warning', 
    message = 'Are you sure you want to delete this item?',
    items, 
    onClose, 
    onComplete
}: WarningDialogProps) => {
    const { colorMode } = useColorMode();
    
    return (
        <Dialog.Root
            placement={"center"}
            open={isOpen} 
            size={"md"}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header bg={colorMode === "light" ? "teal.400":"blackAlpha.500"}>
                            <Dialog.Title>
                                <HStack
                                    justifyContent={"flex-start"}
                                    alignItems={"center"}
                                >
                                    <Icon
                                        as={IoIosWarning}
                                        size={"xl"}
                                        color={"whiteAlpha.950"}
                                    />
                                    <Text
                                        color={"whiteAlpha.950"}
                                    >
                                        {title}
                                    </Text>
                                </HStack>
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body 
                            w={"full"} 
                            h={"full"} 
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"flex-start"}
                            justifyContent={"center"}
                        >
                            <Text
                                fontSize={"md"}
                                whiteSpace="pre-line"
                                color={colorMode === 'light' ? 'blackAlpha.950':'whiteAlpha.950'}
                            >
                                {message}
                            </Text>

                            <Show
                                when={items && items.length > 0}
                            >
                                <SimpleGrid 
                                    columns={items.length >= 2 ? 2 : 1}
                                    gap={2}
                                    w="full" mt={5}
                                >
                                    <For each={items}>
                                        {(item) => (
                                            <HStack 
                                                key={item.id} 
                                                p={2} 
                                                bg={colorMode === "light" ? "gray.100" : "whiteAlpha.100"} 
                                                borderRadius="md"
                                                borderLeft="4px solid"
                                                borderColor="red.500"
                                            >
                                                <Text 
                                                    truncate
                                                    fontSize={"sm"}
                                                    title={item.name}
                                                    color={colorMode === 'light' ? 'blackAlpha.950':'whiteAlpha.950'}
                                                >
                                                    {item.name}
                                                </Text>
                                            </HStack>
                                        )}
                                    </For>
                                </SimpleGrid>
                            </Show>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    color={colorMode == 'light' ? 'teal.400':'white'}
                                    bg={colorMode == 'light' ? 'white':'black'}
                                    borderColor={colorMode == 'light' ? 'teal.400':'white'}
                                    onClick={onClose}
                                >
                                    <MdCancel /> No, Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                bg={"fg.error"} 
                                color={"whiteAlpha.950"}
                                onClick={() => onComplete(items)}
                            >
                                <FaCheckCircle /> Yes, Confirm
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default WarningDialog;