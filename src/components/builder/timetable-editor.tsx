'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Palette } from 'lucide-react';

interface TimetableEditorProps {
  days: string[];
  periods: Array<{ time: string; label: string }>;
  schedule: Record<string, { subject: string; teacher?: string; room?: string; color?: string }>;
  onChange: (schedule: Record<string, any>) => void;
}

export function TimetableEditor({ days, periods, schedule, onChange }: TimetableEditorProps) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState('');
  const [editingTeacher, setEditingTeacher] = useState('');
  const [editingRoom, setEditingRoom] = useState('');
  const [editingColor, setEditingColor] = useState('#dbeafe');

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

  const getScheduleKey = (day: string, periodLabel: string) => {
    return `${day}-${periodLabel}`;
  };

  const handleCellClick = (day: string, periodLabel: string) => {
    const key = getScheduleKey(day, periodLabel);
    setSelectedCell(key);
    
    const content = schedule[key];
    if (content) {
      setEditingSubject(content.subject || '');
      setEditingTeacher(content.teacher || '');
      setEditingRoom(content.room || '');
      setEditingColor(content.color || '#dbeafe');
    } else {
      setEditingSubject('');
      setEditingTeacher('');
      setEditingRoom('');
      setEditingColor('#dbeafe');
    }
  };

  const handleSave = () => {
    if (!selectedCell) return;

    const newSchedule = { ...schedule };
    
    if (editingSubject.trim()) {
      newSchedule[selectedCell] = {
        subject: editingSubject,
        teacher: editingTeacher,
        room: editingRoom,
        color: editingColor,
      };
    } else {
      delete newSchedule[selectedCell];
    }

    onChange(newSchedule);
    setSelectedCell(null);
  };

  const handleDelete = () => {
    if (!selectedCell) return;
    
    const newSchedule = { ...schedule };
    delete newSchedule[selectedCell];
    onChange(newSchedule);
    setSelectedCell(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Click a cell to edit
      </div>

      {/* Timetable Grid */}
      <div className="border rounded-lg p-2 overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid gap-1" style={{ gridTemplateColumns: `100px repeat(${days.length}, 1fr)` }}>
            {/* Header */}
            <div className="bg-muted p-2 rounded text-xs font-semibold">Time</div>
            {days.map((day) => (
              <div key={day} className="bg-muted p-2 rounded text-xs font-semibold text-center">
                {day.substring(0, 3)}
              </div>
            ))}

            {/* Periods */}
            {periods.map((period) => (
              <>
                <div key={`time-${period.label}`} className="bg-muted/50 p-2 rounded text-xs">
                  <div className="font-medium">{period.label}</div>
                </div>
                {days.map((day) => {
                  const key = getScheduleKey(day, period.label);
                  const content = schedule[key];
                  const isSelected = selectedCell === key;

                  return (
                    <button
                      key={key}
                      onClick={() => handleCellClick(day, period.label)}
                      className={`p-2 rounded text-xs text-left transition-all hover:ring-2 hover:ring-primary ${
                        isSelected ? 'ring-2 ring-primary' : ''
                      }`}
                      style={{ backgroundColor: content?.color || '#f9fafb' }}
                    >
                      {content ? (
                        <div className="font-medium truncate">{content.subject}</div>
                      ) : (
                        <div className="text-muted-foreground italic">+</div>
                      )}
                    </button>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Panel */}
      {selectedCell && (
        <Card className="p-4 space-y-4 border-primary">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Edit Cell</h4>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCell(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={editingSubject}
                onChange={(e) => setEditingSubject(e.target.value)}
                placeholder="e.g. Mathematics"
              />
            </div>

            <div>
              <Label htmlFor="teacher">Teacher</Label>
              <Input
                id="teacher"
                value={editingTeacher}
                onChange={(e) => setEditingTeacher(e.target.value)}
                placeholder="e.g. Mr. Smith"
              />
            </div>

            <div>
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={editingRoom}
                onChange={(e) => setEditingRoom(e.target.value)}
                placeholder="e.g. 101"
              />
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <Select value={editingColor} onValueChange={setEditingColor}>
                <SelectTrigger id="color">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: editingColor }}
                    />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
            {schedule[selectedCell] && (
              <Button onClick={handleDelete} variant="destructive">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

