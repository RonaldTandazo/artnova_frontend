import { Flex, Show } from "@chakra-ui/react";
import LoadingProgress from "../States/LoadingProgress";
import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

const AuthLoader = ({ children }: {
    children: ReactNode
}) => {
    const { loading } = useAuth(); 
    const { colorMode } = useColorMode();
     
    return (
        <Show
            when = {!loading}
            fallback = {
                <Flex 
                    w={"100dvw"}
                    h={"100dvh"}
                    align="center" 
                    justify="center"
                    bg={colorMode === "light" ? "gray.100" : "gray.950"}
                >
                    <LoadingProgress />
                </Flex>
            }
        >
            {children}
        </Show>
    );
}

export default AuthLoader;