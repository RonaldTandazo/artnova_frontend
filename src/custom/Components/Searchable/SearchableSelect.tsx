import { useColorMode } from "@/components/ui/color-mode";
import { SelectOptions } from "@/custom/interfaces/general/GeneralInterfaces";
import { SearchableSelectProps } from "@/custom/interfaces/Searchable/SearchableSelect";
import {
  Select,
  Input,
  Box,
  Portal,
  Show,
  For,
  createListCollection
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";

const SearchableSelect = ({
  disabled = false,
  placeholder = "Select Options",
  options = [],
  field,
  multiple = false,
  defaultValue = undefined,
}: SearchableSelectProps) => {
    const { colorMode } = useColorMode();

    const [filteredOptions, setFilteredOptions] = useState<SelectOptions[]>(options);
    const [selectedOptions, setSelectedOptions] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const collection = useMemo(
        () =>
        createListCollection({
            items: filteredOptions
        }),
        [filteredOptions]
    );

    const valueArray = Array.isArray(field?.value)
        ? field.value
        : field?.value
        ? [field.value]
        : [];

    useEffect(() => {
        setFilteredOptions(options);
        console.log(options)
        if (defaultValue && options.length > 0) {
            const values = Array.isArray(defaultValue) ? defaultValue : [defaultValue];

            field.onChange(values);

            if (multiple) {
                const matched = options.filter((o: any) => values.includes(o.value));
                setSelectedOptions(matched.map((o: any) => o.label).join(", "));
            } else {
                const selected = options.find((o: any) => o.value === values[0]);
                setSelectedOptions(selected?.label || "");
            }
        }
    }, [options, defaultValue]);

    const handleSearch = (e: any) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        setFilteredOptions(
            options.filter((option: any) =>
                option.label.toLowerCase().includes(term)
            )
        );
    };

    const handleValueChange = ({ value }: { value: string[] }) => {
        field.onChange(value);

        if (!value.length) {
            setSelectedOptions(undefined);
            return;
        }

        if (multiple) {
            const matched = options.filter((o: any) => value.includes(o.value));
            setSelectedOptions(matched.map((o: any) => o.label).join(", "));
        } else {
            const selected = options.find((o: any) => o.value === value[0]);
            setSelectedOptions(selected?.label || "");
        }

        resetFields();
    };
    
    const handleClear = () => {
        field.onChange(undefined);
        setSelectedOptions(undefined);
        resetFields();
    };

    const resetFields = () => {
        setSearchTerm("");
        setFilteredOptions(options);
    }

    return (
        <Select.Root
            multiple={multiple}
            collection={collection}
            name={field.name}
            value={valueArray}
            onValueChange={handleValueChange}
            disabled={disabled}
            lazyMount
        >
            <Select.HiddenSelect />

            <Select.Control>
                <Select.Trigger
                    bg="transparent"
                    border="solid thin"
                    borderColor={colorMode === "light" ? "gray.200" : "whiteAlpha.300"}
                    rounded="sm"
                >
                    <Select.ValueText>
                        <Show when={selectedOptions} fallback={placeholder}>
                            {selectedOptions}
                        </Show>
                    </Select.ValueText>
                </Select.Trigger>

                <Select.IndicatorGroup>
                    <Select.ClearTrigger
                        onClick={handleClear}
                        color={colorMode === "light" ? "cyan.600" : "pink.600"}
                        bg="transparent"
                    />
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>

            <Portal>
                <Select.Positioner>
                    <Select.Content>

                        <Box
                            p={2}
                            position="sticky"
                            top="0"
                            zIndex="sticky"
                            bg={colorMode === "light" ? "white" : "gray.950"}
                        >
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearch}
                                color={colorMode === "light" ? "black" : "white"}
                            />
                        </Box>

                        <For each={collection.items}>
                            {(item) => (
                                <Select.Item 
                                    key={item.value}
                                    item={item}
                                    cursor={"pointer"}
                                    color={colorMode === 'light' ? "black":"white"}
                                >
                                    {item.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            )}
                        </For>

                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

export default SearchableSelect;