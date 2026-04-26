export interface FollowingInterface {
    followedId: number
    simple?: boolean
}

export interface GetFollowStateInterface {
    getFollowState: {
        isFollowed: boolean
    }
}