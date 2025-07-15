# Notification Sound Setup

To add a notification sound to your chat app:

## Option 1: Download a free notification sound
1. Go to https://freesound.org/ or https://zapsplat.com/
2. Search for "notification" or "message" sounds
3. Download a short .mp3 file (preferably under 2 seconds)
4. Save it as `notification.mp3` in the `src` folder

## Option 2: Use a built-in sound
The current implementation uses a programmatically generated beep sound.

## Option 3: Create your own sound
You can record a short sound file and convert it to .mp3 format.

## To enable the sound file:
1. Place `notification.mp3` in the `src` folder
2. Uncomment the import line in App.js:
   ```javascript
   import notificationSound from './notification.mp3';
   ```
3. In the `playSound()` function, uncomment:
   ```javascript
   const audio = new Audio(notificationSound);
   audio.play();
   ```
4. Remove or comment out the programmatic beep sound code

## Browser Compatibility
- Chrome: Requires user interaction before playing audio
- Firefox: Same as Chrome
- Safari: May require additional permissions

## File Size Recommendations
- Keep sound files under 100KB for faster loading
- Use .mp3 format for better browser compatibility
- Duration should be 0.5-2 seconds for notifications
