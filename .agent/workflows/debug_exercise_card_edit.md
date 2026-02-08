
### How to Debug Edit State in ExerciseCardNew

1.  **Locate the Component**: Open `src/components/ExerciseCardNew.tsx`.
2.  **Check Saved State**: Look for the `isSaved` state variable. This controls the button appearance ("Completed" vs "Save").
3.  **Verify Update Logic**: Ensure the `updateSet` function sets `isSaved(false)` whenever a user changes an input.
    ```typescript
    const updateSet = (...) => {
      setSets(...);
      setIsSaved(false); // <--- Critical for enabling the "Update" button
    };
    ```
4.  **Button Label**: Ensure the button label dynamically changes based on `savedSets` existence.
    ```tsx
    <span>{savedSets && savedSets.length > 0 ? 'Update Log' : 'Log Set'}</span>
    ```
5.  **Testing**:
    - Load a workout with pre-filled data.
    - Change a weight or rep value.
    - Verify the button changes from "Completed" (Green) to "Update Log" (White).
