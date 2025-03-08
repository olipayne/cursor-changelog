-- Remove email notification channel from database
DELETE FROM notification_channels WHERE name = 'email';

-- Delete all user notification preferences linked to the email channel
DELETE FROM user_notification_preferences 
WHERE channel_id IN (SELECT id FROM notification_channels WHERE name = 'email');

-- Delete notification history records for the email channel
DELETE FROM notification_history
WHERE channel_id IN (SELECT id FROM notification_channels WHERE name = 'email'); 