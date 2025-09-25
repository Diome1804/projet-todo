# Photo Upload Fix - TODO

## Completed Changes

✅ **Added photo display to TaskCard.jsx**
- Added photo rendering in task cards for the list view
- Imported API_BASE_URL for correct URL construction

✅ **Updated taskServiceUpdated.js**
- Modified `createTask` to map backend photo field to `photoUrl`
- Updated `getTaskById` to ensure photoUrl is set for individual tasks
- Updated `getTasks` to ensure photoUrl is set for all tasks

## Testing Needed

🔄 **Test photo upload and display**
- Create a new task with a photo
- Verify photo appears in task list (TaskCard)
- Verify photo appears in task detail view (TaskDetail)
- Test with different image formats (JPEG, PNG, etc.)

🔄 **Test existing tasks with photos**
- Ensure existing tasks with photos display correctly
- Check if any data migration is needed

## Follow-up Steps

📝 **Backend verification**
- Confirm backend returns photo URL in the expected format
- Ensure backend UploadService integrates correctly with task creation

📝 **Error handling**
- Add error handling for failed photo uploads
- Display user-friendly messages for upload failures

📝 **Performance optimization**
- Consider image compression or lazy loading for better performance
