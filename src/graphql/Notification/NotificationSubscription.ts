import { gql } from '@apollo/client/core';
import { Notification } from './NotificationQueries';

export const NOTIFICATION_SUBSCRIPTION = gql`
    subscription NotificationReceived($userId: Int!){
        notificationReceived(userId: $userId) {
            ...Notification
        }
    }
    ${Notification}
`;