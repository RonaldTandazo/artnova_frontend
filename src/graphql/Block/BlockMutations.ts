import { gql } from "@apollo/client";

export const SET_BLOCK_STATE = gql`
    mutation SetBlockState($data: BlockStateInput!) { 
        setBlockState(data: $data)
    }
`;

export const UNSET_BLOCK_STATE = gql`
    mutation UnsetBlockState($data: BlockStateInput!) { 
        unsetBlockState(data: $data)
    }
`;