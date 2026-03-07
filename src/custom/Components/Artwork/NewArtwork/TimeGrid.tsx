import { useColorMode } from "@/components/ui/color-mode";
import { TimeGridProps } from "@/custom/interfaces/NewArtwork/ScheduleDrawer";
import { Button, For, Stack } from "@chakra-ui/react";

export const TimeGrid = ({ 
    slots, 
    selectedTime, 
    onTimeClick, 
    formatTime 
}: TimeGridProps) => {
    const { colorMode } = useColorMode();
    
    return (
        <Stack gap="2" px="4" pb="4" flex="1" overflowY="auto" maxH="500px">
            <For
                each={slots}
            >
                {(time) => {
                    const label = formatTime(time);
                    const isSelected = selectedTime != null && selectedTime.compare(time) === 0;

                    return (
                        <Button
                            key={label}
                            size="sm"
                            rounded="lg"
                            fontWeight="normal"
                            onClick={() => onTimeClick(time)}
                            bg={isSelected
                                ? (colorMode === "light" ? "cyan.600" : "pink.600")
                                : (colorMode === "light" ? "white" : "black")
                            }
                            color={isSelected
                                ? ("white")
                                : (colorMode === "light" ? "black" : "white")
                            }
                            borderColor={isSelected ? "white" : "black"}
                        >
                            {label}
                        </Button>
                    );
                }}
            </For>
        </Stack>
    );
};