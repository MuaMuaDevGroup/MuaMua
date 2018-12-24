import 'angular'
// Notification Interactions
angular.module('mm-app').factory("mmNotification", () => {
    let notificationHandler = null;
    let notifications = []
    return {
        setNotificationHandler: (func) => {
            notificationHandler = func;
        },
        notifications: notifications,
        notify: (type, message) => {
            if (typeof notificationHandler == "function")
                notificationHandler(type, message);
            notifications.push({
                type: type,
                message: message
            });
        }
    }
});