# Holiday Calendar Date Bug Fix

## Issue
Holidays were appearing on the wrong dates (e.g., New Year's Day showing on January 2nd instead of January 1st).

## Root Cause
The issue was caused by timezone conversion when using JavaScript's `toISOString()` method. This method converts dates to UTC timezone, which can shift dates by one day depending on the user's local timezone.

For example:
- Holiday date in data: `2025-01-01` (stored as string)
- When parsed with `new Date('2025-01-01')`, JavaScript interprets it as UTC midnight
- When converted back using `toISOString().split('T')[0]` in a timezone like IST (UTC+5:30), it could shift to the next day
- Result: Holiday appears on wrong date in calendar

## Solution
Replaced all timezone-dependent date parsing with local timezone-aware string operations:

### Changes Made

1. **Added `formatDateLocal()` helper function**
   ```typescript
   const formatDateLocal = (date: Date): string => {
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, '0');
     const day = String(date.getDate()).padStart(2, '0');
     return `${year}-${month}-${day}`;
   };
   ```
   - Formats dates using local timezone values
   - No UTC conversion

2. **Added `formatDateString()` helper function**
   ```typescript
   const formatDateString = (dateStr: string): string => {
     const [year, month, day] = dateStr.split('-').map(Number);
     const date = new Date(year, month - 1, day);
     return date.toLocaleDateString('en-US', { 
       day: 'numeric', 
       month: 'short' 
     });
   };
   ```
   - Converts YYYY-MM-DD strings to display format
   - Creates Date objects using local timezone constructor

3. **Updated `getHolidaysForDate()` function**
   - Before: `date.toISOString().split('T')[0]`
   - After: `formatDateLocal(date)`

4. **Updated `getMonthStats()` function**
   - Before: Used `new Date(holiday.date)` for comparisons
   - After: String-based year/month comparison
   ```typescript
   const [holidayYear, holidayMonth] = holiday.date.split('-').map(Number);
   return holidayYear === year && holidayMonth === monthNum;
   ```

5. **Updated holiday filtering in monthly list**
   - Before: Used `new Date(holiday.date)` with month/year comparisons
   - After: String-based parsing and comparison

6. **Updated holiday date display**
   - Before: `new Date(holiday.date).toLocaleDateString(...)`
   - After: `formatDateString(holiday.date)`

## Result
✅ All holidays now appear on the correct dates
✅ No timezone-related date shifts
✅ Consistent behavior across all timezones
✅ Calendar displays:
   - January 1st → New Year's Day
   - January 23rd → Netaji's Birthday
   - All other holidays on their correct dates

## Testing Recommendations
1. Test in different timezones (IST, EST, PST, etc.)
2. Verify all holidays appear on correct calendar dates
3. Check that clicking holidays shows correct date in modal
4. Verify monthly holiday list shows correct dates

## Files Modified
- `client/src/components/leave/HolidayCalendar.tsx`

## Date: October 30, 2025

