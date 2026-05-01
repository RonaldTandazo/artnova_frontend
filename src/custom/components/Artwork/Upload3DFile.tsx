import { Upload3DFileProps } from '@/custom/interfaces/3DFile/Upload3DFile';
import { Badge, Box, FileUpload, Flex, HStack, Icon } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react'
import { LuUpload } from 'react-icons/lu';

const MAX_SIZE_BYTES = 50 * 1024 * 1024 * 1024;
const VALID_EXTENSIONS = ['gltf', 'glb', 'bin', 'jpg', 'jpeg', 'png', 'webp'];

const Upload3DFile = ({
    onUpdate,
    onError
}: Upload3DFileProps) => {
    const [status, setStatus] = useState({
        hasGltf: false,
        hasBin: false,
        textureCount: 0,
    });
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return;

        const rawFiles = Array.from(fileList);

        const validFiles = rawFiles.filter(file => {
            const extension = file.name.split('.').pop()?.toLowerCase() || '';
            const isValidExt = VALID_EXTENSIONS.includes(extension);
            const isValidSize = file.size <= MAX_SIZE_BYTES;

            if (!isValidExt) console.warn(`File skipped (invalid type): ${file.name}`);
            if (!isValidSize) onError(`File ${file.name} is too large (Max 50GB).`);

            return isValidExt && isValidSize;
        });

        if (validFiles.length === 0) return;

        const mainFile = validFiles.find(f => f.name.endsWith('.gltf') || f.name.endsWith('.glb'));
        const binFile = validFiles.find(f => f.name.endsWith('.bin'));
        const textures = validFiles.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name));

        setStatus({
            hasGltf: !!mainFile,
            hasBin: !!binFile,
            textureCount: textures.length
        });

        if (!mainFile) {
            onError("Main 3D file (.gltf or .glb) not found in the selection.");
            return;
        }

        if (mainFile.name.endsWith('.gltf') && !binFile) {
            onError("This .gltf requires a .bin file to load correctly.");
            return;
        }

        const fileMap = new Map<string, string>();
        const objectURLs: string[] = [];

        validFiles.forEach(f => {
            const url = URL.createObjectURL(f);
            objectURLs.push(url);
            fileMap.set(f.name, url);
        });

        onUpdate({
            originalFile: mainFile,
            display: fileMap.get(mainFile.name),
            assetMap: fileMap,
            allURLs: objectURLs,
            type: mainFile.name.endsWith('.glb') ? 'glb' : 'gltf'
        });
    };

    return (
        <Flex direction="column" gap={4} p={5} mt={5} border="2px dashed" borderColor="whiteAlpha.300" borderRadius="md">
            <HStack justify="space-around" fontSize="xs">
                <Badge colorPalette={status.hasGltf ? "green" : "red"}>
                    {status.hasGltf ? "✔ Model Found" : "✘ No Model"}
                </Badge>
                <Badge colorPalette={status.hasBin ? "green" : "red"}>
                    {status.hasBin ? "✔ Binary Found" : "✘ Missing .bin"}
                </Badge>
                <Badge colorPalette={status.textureCount > 0 ? "green" : "yellow"}>
                    {status.textureCount} Textures
                </Badge>
            </HStack>

            <FileUpload.Root maxFiles={50} accept=".gltf,.glb,.bin,image/*">
                <FileUpload.HiddenInput 
                    multiple 
                    onChange={handleFileChange} 
                />
                <FileUpload.Dropzone w={"full"} cursor="pointer">
                    <Icon size={"lg"} color={"fg.muted"}><LuUpload /></Icon>
                    <FileUpload.DropzoneContent>
                        <Box fontWeight="bold">Drag & Drop files</Box>
                        <Box fontSize="xs" color="fg.muted">.glb, .gltf, .bin and images up to 50GB</Box>
                    </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
            </FileUpload.Root>
        </Flex>
    );
}

export default Upload3DFile;