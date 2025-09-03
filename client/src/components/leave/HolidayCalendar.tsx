import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, CalendarIcon, Gift, Star } from 'lucide-react';

interface Holiday {
  date: string;
  name: string;
  type: 'national' | 'religious' | 'regional' | 'company';
  description?: string;
  isOptional?: boolean;
}

interface HolidayCalendarProps {
  holidays: Holiday[];
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
}

export const HolidayCalendar: React.FC<HolidayCalendarProps> = ({
  holidays,
  selectedDate,
  onDateSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 0, 1)); // January 2025
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState<Date | null>(null);

  // Create a map of holidays by date for easy lookup
  const holidayMap = new Map<string, Holiday[]>();
  holidays.forEach(holiday => {
    const existing = holidayMap.get(holiday.date) || [];
    existing.push(holiday);
    holidayMap.set(holiday.date, existing);
  });

  // Function to get holidays for a specific date
  const getHolidaysForDate = (date: Date): Holiday[] => {
    const dateString = date.toISOString().split('T')[0];
    return holidayMap.get(dateString) || [];
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    const dayHolidays = getHolidaysForDate(date);
    if (dayHolidays.length > 0) {
      setClickedDate(date);
      setIsModalOpen(true);
      onDateSelect?.(date);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setClickedDate(null);
  };

  // Get month details
  const getMonthDetails = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get holiday statistics for current month
  const getMonthStats = (month: Date) => {
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    const monthHolidays = holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= monthStart && holidayDate <= monthEnd;
    });

    return {
      total: monthHolidays.length,
      national: monthHolidays.filter(h => h.type === 'national').length,
      religious: monthHolidays.filter(h => h.type === 'religious').length,
      regional: monthHolidays.filter(h => h.type === 'regional').length,
      company: monthHolidays.filter(h => h.type === 'company').length,
      optional: monthHolidays.filter(h => h.isOptional).length
    };
  };

  const monthDays = getMonthDetails(currentMonth);
  const monthStats = getMonthStats(currentMonth);

  // Get holiday type color
  const getHolidayColor = (type: string) => {
    switch (type) {
      case 'national':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'religious':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'regional':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'company':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">

      {/* Big Custom Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 mr-3" />
              Holiday Calendar 2025
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold min-w-[200px] text-center">
                {getMonthName(currentMonth)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="w-full">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="p-3 text-center font-semibold text-sm text-muted-foreground bg-muted/50 rounded-md">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const dayHolidays = getHolidaysForDate(date);
                const hasHoliday = dayHolidays.length > 0;
                
                let dayClass = "p-4 text-center border rounded-lg transition-colors min-h-[100px] flex flex-col";
                
                if (hasHoliday) {
                  dayClass += " cursor-pointer hover:shadow-md";
                  // Use a single holiday color - red for all holidays as requested
                  dayClass += " bg-red-50 border-red-200 hover:bg-red-100";
                } else {
                  dayClass += " bg-gray-50 border-gray-200";
                }

                if (isToday) {
                  dayClass += " ring-2 ring-blue-500 ring-offset-2";
                }

                if (isSelected) {
                  dayClass += " ring-2 ring-primary ring-offset-2";
                }

                if (!isCurrentMonth) {
                  dayClass += " opacity-50";
                }

                return (
                  <div
                    key={index}
                    className={dayClass}
                    onClick={() => hasHoliday && handleDateClick(date)}
                  >
                    <div className={`text-sm font-medium mb-2 ${!isCurrentMonth ? 'text-muted-foreground' : ''}`}>
                      {date.getDate()}
                    </div>
                    
                    {hasHoliday && (
                      <div className="flex-1 space-y-1">
                        {dayHolidays.map((holiday, holidayIndex) => (
                          <div key={holidayIndex} className="space-y-1">
                            <div className="flex items-center justify-center mb-1">
                              {holiday.type === 'national' && <Star className="h-3 w-3 text-red-600" />}
                              {holiday.type === 'religious' && <Gift className="h-3 w-3 text-blue-600" />}
                              {holiday.type === 'company' && <CalendarIcon className="h-3 w-3 text-purple-600" />}
                            </div>
                            <div className="text-xs font-medium text-center text-red-800 leading-tight">
                              {holiday.name.length > 20 ? holiday.name.substring(0, 20) + '...' : holiday.name}
                            </div>
                            {holiday.isOptional && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                Optional
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Holiday List for Current Month */}
          {monthStats.total > 0 && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-3">Holidays in {getMonthName(currentMonth)}</h3>
              <div className="space-y-2">
                {holidays
                  .filter(holiday => {
                    const holidayDate = new Date(holiday.date);
                    return holidayDate.getMonth() === currentMonth.getMonth() && 
                           holidayDate.getFullYear() === currentMonth.getFullYear();
                  })
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((holiday, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium">
                          {new Date(holiday.date).toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </div>
                        <div>
                          <div className="font-medium">{holiday.name}</div>
                          {holiday.description && (
                            <div className="text-sm text-muted-foreground">{holiday.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {holiday.isOptional && (
                          <Badge variant="outline" className="text-xs">
                            Optional
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {holiday.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Holiday Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Holiday Types</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-red-600" />
                  <span className="text-sm">National Holidays</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Religious Festivals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Company Holidays</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Color Coding</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
                  <span className="text-sm">Holiday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div>
                  <span className="text-sm">Regular Day</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holiday Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {clickedDate && clickedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogTitle>
          </DialogHeader>
          
          {clickedDate && (() => {
            const dayHolidays = getHolidaysForDate(clickedDate);
            return (
              <div className="space-y-4">
                {dayHolidays.map((holiday, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{holiday.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {holiday.type}
                      </Badge>
                    </div>
                    {holiday.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {holiday.description}
                      </p>
                    )}
                    {holiday.isOptional && (
                      <Badge variant="outline" className="text-xs">
                        Optional Holiday
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};
