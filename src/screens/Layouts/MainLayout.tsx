import { Box, Show } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { Outlet, useLocation } from "react-router-dom";
import ThemeButton from "@/custom/Components/FloatingButtons/ThemeButton";
import NavBar from "@/custom/Components/NavBar/NavBar";
import ArtVerseButton from "@/custom/Components/FloatingButtons/ArtVerseButton";

const MainLayout = () => {
    const { colorMode } = useColorMode();
    const location = useLocation();
    const excludedRoutes = ['/'];
    const shouldShowButton = !excludedRoutes.includes(location.pathname);

    return (
        <Box 
            h={"100dvh"}
            w={"100dvw"}
            bg={colorMode === "light" ? "whiteAlpha.950" : "gray.950"}
            color={colorMode === "light" ? "black" : "white"}
            overflowY="auto"
            pb={5}
        >
                <NavBar />
                <ThemeButton />
                <Show
                    when={shouldShowButton}
                >
                    <ArtVerseButton />
                </Show>
                <Box mt={5} mx={5} h={"90dvh"}>
                    <Outlet />
                </Box>
        </Box>
    );
};

export default MainLayout;