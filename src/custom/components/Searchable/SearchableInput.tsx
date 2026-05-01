import { useColorMode } from "@/components/ui/color-mode";
import { SelectOptions } from "@/custom/interfaces/General/GeneralInterfaces";
import { SearchableInputProps } from "@/custom/interfaces/Searchable/SearchableInput";
import { Select, Input, Box, Portal, For, createListCollection } from "@chakra-ui/react";
import { useState, useRef, useEffect, useMemo } from "react";

const SearchableInput = ({ 
    placeholder = "Select Options",
    options = [],
    onSelect,
}: SearchableInputProps) => {
    const [filteredOptions, setFilteredOptions] = useState<SelectOptions[]>(options);
    const { colorMode } = useColorMode();
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const collection = useMemo(() =>
        createListCollection({
            items: filteredOptions
        }),
        [filteredOptions]
    );

    useEffect(() => {
        if(filteredOptions.length <= 0){
            setFilteredOptions(options)
        }
    }, [options]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setFilteredOptions(
            options.filter((option) =>
                option.label.toLowerCase().includes(term)
            )
        );
    };

    const handleOnSelect = (option: SelectOptions) => {
        handleSearch("")
        onSelect(option, "add")
    }

    const onBlur = () => {
        setSearchTerm("")
        setFilteredOptions(options)
    }

    return ( 
        <Select.Root
            collection={collection}
        >
            <Select.HiddenSelect />

            <Select.Control>
                <Select.Trigger onClick={() => {setIsOpen(true)}} bg={"transparent"} border={"solid thin"} borderColor={colorMode === "light" ? "gray.200" : "whiteAlpha.300"} rounded={"sm"} onBlur={onBlur}>
                    <Select.ValueText>
                        {placeholder}
                    </Select.ValueText>
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content ref={ref} display={isOpen ? "block":"none"}>
                        <Box p={2}>
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                color={colorMode === "light" ? "black":"white"}
                            />
                        </Box>
                        <For each={filteredOptions}>
                            {(option) =>(
                                <Select.Item 
                                    item={option}
                                    key={option.value}
                                    color={colorMode === "light" ? "black":"white"}
                                    cursor="pointer"
                                    onClick={() => handleOnSelect(option)}
                                >
                                    {option.label}
                                </Select.Item>
                            )}
                        </For>
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

export default SearchableInput;