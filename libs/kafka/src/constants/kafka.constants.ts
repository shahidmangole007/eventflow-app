
export const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9093';
export const KAFKA_CLIENT_ID = 'eventflow-app';
export const KAFKA_CONSUMER_GROUP = 'eventflowapp-consumer';
export const KAFKA_SERVICE = 'KAFKA_SERVICE';


// Kafka Topics
export const KAFKA_TOPICS = {
    //Auth events 

    USER_REGISTERED: 'user.registered',
    USER_LOGIN: 'user.login',
    PASSWORD_RESET_REQUESTED: 'user.password-reset-requested',

    // Event events
    EVENT_CREATED: 'event.created',
    EVENT_UPDATED: 'event.updated',
    EVENT_CANCELED: 'event.canceled',

    // Ticket events
    TICKET_PURCHASED: 'ticket.purchased',
    TICKETS_CANCELED: 'tickets.canceled',
    TICKET_CHECKED_IN: 'ticket.checked-in',

    // Payment events
    PAYMENT_COMPLETED: 'payment.completed',
    PAYMENT_FAILED: 'payment.failed',
    PAYMENT_REFUNDED: 'payment.refunded',

    // Notification trigger events
    SEND_EMAIL: 'notification.send-email',
    SEND_SMS: 'notification.send-sms',
    SEND_PUSH: 'notification.send-push',
} as const;


export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];



