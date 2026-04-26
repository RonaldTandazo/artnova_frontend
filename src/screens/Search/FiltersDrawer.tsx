import { useColorMode } from "@/components/ui/color-mode";
import { Box, Button, CloseButton, Drawer, HStack, Icon, Portal, Text } from "@chakra-ui/react";
import { MdCancel } from "react-icons/md";
import { FiltersDrawerProps } from "@/custom/interfaces/Search/FiltersDrawer";
import { FaFilter } from "react-icons/fa";

const FiltersDrawer = ({
    isOpen,
    onClose, 
}: FiltersDrawerProps) => {
    const { colorMode } = useColorMode();

    return (
        <Drawer.Root 
            open={isOpen}
            onOpenChange={(e) => !e.open && onClose()}
            placement={"start"}
            size={"sm"}
        >
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title 
                                color={colorMode == 'light' ? 'black':'white'}
                            >
                                <HStack
                                    alignItems={"center"}
                                    justifyContent={"flex-start"}
                                >
                                    <Icon
                                        as={FaFilter}
                                    />
                                    <Text>Search Filters</Text>
                                </HStack>
                            </Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <Box mt={25}>
                                
                            </Box>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button 
                                color={colorMode == 'light' ? 'teal.400':'white'}
                                bg={colorMode == 'light' ? 'white':'black'}
                                borderColor={colorMode == 'light' ? 'teal.400':'white'}
                                onClick={onClose}
                            >
                                <MdCancel />
                                Cancel
                            </Button>
                            <Button
                                bg={colorMode === "light" ? "teal.400":"pink.600"}
                                color={"whiteAlpha.950"}
                                maxW={"45%"}
                            >
                                <FaFilter />
                                Apply
                            </Button>
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton 
                                size="sm"
                                color={colorMode == 'light' ? 'teal.400':'white'}
                                bg={colorMode == 'light' ? 'white':'black'}
                                borderColor={colorMode == 'light' ? 'teal.400':'white'}
                                onClick={onClose}
                            />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}

export default FiltersDrawer;