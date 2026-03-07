import { useColorMode } from "@/components/ui/color-mode";
import { Box, Button, CloseButton, Drawer, HStack, Icon, Portal, Text, DatePicker, Stack, Center } from "@chakra-ui/react";
import { useState } from "react";
import { FaCalendarCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { type DateValue, Time, getLocalTimeZone, isToday } from "@internationalized/date"
import { TimeGrid } from "./TimeGrid";
import { formatMonthDay, formatTime, formatWeekday, generateTimeSlots } from "@/utils/Helpers";
import { ScheduleDrawerProps } from "@/custom/interfaces/NewArtwork/ScheduleDrawer";

const ScheduleDrawer = ({
    isOpen,
    interval = 30,
    onClose, 
    onSchedule
}: ScheduleDrawerProps) => {
    const { colorMode } = useColorMode();
    const [selectedDate, setSelectedDate] = useState<DateValue[]>([])
    const [selectedTime, setSelectedTime] = useState<Time | undefined>(undefined)
    
    const tz = getLocalTimeZone();
    const date = selectedDate[0];
    const slots = date ? generateTimeSlots(interval) : [];
    const nativeDate = date?.toDate(tz);

    const handleDateChange = (details: { value: DateValue[] }) => {
        setSelectedDate(details.value)
        setSelectedTime(undefined)
    }

    const handleTimeClick = (time: Time) => {
        setSelectedTime(
            selectedTime && selectedTime.compare(time) === 0 ? undefined : time,
        )
    }

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
                                        as={RiCalendarScheduleFill}
                                    />
                                    <Text>Schedule Post</Text>
                                </HStack>
                            </Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <Text color={colorMode == 'light' ? 'black':'white'}>
                                Set the date and time when your artwork will be published
                            </Text>
                            <Box mt={25}>
                                <DatePicker.Root
                                    inline
                                    value={selectedDate}
                                    onValueChange={handleDateChange}
                                >
                                    <DatePicker.Content unstyled px="3" pb="4">
                                        <DatePicker.View view="day">
                                            <HStack justify="space-between" gap="0">
                                                <DatePicker.PrevTrigger
                                                    bg={colorMode === "light" ? "cyan.600":"black"}
                                                >
                                                    <Icon 
                                                        as={FaChevronLeft}
                                                        color={colorMode == 'light' ? 'white':'pink.600'}
                                                    />
                                                </DatePicker.PrevTrigger>
                                                <DatePicker.RangeText 
                                                    fontWeight="medium"
                                                    textStyle="sm"
                                                    color={colorMode === 'light' ? 'black':'white'}
                                                />
                                                <DatePicker.NextTrigger
                                                    bg={colorMode === "light" ? "cyan.600":"black"}
                                                >
                                                    <Icon 
                                                        as={FaChevronRight}
                                                        color={colorMode == 'light' ? 'white':'pink.600'}
                                                    />
                                                </DatePicker.NextTrigger>
                                            </HStack>
                                            <DatePicker.DayTable
                                                color={colorMode === 'light' ? 'black':'white'}

                                            />
                                        </DatePicker.View>
                                    </DatePicker.Content>
                                </DatePicker.Root>

                                <Stack minW="240px" flex="1">
                                    {date && nativeDate ? (
                                        <Stack gap="0" flex="1">
                                            <Stack gap="0" px="5" pt="5" pb="3">
                                                <Text fontWeight="semibold">
                                                    {isToday(date, tz) ? "Today" : formatWeekday(nativeDate)}
                                                </Text>
                                                <Text textStyle="sm" color="fg.muted">
                                                    {formatMonthDay(nativeDate)}
                                                </Text>
                                            </Stack>

                                            <TimeGrid
                                                slots={slots}
                                                selectedTime={selectedTime}
                                                onTimeClick={handleTimeClick}
                                                formatTime={formatTime}
                                            />
                                        </Stack>
                                    ) : (
                                        <Center height="full" px="8" py="10" color="fg.muted">
                                            <Stack align="center" gap="1" textAlign="center">
                                                <Text textStyle="sm" fontWeight="medium">
                                                    Select a date
                                                </Text>
                                                <Text textStyle="xs">Available time slots will appear here</Text>
                                            </Stack>
                                        </Center>
                                    )}
                                </Stack>
                            </Box>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button 
                                color={colorMode == 'light' ? 'cyan.600':'white'}
                                bg={colorMode == 'light' ? 'white':'black'}
                                borderColor={colorMode == 'light' ? 'cyan.600':'white'}
                                onClick={onClose}
                            >
                                <MdCancel />
                                Cancel
                            </Button>
                            <Button
                                bg={colorMode === "light" ? "cyan.600":"pink.600"}
                                color={"whiteAlpha.950"}
                                maxW={"45%"}
                                disabled={!date || !selectedTime} 
                                onClick={() => onSchedule(date, selectedTime!)}
                            >
                                <FaCalendarCheck />
                                Schedule
                            </Button>
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton 
                                size="sm"
                                color={colorMode == 'light' ? 'cyan.600':'white'}
                                bg={colorMode == 'light' ? 'white':'black'}
                                borderColor={colorMode == 'light' ? 'cyan.600':'white'}
                                onClick={onClose}
                            />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}

export default ScheduleDrawer;