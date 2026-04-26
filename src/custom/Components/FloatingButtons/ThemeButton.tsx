import { IconButton } from "@chakra-ui/react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { useColorMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";

const ThemeButton = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    
    return (
        <Tooltip
            content={`Switch To ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
            openDelay={250}
            closeDelay={100}
            unmountOnExit={true}
            lazyMount={true}
            positioning={{ placement: 'top-start' }}
            showArrow
            contentProps={{
                css: {
                    '--tooltip-bg': colorMode === 'light' ? 'colors.pink.600':'colors.teal.400',
                    'color': 'white',
                },
            }}
        >
            <IconButton
                aria-label="Toggle dark mode"
                position="fixed"
                bottom="20px"
                right="20px"
                onClick={toggleColorMode}
                size="lg"
                colorScheme="black"
                shadow="md"
                borderRadius="full"
                bg={colorMode === "light" ? "black" : "white"}    
                color={colorMode === "light" ? "white" : "black"}
                zIndex={2}
            >
                {colorMode === 'light' ? <BsFillMoonFill />:<BsFillSunFill/> }
            </IconButton>
        </Tooltip>
    );
}

export default ThemeButton;