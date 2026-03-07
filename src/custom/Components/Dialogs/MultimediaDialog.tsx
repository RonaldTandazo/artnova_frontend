import { useColorMode } from "@/components/ui/color-mode";
import { MultimediaDialogProps } from "@/custom/interfaces/Dialogs/MultimediaDialog";
import { getCroppedImg } from "@/utils/CanvasCrop";
import { Button, Dialog, HStack, Icon, Image, Portal, Show, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCrop } from "react-icons/io";
import { MdCancel, MdSlowMotionVideo } from "react-icons/md";
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from "react-image-crop";

const MultimediaDialog = ({
    type,
    isOpen,
    fileURL,
    aspectRatio,
    onClose,
    onComplete
}: MultimediaDialogProps) => {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [scale] = useState<number>(1);
    const [rotate] = useState<number>(0);
    const imgRef = useRef<HTMLImageElement>(null);
    const { colorMode } = useColorMode();

    useEffect(() => {
        if (!isOpen) {
            setCrop(undefined);
            setCompletedCrop(null);
        }
    }, [isOpen]);

    function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: "%",
                    width: 90,
                },
                aspect,
                mediaWidth,
                mediaHeight
            ),
            mediaWidth,
            mediaHeight
        );
    }

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if(!aspectRatio){
            aspectRatio = 1/1
        }
        
        const { width, height } = e.currentTarget;
        const initialCrop = centerAspectCrop(width, height, aspectRatio);
        setCrop(initialCrop);
    };

    const handleConfirm = async () => {
        if (type == 'images' && imgRef.current && completedCrop) {
            const croppedImageUrl = getCroppedImg(imgRef.current, completedCrop, rotate, scale);
            onComplete(croppedImageUrl);
        }else if(type == 'videos' && fileURL){
            onComplete(fileURL);
        }

        onClose();
    };
    
    const handleClose = () => {
        onClose();
    }

    const onCropChange = (newCrop: Crop) => {
        console.log(newCrop)
        setCrop(newCrop);
    };

    const onCropComplete = (newCompletedCrop: PixelCrop) => {
        setCompletedCrop(newCompletedCrop);
    };

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
                        <Dialog.Header bg={colorMode === "light" ? "cyan.600":"blackAlpha.500"}>
                            <Dialog.Title>
                                <HStack
                                    justifyContent={"flex-start"}
                                    alignItems={"center"}
                                >
                                    <Icon
                                        as={type == 'images' ? IoMdCrop : MdSlowMotionVideo}
                                        size={"xl"}
                                    />
                                    <Text>
                                        {type == 'images' ? "Crop Image":"Video Player"}
                                    </Text>
                                </HStack>
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body w={"full"} h={"full"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Show
                                when={type == 'images'}
                            >
                                <Show when={fileURL}>
                                    <ReactCrop
                                        crop={crop}
                                        {...(aspectRatio && { aspect: aspectRatio })}
                                        minHeight={100}
                                        onChange={onCropChange}
                                        onComplete={onCropComplete}
                                        keepSelection
                                    >
                                        <Image
                                            ref={imgRef}
                                            alt="Image Crop"
                                            src={fileURL}
                                            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                            onLoad={onImageLoad}
                                        />
                                    </ReactCrop>
                                </Show>
                            </Show>
                            <Show 
                                when={type == 'videos'}
                            >
                                <video
                                    src={fileURL}
                                    controls
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </Show>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    color={colorMode == 'light' ? 'cyan.600':'white'}
                                    bg={colorMode == 'light' ? 'white':'black'}
                                    borderColor={colorMode == 'light' ? 'cyan.600':'white'}
                                    onClick={handleClose}
                                >
                                    <MdCancel /> Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                bg={colorMode === "light" ? "cyan.600":"pink.600"}
                                color={"whiteAlpha.950"}
                                onClick={handleConfirm}
                            >
                                <FaCheckCircle /> Confirm
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default MultimediaDialog;