import { Avatar, Button, Menu, Portal, Show } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { BACKEND_URL } from "@/utils/Helpers";
import { MdManageAccounts } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { AccountTriggerProps } from "@/custom/interfaces/NavBar/AccountTrigger";

const AccountTrigger = ({ user, logout, navigateTo }: AccountTriggerProps) => {
    return (
        <Menu.Root lazyMount>
            <Menu.Trigger asChild>
                <Button bg={"transparent"} color={"transparent"} borderRadius={"full"} width={"0px"}>
                    <Avatar.Root
                        key={"subtle"} 
                        variant={"subtle"}
                        cursor={"pointer"}
                    >
                        <Show
                            when={user && user.avatar}
                            fallback={
                                <Avatar.Fallback name={user?.username} />
                            }
                        >
                            <Avatar.Image src={`${BACKEND_URL}/avatars/${user.avatar}`} />
                        </Show>
                    </Avatar.Root>
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content zIndex={"toast"}>
                        <Menu.Arrow />
                        <Menu.ItemGroup>
                            <Menu.Item 
                                value="profile" 
                                onClick={() => navigateTo('OwnProfile', 'Profile')} 
                                cursor={"pointer"}
                            >
                                <FaUser />
                                Profile
                            </Menu.Item>
                            <Menu.Item 
                                value="edit-profile" 
                                onClick={() => navigateTo('OwnProfile', 'ProfileSettings')} 
                                cursor={"pointer"}
                            >
                                <MdManageAccounts />
                                Profile Settings
                            </Menu.Item>
                        </Menu.ItemGroup>

                        <Menu.Separator />
                        
                        <Menu.ItemGroup>
                            <Menu.Item 
                                value="sign-out" 
                                onClick={() => logout()} 
                                cursor={"pointer"}
                                color="fg.error"
                                _hover={{ bg: "bg.error", color: "fg.error" }}
                            >
                                <CiLogout /> Sign Out
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
}

export default AccountTrigger; 