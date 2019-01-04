import 'angular'
// Notification Interactions
angular.module('mm-app').factory("mmNotification", () => {
    let notificationHandler = null;
    let notification = [];
    return {
        setNotificationHandler: (func) => {
            notificationHandler = func;
        },
        notifications: () => notification,
        clearNotifications: () => notification = [],
        notify: (type, message) => {
            notification.push({
                type: type,
                message: message,
                time: Date.now()
            });
            if (typeof notificationHandler == "function")
                notificationHandler(type, message);

        }
    }
});