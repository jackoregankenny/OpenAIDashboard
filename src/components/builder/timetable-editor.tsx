'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Check, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TimetableEditorProps {
  days: string[];
  periods: Array<{ time: string; label: string }>;
  years?: string[];
  classesPerYear?: string[];
  schedules?: Record<string, Record<string, any>>;
  onSchedulesChange?: (schedules: Record<string, any>) => void;
}

interface SubjectTemplate {
  subject: string;
  teacher?: string;
  color: string;
}

export function TimetableEditor({ 
  days, 
  periods, 
  years = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12'],
  classesPerYear = ['Class A', 'Class B', 'Class C'],
  schedules = {},
  onSchedulesChange,
}: TimetableEditorProps) {
  const [activeYear, setActiveYear] = useState(years[0]);
  const [activeClass, setActiveClass] = useState(classesPerYear[0]);
  const [openCellKey, setOpenCellKey] = useState<string | null>(null);
  
  // Subject templates for quick adding
  const subjectTemplates: SubjectTemplate[] = [
    { subject: 'Mathematics', teacher: 'Mr. Smith', color: '#dbeafe' },
    { subject: 'English', teacher: 'Ms. Johnson', color: '#dcfce7' },
    { subject: 'Science', teacher: 'Dr. Brown', color: '#fef3c7' },
    { subject: 'History', teacher: 'Mrs. Davis', color: '#f3e8ff' },
    { subject: 'Physical Education', teacher: 'Coach Williams', color: '#fce7f3' },
    { subject: 'Art', teacher: 'Ms. Garcia', color: '#ffedd5' },
  ];

  const colors = [
    { name: 'Blue', value: '#dbeafe' },
    { name: 'Green', value: '#dcfce7' },
    { name: 'Yellow', value: '#fef3c7' },
    { name: 'Purple', value: '#f3e8ff' },
    { name: 'Pink', value: '#fce7f3' },
    { name: 'Orange', value: '#ffedd5' },
    { name: 'Red', value: '#fee2e2' },
    { name: 'Gray', value: '#f3f4f6' },
  ];

  // Get schedule key for year+class combination
  const getGroupKey = () => `${activeYear}-${activeClass}`;
  const currentSchedule = schedules[getGroupKey()] || {};

  const getScheduleKey = (day: string, periodLabel: string) => {
    return `${day}-${periodLabel}`;
  };

  const updateSchedule = (newSchedule: Record<string, any>) => {
    if (onSchedulesChange) {
      onSchedulesChange({
        ...schedules,
        [getGroupKey()]: newSchedule
      });
    }
  };

  const handleSaveCell = (cellKey: string, data: { subject: string; teacher?: string; room?: string; color?: string }) => {
    const newSchedule = { ...currentSchedule };
    if (data.subject.trim()) {
      newSchedule[cellKey] = data;
    } else {
      delete newSchedule[cellKey];
    }
    updateSchedule(newSchedule);
    setOpenCellKey(null);
  };

  const handleDeleteCell = (cellKey: string) => {
    const newSchedule = { ...currentSchedule };
    delete newSchedule[cellKey];
    updateSchedule(newSchedule);
    setOpenCellKey(null);
  };

  const clearAllSchedule = () => {
    if (confirm(`Clear all classes for ${activeYear} ${activeClass}?`)) {
      updateSchedule({});
    }
  };

  // Cell editor component
  const CellEditor = ({ cellKey, day, period }: { cellKey: string; day: string; period: { time: string; label: string } }) => {
    const content = currentSchedule[cellKey];
    const [subject, setSubject] = useState(content?.subject || '');
    const [teacher, setTeacher] = useState(content?.teacher || '');
    const [room, setRoom] = useState(content?.room || '');
    const [color, setColor] = useState(content?.color || '#dbeafe');
    const isOpen = openCellKey === cellKey;

    const applyTemplate = (template: SubjectTemplate) => {
      setSubject(template.subject);
      setTeacher(template.teacher || '');
      setColor(template.color);
    };

    return (
      <Popover open={isOpen} onOpenChange={(open) => setOpenCellKey(open ? cellKey : null)}>
        <PopoverTrigger asChild>
          <button
            className={`w-full p-2 rounded text-xs text-left transition-all hover:shadow-md hover:scale-105 ${
              isOpen ? 'ring-2 ring-primary shadow-lg scale-105' : 'hover:ring-1 hover:ring-primary/50'
            }`}
            style={{ 
              backgroundColor: content?.color || 'white',
              minHeight: '60px'
            }}
          >
            {content ? (
              <div className="space-y-0.5">
                <div className="font-semibold leading-tight">{content.subject}</div>
                {content.teacher && (
                  <div className="text-[10px] text-muted-foreground truncate">{content.teacher}</div>
                )}
                {content.room && (
                  <div className="text-[10px] font-medium">Rm {content.room}</div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground opacity-50">
                <Plus className="w-4 h-4" />
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">{day}</h4>
                <p className="text-xs text-muted-foreground">{period.label} • {period.time}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenCellKey(null)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Quick Templates */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Quick Add</Label>
              <div className="flex flex-wrap gap-1">
                {subjectTemplates.map((template, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => applyTemplate(template)}
                    style={{ borderColor: template.color, backgroundColor: template.color + '40' }}
                  >
                    {template.subject.split(' ')[0]}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="subject" className="text-xs">Subject *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="h-8 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="teacher" className="text-xs">Teacher</Label>
                <Input
                  id="teacher"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  placeholder="Mr. Smith"
                  className="h-8 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="room" className="text-xs">Room</Label>
                <Input
                  id="room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="101"
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs block mb-1">Color</Label>
              <div className="flex gap-1">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-7 h-7 rounded border-2 transition-all hover:scale-110 ${
                      color === c.value ? 'border-primary ring-2 ring-primary ring-offset-1' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={() => handleSaveCell(cellKey, { subject, teacher, room, color })}
                size="sm" 
                className="flex-1 h-8"
              >
                <Check className="w-3 h-3 mr-1" />
                Save
              </Button>
              {content && (
                <Button 
                  onClick={() => handleDeleteCell(cellKey)}
                  variant="destructive" 
                  size="sm"
                  className="h-8"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const filledCells = Object.keys(currentSchedule).length;
  const totalCells = days.length * periods.length;

  return (
    <div className="space-y-4">
      {/* Year and Class selectors */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Select value={activeYear} onValueChange={setActiveYear}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={activeClass} onValueChange={setActiveClass}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {classesPerYear.map((cls) => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="secondary" className="text-xs">
            {filledCells}/{totalCells}
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={clearAllSchedule}
          className="text-xs h-9"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear All
        </Button>
      </div>

      {/* Timetable Grid */}
      <div className="border rounded-lg p-2 overflow-x-auto bg-muted/30">
        <div className="min-w-[700px]">
          <div className="grid gap-1" style={{ gridTemplateColumns: `110px repeat(${days.length}, 1fr)` }}>
            {/* Header */}
            <div className="bg-muted p-2 rounded text-xs font-semibold flex items-center justify-center">
              Period
            </div>
            {days.map((day) => (
              <div key={day} className="bg-primary text-primary-foreground p-2 rounded text-xs font-semibold text-center">
                {day}
              </div>
            ))}

            {/* Periods */}
            {periods.map((period) => (
              <>
                <div key={`time-${period.label}`} className="bg-muted p-2 rounded text-xs flex flex-col justify-center">
                  <div className="font-semibold">{period.label}</div>
                  <div className="text-[10px] text-muted-foreground">{period.time}</div>
                </div>
                {days.map((day) => {
                  const key = getScheduleKey(day, period.label);
                  return (
                    <CellEditor
                      key={key}
                      cellKey={key}
                      day={day}
                      period={period}
                    />
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Click any cell to edit. Changes save automatically.
      </p>
    </div>
  );
}
