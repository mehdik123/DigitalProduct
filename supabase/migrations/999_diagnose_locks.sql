-- DIAGNOSTIC TOOL: LOCK DETECTOR
-- Run this in Supabase SQL Editor to find what is holding the database hostage.

-- 1. CHECK FOR ACTIVE LOCKS (The "Smoking Gun")
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement,
    blocking_activity.query AS current_statement_in_blocking_process,
    blocked_activity.application_name AS blocked_application
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.DATABASE IS NOT DISTINCT FROM blocked_locks.DATABASE
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.GRANTED;

-- 2. CHECK FOR IDLE TRANSACTIONS (The "Time Bombs")
-- These are connections that started a transaction but never finished it.
SELECT 
    pid,
    usename,
    application_name,
    state,
    query,
    state_change,
    NOW() - state_change AS duration
FROM pg_stat_activity
WHERE state = 'idle in transaction'
  AND NOW() - state_change > INTERVAL '1 minute'
ORDER BY state_change;

-- 3. CHECK TRIGGERS (The "Hidden Traps")
SELECT 
    trigger_name,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_table IN ('workout_sessions', 'workout_sets', 'workout_logs', 'exercise_logs')
ORDER BY event_object_table, trigger_name;

-- 4. KILL COMMAND (TEMPLATE - DO NOT RUN BLINDLY)
-- Once you find a PID from step 1 or 2, uncomment and run this:
-- SELECT pg_terminate_backend(PID_GOES_HERE);
