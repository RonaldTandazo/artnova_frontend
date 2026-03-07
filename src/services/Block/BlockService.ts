import { BlockingInterface, BlockInterface, UnblockInterface } from '@/graphql/Block/BlockInterfaces';
import { SET_BLOCK_STATE, UNSET_BLOCK_STATE } from '@/graphql/Block/BlockMutations';
import { useMutation } from '@apollo/client/react';

export const useSetBlockState = () => {
    const [execute, { data, loading, error }] = useMutation<BlockInterface>(SET_BLOCK_STATE);

    const setBlockState = async (data: BlockingInterface) => {
        return execute({ 
            variables: { data }
        });
    };

    return {
        setBlockState,
        data,
        loading,
        error,
    };
};

export const useUnsetBlockState = () => {
    const [execute, { data, loading, error }] = useMutation<UnblockInterface>(UNSET_BLOCK_STATE);

    const unsetBlockState = async (data: BlockingInterface) => {
        return execute({ 
            variables: { data }
        });
    };

    return {
        unsetBlockState,
        data,
        loading,
        error,
    };
};