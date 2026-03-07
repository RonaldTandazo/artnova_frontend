import { useColorMode } from '@/components/ui/color-mode';
import { Tooltip } from '@/components/ui/tooltip';
import { Box, FileUpload, Flex, For, Grid, GridItem, Icon, Image, Show } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { FaCropSimple } from 'react-icons/fa6';
import { LuUpload } from 'react-icons/lu';
import MultimediaDialog from '../Dialogs/MultimediaDialog';
import { convertBase64ToFile } from '@/utils/Helpers';

type FileInterface = {
    originalFile: File | string;
    crop: File | undefined;
    display: string;
};

const MultimediaCollector = ({ type, onUpdate, files, onError }: any) => {
    const [fileURL, setFileURL] = useState<string | undefined>(undefined)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { colorMode } = useColorMode();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [recropIndex, setRecropIndex] = useState<number | null>(null);
    const [allowTypes, setAllowTypes] = useState<string[]>([]);
    const [allowFileSize, setAllowFileSize] = useState<number | undefined>(undefined);
    const [maxSize, setMaxSize] = useState<string | undefined>(undefined);
    const [originalFile, setOriginalFile] = useState<File | undefined>(undefined);
    const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

    useEffect(() => {
        if(type == 'images'){
            setAllowTypes(["image/png", "image/jpeg", "image/gif", "image/webp"]);
            setAllowFileSize(100 * 1024 * 1024)
            setMaxSize('100MB')
        }else if(type == 'videos'){
            setAllowTypes(["video/mp4", "video/webm", "video/mpeg"]);
            setAllowFileSize(2 * 1024 * 1024 * 1024)
            setMaxSize('2GB')
        }
    }, [type])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return null;

        if (!allowTypes.includes(file.type)) {
            const allowedFileTypes = allowTypes.map(type => type.split('/')[1].toUpperCase()).join(', ');
            const errorMessage = `Invalid file type. Only ${allowedFileTypes} are allowed.`;
            onError(errorMessage);
            return;
        }

        if (allowFileSize && file.size > allowFileSize) {
            const errorMessage = `File size exceeds the limit of ${maxSize}.`;
            onError(errorMessage);
            return;
        }
        
        onError(undefined);
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setFileURL(reader.result?.toString() || '');
                setIsModalOpen(true);
                setRecropIndex(null);
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            setOriginalFile(file)
            const videoUrl = URL.createObjectURL(file);
            setFileURL(videoUrl);
            setIsModalOpen(true);
        }
    };

    const handleComplete = async (file: any) => {
        if (type == 'images') {
            if (recropIndex !== null) {
                const newFiles = [...files];
                const convertedFile = convertBase64ToFile(file, `cropped-image-${Date.now()}.jpg`);
                newFiles[recropIndex].crop = convertedFile;       
                newFiles[recropIndex].display = file;       
                onUpdate(type, newFiles);
                setRecropIndex(null);
            } else {
                if(fileURL){
                    const convertedFile = convertBase64ToFile(file, `cropped-image-${Date.now()}.jpg`);
                    const newFileObject = {
                        originalFile: fileURL,
                        crop: convertedFile,
                        display: file,
                    };
                    onUpdate(type, [...files, newFileObject]);
                }
            }

        }else if(type == 'videos' && file){
            const newFileObject = {
                originalFile: originalFile,
                crop: undefined,
                display: file,
            };
            onUpdate(type, [...files, newFileObject]);
        }

        setIsModalOpen(false);
        if (fileInputRef.current) { 
            fileInputRef.current.value = '';
        }

        setFileURL(undefined);
        setOriginalFile(undefined)
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setFileURL(undefined);
        setRecropIndex(null);
        setOriginalFile(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        const fileToRemove = files[indexToRemove];
        const newFiles = files.filter((_: FileInterface, index: number) => index !== indexToRemove);
        onUpdate(type, newFiles);

        if (type === 'videos' && fileToRemove.originalFile.startsWith('blob:')) {
            URL.revokeObjectURL(fileToRemove.originalFile);
        }
    }

    const handleCrop = (index: number) => {
        const fileToRecrop = files[index];
        setFileURL(fileToRecrop.originalFile);
        setIsModalOpen(true);
        setRecropIndex(index);
    }

    const fileUploadMessage = () => {
        const allowedExtensions = allowTypes.map(type => `.${type.split('/')[1]}`).join(', ');
        const message = `${allowedExtensions} up to ${maxSize}`;

        return message;
    }

    const handleHover = (index: number, isHovering: boolean) => {
        const video = videoRefs.current[index];
        if (video) {
            if (isHovering) {
                video.play();
            } else {
                video.pause();
                video.currentTime = 0;
            }
        }
    };

    return (
        <Flex
            gap={4}
            display="grid"
            gridTemplateColumns="repeat(5, 1fr)"
            gridAutoRows="auto"
            borderRadius={"sm"}
            p={5}
            mt={5}
            shadow={"inner"}
        >
            <For each={files}>
                {(file: FileInterface, index) => (
                    <Box
                        w={"full"}
                        h={"full"}
                        key={index}
                        borderRadius={"md"}
                    >
                        <Box
                            cursor={"pointer"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            bg={colorMode === 'light' ? 'cyan.600' : 'pink.600'}
                            color={'whiteAlpha.950'}
                            onMouseEnter={() => handleHover(index, true)}
                            onMouseLeave={() => handleHover(index, false)}
                        >
                            <Show
                                when={type == 'images'}
                            >
                                <Image
                                    src={file.display}
                                    alt="File Preview"
                                    //objectFit="cover" 
                                    cursor="pointer"
                                />
                            </Show>
                            <Show when={type == 'videos'}>
                                <video
                                    ref={el => { videoRefs.current[index] = el; }}
                                    src={file.display}
                                    loop
                                    muted
                                    // style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Show>
                        </Box>
                        <Box 
                            p={2} 
                            bg={colorMode === "light" ? "blackAlpha.300":"blackAlpha.950"}
                        >
                            <Grid
                                templateColumns="repeat(2, 1fr)"
                                display={"flex"}
                                justifyContent={"space-around"}
                                alignItems={"center"} 
                            >   
                                <Show when={type == 'images'}>
                                    <Tooltip
                                        content={"Crop"}
                                        openDelay={100}
                                        closeDelay={100}
                                        unmountOnExit={true}    
                                        lazyMount={true}
                                        positioning={{ placement: "top" }}
                                        showArrow
                                        contentProps={{ 
                                            css: { 
                                                "--tooltip-bg": colorMode === "light" ? "colors.cyan.600":"colors.pink.600",
                                                'color': 'white'
                                            }
                                        }}
                                    >    
                                        <GridItem
                                            colSpan={1} 
                                            display={"flex"} 
                                            alignItems={"center"} 
                                            justifyContent={"space-around"}
                                        >
                                            <Icon
                                                as={FaCropSimple}
                                                cursor="pointer"
                                                size={"md"}
                                                color={colorMode == 'light' ? "black":"white"}
                                                onClick={() => handleCrop(index)}
                                            />
                                        </GridItem>
                                    </Tooltip>
                                </Show>
                                <Tooltip
                                    content={"Remove"}
                                    openDelay={100}
                                    closeDelay={100}
                                    unmountOnExit={true}    
                                    lazyMount={true}
                                    positioning={{ placement: "top" }}
                                    showArrow
                                    contentProps={{ 
                                        css: { 
                                            "--tooltip-bg": colorMode === "light" ? "colors.cyan.600":"colors.pink.600",
                                            'color': 'white'
                                        }
                                    }}
                                >    
                                    <GridItem 
                                        colSpan={1} 
                                        display={"flex"} 
                                        alignItems={"center"} 
                                        justifyContent={"space-around"}
                                    >
                                        <Icon
                                            as={FaTrash}
                                            cursor="pointer"
                                            size={"md"}
                                            color={"tomato"}
                                            onClick={() => {
                                                handleRemoveFile(index)
                                            }}
                                        />
                                    </GridItem>
                                </Tooltip>
                            </Grid>
                        </Box>
                    </Box>
                )}
            </For>

            <FileUpload.Root alignItems="stretch" maxFiles={1} accept={allowTypes} cursor={"pointer"}>
                <FileUpload.HiddenInput onChange={(files) => handleFileChange(files)}/>
                <FileUpload.Dropzone w={"full"} h={"full"}>
                    <Icon size={"lg"} color={"fg.muted"}>
                        <LuUpload />
                    </Icon>
                    <FileUpload.DropzoneContent>
                        <Box>Drag and drop files here</Box>
                        <Box color="fg.muted">{fileUploadMessage()}</Box>
                    </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
            </FileUpload.Root>

            <MultimediaDialog type={type} isOpen={isModalOpen} fileURL={fileURL} onClose={handleClose} onComplete={handleComplete}/>
        </Flex>
    );
}

export default MultimediaCollector;