import { 
  Box, Button, CloseButton, Editable, For, HStack, IconButton, Input, InputGroup, 
  Separator, Show, Slider, Switch, Text, VStack 
} from '@chakra-ui/react';
import { useState } from 'react';
import { 
  LuAnchor, LuChevronDown, LuChevronUp, LuSearch, LuSettings2 
} from 'react-icons/lu';
import { GrPowerReset } from 'react-icons/gr';
import { useColorMode } from '@/components/ui/color-mode';
import { SceneEditorProps } from '@/custom/interfaces/3DFile/SceneEditor';
import { Tooltip } from '@/components/ui/tooltip';
import { IoMdHelpCircle } from 'react-icons/io';
import { helpText } from '@/utils/Helpers';

const SceneEditor = ({
    config,
    setConfig,
    onSaveAsDefault,
    onReset,
    allowSetDefault = true
}: SceneEditorProps) => {
    const { colorMode } = useColorMode();
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");

    const isVisible = (label: string) => label.toLowerCase().includes(search.toLowerCase());

    const HelpButton = ({ label }: { label: string }) => (
        <Tooltip content={helpText[label] || "Not Descripction Available"} portalled showArrow>
            <Box as="span" ml={1} cursor="help" color="whiteAlpha.600" _hover={{ color: "teal.300" }}>
                <IoMdHelpCircle size={14} />
            </Box>
        </Tooltip>
    );

    const EditableValue = ({ val, onChange }: { val: number, onChange: (n: number) => void })=> (
        <Editable.Root
            value={val.toString()}
            onValueChange={(e) => onChange(parseFloat(e.value) || 0)}
            size={"sm"}
            w={"20%"}
        >
            <Editable.Preview border={"1px dashed"} borderColor={"whiteAlpha.400"} px={2} fontSize={"small"} />
            <Editable.Input />
        </Editable.Root>
    );

    const ToggleOption = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
        <HStack justify="space-between" alignItems={"center"} display={isVisible(label) ? "flex" : "none"}>
            <HStack alignItems={"center"} gap={1}>
                <Text fontSize="sm" color="whiteAlpha.950">{label}</Text>
                <HelpButton label={label} />
            </HStack>
            <Switch.Root checked={checked} onCheckedChange={(e) => onChange(e.checked)}>
                <Switch.HiddenInput />
                <Switch.Control />
            </Switch.Root>
        </HStack>
    );

    const clearSearch = search ? (
        <CloseButton
            size="xs"
            onClick={() => {
                setSearch("")
            }}
            me="-2"
        />
    ) : undefined

    return (
        <VStack
            position="absolute"
            left={4} top={4} zIndex={20}
            bg="blackAlpha.900"
            borderRadius="md"
            color="white"
            align="stretch"
            w="320px"
            shadow="2xl"
            border="1px solid"
            borderColor="whiteAlpha.300"
            maxH={isExpanded ? "80vh" : "fit-content"}
            overflow="hidden" 
            gap={0}
        >
            {/* --- CABECERA FIJA --- */}
            <Box p={4}>
                <HStack justify="space-between" cursor="pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    <HStack gap={2}>
                        <LuSettings2 color={"white"} />
                        <Text fontWeight="bold" fontSize="md">Scene Editor</Text>
                    </HStack>
                    <IconButton size="xs" variant="ghost" color="white">
                        {isExpanded ? <LuChevronUp /> : <LuChevronDown />}
                    </IconButton>
                </HStack>

                <Show when={isExpanded}>
                    <Separator my={3} opacity={0.2} />
                    <InputGroup 
                        w="full"
                        startElement={<LuSearch size={14} color="white" />}
                        endElement={clearSearch}
                    >
                        <Input
                            placeholder="Search Options..."
                            size="sm"
                            variant="subtle"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            _placeholder={{ color: "gray.500" }}
                            bg="whiteAlpha.100"
                        />
                    </InputGroup>
                </Show>
            </Box>

            <Show when={isExpanded}>
                {/* --- CUERPO SCROLLABLE --- */}
                <Box 
                    px={4} 
                    pb={4}
                    flex="1" 
                    overflowY="auto"
                    css={{
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.2)', borderRadius: '10px' },
                    }}
                >
                    <VStack align="stretch" gap={6} mt={2}>
                        {/* Light Direction Section */}
                        {isVisible("Light Direction") && (
                            <Box>
                                <HStack mb={3} gap={1} alignItems={"center"}>
                                    <Text fontSize="sm" color="teal.300" fontWeight="bold">Light Direction</Text>
                                    <HelpButton label="Light Direction" />
                                </HStack>
                                <For each={['X', 'Y', 'Z']}>
                                    {(axis, index) => (
                                        <Box key={axis} mb={3}>
                                            <HStack justify="space-between" alignItems={"center"} mb={1}>
                                                <Text fontSize="12px" color="whiteAlpha.800">{axis} Axis</Text>
                                                <EditableValue
                                                    val={config.lightPosition[index]}
                                                    onChange={
                                                        (e) => {
                                                            const newPos = [...config.lightPosition] as [number, number, number];
                                                            newPos[index] = e;
                                                            setConfig({ ...config, lightPosition: newPos });
                                                        }
                                                    } 
                                                />
                                            </HStack>
                                            <Slider.Root
                                                value={[config.lightPosition[index]]}
                                                min={-20} max={20} step={0.5}
                                                onValueChange={(e) => {
                                                    const newPos = [...config.lightPosition] as [number, number, number];
                                                    newPos[index] = e.value[0];
                                                    setConfig({ ...config, lightPosition: newPos });
                                                }}
                                            >
                                                <Slider.Control>
                                                    <Slider.Track><Slider.Range bg="yellow.400" /></Slider.Track>
                                                    <Slider.Thumb index={0} />
                                                </Slider.Control>
                                            </Slider.Root>
                                        </Box>
                                    )}
                                </For>
                            </Box>
                        )}

                        {/* Intensity Slider */}
                        <Box display={isVisible("Lighting Intensity") ? "block" : "none"}>
                            <HStack justify="space-between" alignItems={"center"} mb={2}>
                                <HStack alignItems={"center"} gap={"1"}>
                                    <Text fontSize="sm">Lighting Intensity</Text>
                                    <HelpButton label="Lighting Intensity" />
                                </HStack>
                                <EditableValue
                                    val={config.intensity[0]}
                                    onChange={(n) => setConfig({ ...config, intensity: [n] })}
                                />
                            </HStack>
                            <Slider.Root
                                value={config.intensity}
                                onValueChange={(e) => setConfig({ ...config, intensity: e.value })}
                                min={0} max={10} step={0.1}
                            >
                                <Slider.Control>
                                    <Slider.Track bg="whiteAlpha.200"><Slider.Range bg="teal.400" /></Slider.Track>
                                    <Slider.Thumb index={0} />
                                </Slider.Control>
                            </Slider.Root>
                        </Box>

                        {/* Exposure Slider */}
                        <Box display={isVisible("Exposure") ? "block" : "none"}>
                            <HStack justify="space-between" alignItems={"center"} mb={2}>
                                <HStack alignItems={"center"} gap={"1"}>
                                    <Text fontSize="sm">Exposure</Text>
                                    <HelpButton label="Exposure" />
                                </HStack>
                                <EditableValue
                                    val={config.exposure[0]}
                                    onChange={(n) => setConfig({ ...config, exposure: [n] })}
                                />
                            </HStack>
                            <Slider.Root
                                value={config.exposure}
                                onValueChange={(e) => setConfig({ ...config, exposure: e.value })}
                                min={0} max={3} step={0.01}
                            >
                                <Slider.Control>
                                    <Slider.Track bg="whiteAlpha.200"><Slider.Range bg="pink.400" /></Slider.Track>
                                    <Slider.Thumb index={0} />
                                </Slider.Control>
                            </Slider.Root>
                        </Box>

                        {/* Toggles */}
                        <VStack align="stretch" gap={3}>
                            <ToggleOption 
                                label="Contact Shadows" 
                                checked={config.contactShadow} 
                                onChange={(v) => setConfig({...config, contactShadow: v})} 
                            />
                            <ToggleOption 
                                label="Auto Rotate" 
                                checked={config.autoRotate} 
                                onChange={(v) => setConfig({...config, autoRotate: v})} 
                            />
                            <ToggleOption 
                                label="Fixed Framing (Stage)" 
                                checked={config.lockCameraReset} 
                                onChange={(v) => setConfig({...config, lockCameraReset: v})} 
                            />
                            <ToggleOption 
                                label="Freeze Mouse (Orbit)" 
                                checked={config.lockInteraction} 
                                onChange={(v) => setConfig({...config, lockInteraction: v})} 
                            />
                        </VStack>

                        {/* Color Picker */}
                        <HStack justify="space-between" display={isVisible("Background") ? "flex" : "none"}>
                            <HStack alignItems={"center"} gap={1}>
                                <Text fontSize="sm">Background</Text>
                                <HelpButton label="Background" />
                            </HStack>
                            <input
                                type="color"
                                value={config.backgroundColor}
                                onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                                style={{ width: '30px', height: '30px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                            />
                        </HStack>
                    </VStack>
                </Box>

                {/* --- FOOTER FIJO --- */}
                <Box p={4} borderTop="1px solid" borderColor="whiteAlpha.200" bg="black">
                    <HStack gap={2}>
                        <Show when={allowSetDefault}>
                            <Button
                                size="xs"
                                flex={1}
                                bg={colorMode === "light" ? "teal.500" : "pink.600"}
                                color={"white"}
                                onClick={onSaveAsDefault}
                            >
                                <LuAnchor /> Set as Default
                            </Button>
                        </Show>

                        <Button
                            size={"xs"}
                            flex={1}
                            bg={"red.600"}
                            color={"white"}
                            onClick={onReset}
                        >
                            <GrPowerReset /> Reset
                        </Button>
                    </HStack>
                </Box>
            </Show>
        </VStack>
    );
};

export default SceneEditor;