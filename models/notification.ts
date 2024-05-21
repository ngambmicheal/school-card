import mg from '../services/mg'

export default interface Notification {
_id ?: string, 
title: string;
details: string; 

}


const NotificationSchemma = new mg.Schema({

    },
    {
        timestamps:true,
        strict:false
    }
)

export const notificationSchema = mg.models.Notification || mg.model('Notification', NotificationSchemma)