import React, { useState } from 'react';
import { useEventStore } from '../../stores/eventStore';
import type { Event } from '../../types';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, onEventClick }) => {
  const { selectedDate, setSelectedDate, getEventsByDate } = useEventStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    onDateSelect?.(newDate);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inspection': return 'bg-purple-100 text-purple-800';
      case 'training': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateEventLayout = (events: Event[]) => {
    if (events.length <= 1) return events.map((event, index) => ({ event, width: 100, left: 0, top: index * 16 }));

    // 時間でソート
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    // 重複グループを見つける
    const overlapGroups: Event[][] = [];
    
    sortedEvents.forEach(event => {
      // このイベントが既存のグループと重複するかチェック
      let addedToGroup = false;
      
      for (let i = 0; i < overlapGroups.length; i++) {
        const group = overlapGroups[i];
        const hasOverlap = group.some(groupEvent => 
          new Date(event.startTime) < new Date(groupEvent.endTime) && 
          new Date(event.endTime) > new Date(groupEvent.startTime)
        );
        
        if (hasOverlap) {
          group.push(event);
          addedToGroup = true;
          break;
        }
      }
      
      if (!addedToGroup) {
        overlapGroups.push([event]);
      }
    });

    // レイアウトを計算
    const layouts: Array<{ event: Event; width: number; left: number; top: number }> = [];
    let currentTop = 0;

    overlapGroups.forEach(group => {
      const groupWidth = Math.floor(100 / group.length);
      
      group.forEach((event, index) => {
        layouts.push({
          event,
          width: groupWidth,
          left: index * groupWidth,
          top: currentTop
        });
      });
      
      currentTop += 16; // 次のグループは下に配置
    });

    return layouts;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const days = [];
  
  // 前月の空白セル
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-32 border border-gray-200"></div>);
  }

  // 当月の日付
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayEvents = getEventsByDate(date);
    const isSelected = selectedDate.getDate() === day && 
                     selectedDate.getMonth() === currentMonth.getMonth() &&
                     selectedDate.getFullYear() === currentMonth.getFullYear();
    const isToday = new Date().toDateString() === date.toDateString();

    days.push(
      <div
        key={day}
        className={`h-32 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
          isSelected ? 'bg-blue-50 border-blue-300' : ''
        } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
          {day}
        </div>
        <div className="mt-1 relative h-24">
          {calculateEventLayout(dayEvents.slice(0, 3)).map(({ event, width, left, top }) => (
            <div
              key={event.id}
              className={`absolute text-xs px-1 py-0.5 rounded truncate cursor-pointer ${getEventTypeColor(event.type)}`}
              style={{
                width: `${width}%`,
                left: `${left}%`,
                top: `${top}px`,
                height: '14px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick?.(event);
              }}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="absolute text-xs text-gray-500 bottom-0">
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">
          {currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>
      
      <div className="grid grid-cols-7 border-b">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-700 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {days}
      </div>
    </div>
  );
};

export default Calendar;