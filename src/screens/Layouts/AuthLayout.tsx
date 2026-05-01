import { useColorMode } from "@/components/ui/color-mode";
import ArtVerseButton from "@/custom/components/FloatingButtons/ArtVerseButton";
import ThemeButton from "@/custom/components/FloatingButtons/ThemeButton";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    const { colorMode } = useColorMode();

    return (
        <Box 
            h={"100dvh"}
            w={"100dvw"}
            bg={colorMode === "light" ? "whiteAlpha.950" : "gray.950"}
        >
            <ThemeButton />
            <ArtVerseButton />

            <Outlet />
        </Box>
    );
};

export default AuthLayout;
