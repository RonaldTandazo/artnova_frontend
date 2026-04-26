import React, { useState, useRef } from 'react';
import { Flex, Grid, GridItem, Text, Button, Menu, Portal, Icon, Separator, Input, Field, Show } from '@chakra-ui/react';
import { GrMenu } from 'react-icons/gr';
import { AiFillEdit } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';
import { useForm, Controller } from 'react-hook-form';
import IconsSocialMedia from './IconsSocialMedia';
import SearchableSelect from '../Searchable/SearchableSelect';
import { useColorMode } from '@/components/ui/color-mode';
import { IoIosSave, IoMdCloseCircle } from 'react-icons/io';
import { SocialMediaFormValues, SocialMediaItemProps } from '@/custom/interfaces/ProfileSettings/ProfileSocialMedia';
import { DeleteItem } from '@/custom/interfaces/Dialogs/WarningDialog';
import WarningDialog from '../Dialogs/WarningDialog';

const SocialMediaListItem = ({ 
    item,
    socialMedia,
    socialMediaLoading,
    onUpdate,
    onDelete
}: SocialMediaItemProps) => {
    const { colorMode } = useColorMode();
    const [menuOpen, setMenuOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteItems, setDeleteItems] = useState<DeleteItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const buttonWidth = buttonRef.current?.offsetWidth || 100;
    
    const {
        register: editSocialMedia,
        handleSubmit: handleUpdateSocialMedia,
        formState: { errors: errorsUpdateSocialeMedia },
        control: updateSocialMediaControl,
    } = useForm<SocialMediaFormValues>();

    const handleEditClick = (item: any) => {
        setEditingId(item.userSocialNetworkId);
    };

    const handleClose = () => {
        setMenuOpen(false);
        setEditingId(null);
    };

    const removeSocialNetowrk = async (userSocialNetworkId: number) => {
        handleClose();

        onDelete(userSocialNetworkId)
    }

    const onSubmitUpdateSocialMedia = handleUpdateSocialMedia(async (data: any) => {
        handleClose();
        if(editingId) onUpdate(editingId, data.socialMediaId[0], data.link);
    });

    const toggleWarningDialog = () => {
        handleClose();
        setIsModalOpen(true);
        setDeleteItems(prev => [...prev, {id: item.userSocialNetworkId, name: item.network}])
    }

    const handleCloseDelete = () => {
        setIsModalOpen(false);
        setDeleteItems([])
    };
    
    const handleConfirmDelete = async (items: DeleteItem[]) => {
        handleCloseDelete();
        
        const userSocialMediaIds = items.map(item => Number(item.id));
        removeSocialNetowrk(userSocialMediaIds[0]);
    };

    return (
        <React.Fragment key={item.userSocialNetworkId}>
            <Separator size="sm" />
            <Flex direction={'row'} key={item.userSocialNetworkId} justifyContent={'space-between'} alignItems={'center'} px={5} w={'full'}>
                <Grid w="full" templateColumns={editingId ? '30% 60% 10%' : '10% 80% 10%'} gap={4}>
                    <Show
                        when={editingId === item.userSocialNetworkId}
                        fallback={
                            <>
                                <GridItem alignItems={'center'} display={'flex'} justifyContent={'flex-start'}>
                                    <IconsSocialMedia key={item.userSocialNetworkId} socialNetwork={item.network} link={item.link} size={'lg'} />
                                </GridItem>
                                <GridItem alignItems={'center'} display={'flex'} justifyContent={'flex-start'}>
                                    <Text color="fg.muted">{item.link}</Text>
                                </GridItem>
                                <GridItem alignItems={'center'} display={'flex'} justifyContent={'center'}>
                                    <Menu.Root unmountOnExit lazyMount open={menuOpen}>
                                        <Menu.Trigger asChild onClick={() => setMenuOpen(!menuOpen)}>
                                            <Button size={'md'} bg={'transparent'} color={colorMode === 'light' ? 'teal.400' : 'pink.600'} ref={buttonRef}>
                                                <Icon size={'lg'}>
                                                    <GrMenu />
                                                </Icon>
                                            </Button>
                                        </Menu.Trigger>
                                        <Portal>
                                            <Menu.Positioner>
                                                <Menu.Content minW={buttonWidth} style={{ minWidth: buttonWidth }}>
                                                    <Menu.Item 
                                                        value={'edit'}
                                                        justifyContent={'flex-start'}
                                                        alignItems={'center'}
                                                        onClick={() => handleEditClick(item)}
                                                        cursor={"pointer"}
                                                    >
                                                        <Icon size={'sm'} color={colorMode === 'light' ? 'teal.400' : 'pink.600'}>
                                                            <AiFillEdit />
                                                        </Icon>
                                                        
                                                        <Text>
                                                            Edit
                                                        </Text>
                                                    </Menu.Item>

                                                    <Separator my={1} />
                                                    
                                                    <Menu.Item 
                                                        value={'delete'}
                                                        color="fg.error" 
                                                        _hover={{ bg: 'bg.error', color: 'fg.error' }}
                                                        justifyContent={'flex-start'}
                                                        alignItems={'center'}
                                                        onClick={() => toggleWarningDialog()}
                                                        cursor={"pointer"}
                                                    >
                                                        <Icon size={'sm'}>
                                                            <TiDelete />
                                                        </Icon>

                                                        <Text>
                                                            Remove
                                                        </Text>
                                                    </Menu.Item>
                                                </Menu.Content>
                                            </Menu.Positioner>
                                        </Portal>
                                    </Menu.Root>
                                </GridItem>
                            </>
                        }
                    >
                        <GridItem alignItems={'center'} display={'flex'} justifyContent={'flex-start'}>
                            <Field.Root invalid={!!errorsUpdateSocialeMedia.socialMediaId} w={'15vw'}>
                                <Controller
                                    control={updateSocialMediaControl}
                                    name="socialMediaId"
                                    rules={{ required: 'Social Network is required' }}
                                    render={({ field }) => (
                                        <SearchableSelect 
                                            disabled={socialMediaLoading}
                                            placeholder={'Select Social Netowrk'}
                                            options={socialMedia}
                                            field={field}
                                            defaultValue={item.socialMediaId}
                                        />
                                    )}
                                />
                                <Field.ErrorText>{errorsUpdateSocialeMedia.socialMediaId?.message}</Field.ErrorText>
                            </Field.Root>
                        </GridItem>
                        <GridItem alignItems={'center'} display={'flex'} justifyContent={'flex-start'}>
                            <Field.Root invalid={!!errorsUpdateSocialeMedia.link}>
                                <Input {...editSocialMedia('link', { required: 'Link is required' })} defaultValue={item.link} />
                                <Field.ErrorText>{errorsUpdateSocialeMedia.link?.message}</Field.ErrorText>
                            </Field.Root>
                        </GridItem>
                        <GridItem alignItems={'center'} display={'flex'} justifyContent={'space-evenly'}>
                            <Icon
                                color={colorMode === 'light' ? "teal.400":'pink.600'}
                                size={"lg"}
                                cursor={"pointer"}
                                onClick={onSubmitUpdateSocialMedia}
                            >
                                <IoIosSave />
                            </Icon>

                            <Icon
                                color={colorMode === 'light' ? "teal.400":'pink.600'}
                                size={"lg"}
                                cursor={"pointer"}
                                onClick={() => setEditingId(null)}
                            >
                                <IoMdCloseCircle />
                            </Icon>
                        </GridItem>
                    </Show>
                </Grid>
            </Flex>

            <WarningDialog
                isOpen={isModalOpen}
                title={"Delete Social Media"}
                message={`Are you sure you want to delete this Social Media?`}
                items={deleteItems}
                onClose={handleCloseDelete}
                onComplete={handleConfirmDelete}
            />
        </React.Fragment>
    );
};

export default SocialMediaListItem;