# Testing Guide - Weight Persistence Fix

## Issues Fixed

### 1. **Critical Bug: `console.size` typo**
   - **Location**: `src/services/workoutService.ts` line 47
   - **Issue**: Typo `console.size` instead of `console.log` would cause JavaScript error
   - **Status**: ✅ Fixed

### 2. **Data Type Conversion**
   - **Location**: `src/components/ExerciseCard.tsx` - `handleSetChange` function
   - **Issue**: String values from inputs weren't converted to numbers before saving
   - **Status**: ✅ Fixed - Now properly converts weight, reps, and RPE to numbers

### 3. **Session Verification**
   - **Location**: `src/services/workoutService.ts`
   - **Issue**: No verification that user session was valid before saving
   - **Status**: ✅ Fixed - Added session validation and user ID verification

### 4. **Data Loading Error Handling**
   - **Location**: `src/components/WorkoutPage.tsx`
   - **Issue**: Using `.single()` would throw error if no session exists
   - **Status**: ✅ Fixed - Changed to `.maybeSingle()` with proper error handling

### 5. **Enhanced Error Logging**
   - **Location**: `src/services/workoutService.ts`
   - **Status**: ✅ Added comprehensive logging for debugging

## How to Test

### Prerequisites
1. Ensure you have a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Make sure database migrations are run (especially `009_create_v2_schema.sql`)

### Testing Steps

1. **Start the development server:**
   ```bash
   cd project
   npm install  # if not already done
   npm run dev
   ```

2. **Test the weight persistence:**
   - Log in to your account
   - Navigate to a workout
   - Enter weights and reps for an exercise
   - Click "Save Exercise"
   - Check browser console for logs (should see `🏋️ [WORKOUT-SERVICE]` logs)
   - Navigate away and come back - weights should persist

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for logs starting with:
     - `🏋️ [WORKOUT-SERVICE]` - Service logs
     - `📋 [WORKOUT-PAGE]` - Page logs
   - If there are errors, they will be clearly logged

4. **Verify data in database:**
   - Go to Supabase dashboard
   - Check `workout_sessions` table for your session
   - Check `workout_sets` table for saved weights

### Expected Behavior

✅ **Before Fix:**
- Weights not saving
- JavaScript errors in console
- Data type mismatches

✅ **After Fix:**
- Weights save successfully
- Console shows detailed save process logs
- Data persists when you return to workout
- Proper error messages if something goes wrong

### Debugging

If weights still don't save:

1. **Check console logs:**
   - Look for `🏋️ [WORKOUT-SERVICE]` logs
   - Check for any error messages

2. **Verify authentication:**
   - Ensure you're logged in
   - Check that `profile.id` matches your user ID

3. **Check database:**
   - Verify RPC function `save_workout_v2` exists
   - Check RLS policies are correct
   - Verify user has permissions

4. **Check network tab:**
   - Open DevTools > Network
   - Look for RPC call to `save_workout_v2`
   - Check response status and body

## Files Modified

1. `src/services/workoutService.ts` - Fixed typo, added session verification, improved error handling
2. `src/components/ExerciseCard.tsx` - Fixed data type conversion
3. `src/components/WorkoutPage.tsx` - Fixed data loading error handling

## Next Steps

If you encounter any issues:
1. Check browser console for detailed error messages
2. Verify your Supabase connection is working
3. Ensure all database migrations are applied
4. Check that the RPC function `save_workout_v2` exists and has proper permissions

