import { useColorMode } from "@/components/ui/color-mode";
import { TimeGridProps } from "@/custom/interfaces/NewArtwork/ScheduleDrawer";
import { Button, For, Show, Stack, Text } from "@chakra-ui/react";

export const TimeGrid = ({ 
    slots, 
    selectedTime, 
    onTimeClick, 
    formatTime 
}: TimeGridProps) => {
    const { colorMode } = useColorMode();
    
    return (
        <Stack gap="2" px="4" pb="4" flex="1" overflowY="auto" maxH="500px">
            <Show
                when={slots.length > 0}
                fallback={
                    <Text textAlign="center" color="fg.muted">
                        No available times for today
                    </Text>
                }
            >
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
                                    ? (colorMode === "light" ? "teal.400" : "pink.600")
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
            </Show>
        </Stack>
    );
};