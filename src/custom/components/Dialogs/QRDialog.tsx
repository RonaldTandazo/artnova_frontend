import { useColorMode } from "@/components/ui/color-mode";
import { Button, Dialog, HStack, Icon, Portal, Text, VStack } from "@chakra-ui/react";
import { BsQrCodeScan } from "react-icons/bs";
import { QRCodeSVG } from 'qrcode.react';
import { FaCheckCircle } from "react-icons/fa";
import { QRDialogProps } from "@/custom/interfaces/Dialogs/QRDialog";

const QRDialog = ({
    isOpen,
    onClose
}: QRDialogProps) => {
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
                                        as={BsQrCodeScan}
                                        size={"xl"}
                                        color={"whiteAlpha.950"}
                                    />
                                    <Text
                                        color={"whiteAlpha.950"}
                                    >
                                        View Model in Augmented Reality
                                    </Text>
                                </HStack>
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body 
                            w={"full"} 
                            h={"full"}
                        >
                            <VStack
                                alignItems={"center"}
                                justifyContent={"center"}
                                gap={5}
                            >
                                <QRCodeSVG 
                                    value={window.location.href} 
                                    size={200}
                                    level="H"
                                />

                                <Text
                                    fontSize={"md"}
                                    whiteSpace="pre-line"
                                    color={colorMode === 'light' ? 'blackAlpha.950':'whiteAlpha.950'}
                                >
                                    Scan this code with your mobile camera to project the 3D model in your space
                                </Text>
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    bg={colorMode === "light" ? "teal.400":"pink.600"}
                                    color={"whiteAlpha.950"}
                                    onClick={onClose}
                                >
                                    <FaCheckCircle /> Accept
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default QRDialog;